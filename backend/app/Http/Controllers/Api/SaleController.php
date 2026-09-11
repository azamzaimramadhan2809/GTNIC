<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Warung;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SaleController extends Controller
{
    public function index(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $request->validate([
            'status' => ['nullable', Rule::in(['completed', 'cancelled'])],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        return response()->json([
            'sales' => $warung->sales()
                ->with(['payment', 'saleItems.menu:id,name'])
                ->when(
                    $request->filled('status'),
                    fn ($query) => $query->where(
                        'status',
                        $request->string('status')->toString()
                    )
                )
                ->when(
                    $request->filled('date_from'),
                    fn ($query) => $query->whereDate('created_at', '>=', $request->date('date_from'))
                )
                ->when(
                    $request->filled('date_to'),
                    fn ($query) => $query->whereDate('created_at', '<=', $request->date('date_to'))
                )
                ->latest()
                ->paginate(15),
        ]);
    }

    public function store(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_id' => ['required', 'integer', 'distinct'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'discount' => ['sometimes', 'numeric', 'min:0'],
            'tax' => ['sometimes', 'numeric', 'min:0'],
            'payment' => ['required', 'array'],
            'payment.method' => [
                'required',
                Rule::in(['cash', 'qris', 'transfer', 'card']),
            ],
            'payment.received_amount' => [
                'nullable',
                'required_if:payment.method,cash',
                'numeric',
                'min:0',
            ],
            'payment.reference' => ['nullable', 'string', 'max:255'],
        ]);

        $sale = DB::transaction(
            fn () => $this->createSale($warung, $validated)
        );

        return response()->json([
            'message' => 'Transaksi berhasil dibuat.',
            'sale' => $sale->load([
                'payment',
                'saleItems.menu:id,name',
                'stockMovements.ingredient:id,name,stock,unit',
            ]),
        ], 201);
    }

    public function show(Request $request, int $warung, int $sale): JsonResponse
    {
        return response()->json([
            'sale' => $this->findSale($request, $warung, $sale)->load([
                'payment',
                'saleItems.menu:id,name',
                'stockMovements.ingredient:id,name,stock,unit',
            ]),
        ]);
    }

    public function cancel(Request $request, int $warung, int $sale): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);

        $sale = DB::transaction(function () use ($warung, $sale): Sale {
            $sale = $warung->sales()->lockForUpdate()->findOrFail($sale);

            if ($sale->status === 'cancelled') {
                throw ValidationException::withMessages([
                    'sale' => 'Transaksi sudah dibatalkan.',
                ]);
            }

            $movements = $sale->stockMovements()
                ->where('type', 'sale')
                ->get();
            $ingredients = $warung->ingredients()
                ->whereIn('id', $movements->pluck('ingredient_id'))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($movements as $movement) {
                $ingredient = $ingredients->get($movement->ingredient_id);

                if (! $ingredient) {
                    continue;
                }

                $quantity = abs((float) $movement->quantity);
                $ingredient->increment('stock', $quantity);
                $sale->stockMovements()->create([
                    'warung_id' => $warung->id,
                    'ingredient_id' => $ingredient->id,
                    'type' => 'return',
                    'quantity' => $quantity,
                    'note' => 'Pengembalian stok dari pembatalan transaksi.',
                ]);
            }

            $sale->update(['status' => 'cancelled']);
            $sale->payment()->update(['status' => 'refunded']);

            return $sale;
        });

        return response()->json([
            'message' => 'Transaksi berhasil dibatalkan dan stok dikembalikan.',
            'sale' => $sale->fresh()->load(['payment', 'saleItems.menu:id,name']),
        ]);
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function createSale(Warung $warung, array $validated): Sale
    {
        $menuIds = collect($validated['items'])->pluck('menu_id');
        $menus = $warung->menus()
            ->whereIn('id', $menuIds)
            ->with('menuIngredients')
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        if ($menus->count() !== $menuIds->count()) {
            throw ValidationException::withMessages([
                'items' => 'Salah satu menu tidak ditemukan di warung ini.',
            ]);
        }

        $subtotal = 0.0;
        $requiredIngredients = [];

        foreach ($validated['items'] as $item) {
            $menu = $menus->get($item['menu_id']);

            if (! $menu->is_available) {
                throw ValidationException::withMessages([
                    'items' => "Menu {$menu->name} sedang tidak tersedia.",
                ]);
            }

            if ($menu->menuIngredients->isEmpty()) {
                throw ValidationException::withMessages([
                    'items' => "Menu {$menu->name} belum memiliki resep.",
                ]);
            }

            $subtotal += (float) $menu->price * $item['quantity'];

            foreach ($menu->menuIngredients as $recipe) {
                $requiredIngredients[$recipe->ingredient_id] =
                    ($requiredIngredients[$recipe->ingredient_id] ?? 0)
                    + ((float) $recipe->quantity * $item['quantity']);
            }
        }

        $subtotal = round($subtotal, 2);
        $discount = round((float) ($validated['discount'] ?? 0), 2);
        $tax = round((float) ($validated['tax'] ?? 0), 2);

        if ($discount > $subtotal) {
            throw ValidationException::withMessages([
                'discount' => 'Diskon tidak boleh melebihi subtotal.',
            ]);
        }

        $total = round($subtotal - $discount + $tax, 2);
        $ingredients = $warung->ingredients()
            ->whereIn('id', array_keys($requiredIngredients))
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        foreach ($requiredIngredients as $ingredientId => $quantity) {
            $ingredient = $ingredients->get($ingredientId);

            if (! $ingredient || (float) $ingredient->stock < $quantity) {
                $name = $ingredient?->name ?? "ID {$ingredientId}";
                throw ValidationException::withMessages([
                    'stock' => "Stok {$name} tidak mencukupi.",
                ]);
            }
        }

        $method = $validated['payment']['method'];
        $received = $method === 'cash'
            ? round((float) $validated['payment']['received_amount'], 2)
            : $total;

        if ($received < $total) {
            throw ValidationException::withMessages([
                'payment.received_amount' => 'Nominal diterima kurang dari total transaksi.',
            ]);
        }

        $sale = $warung->sales()->create([
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
            'status' => 'completed',
        ]);

        foreach ($validated['items'] as $item) {
            $menu = $menus->get($item['menu_id']);
            $sale->saleItems()->create([
                'menu_id' => $menu->id,
                'quantity' => $item['quantity'],
                'unit_price' => $menu->price,
                'subtotal' => round((float) $menu->price * $item['quantity'], 2),
            ]);
        }

        $sale->payment()->create([
            'method' => $method,
            'amount' => $total,
            'received_amount' => $received,
            'change_amount' => round($received - $total, 2),
            'status' => 'paid',
            'reference' => $validated['payment']['reference'] ?? null,
            'paid_at' => now(),
        ]);

        foreach ($requiredIngredients as $ingredientId => $quantity) {
            $ingredient = $ingredients->get($ingredientId);
            $ingredient->decrement('stock', $quantity);
            $sale->stockMovements()->create([
                'warung_id' => $warung->id,
                'ingredient_id' => $ingredient->id,
                'type' => 'sale',
                'quantity' => -$quantity,
                'note' => 'Pemakaian bahan dari transaksi penjualan.',
            ]);
        }

        return $sale;
    }

    private function findUserWarung(Request $request, int $warung): Warung
    {
        return $request->user()->warungs()->findOrFail($warung);
    }

    private function findSale(Request $request, int $warung, int $sale): Sale
    {
        return $this->findUserWarung($request, $warung)
            ->sales()
            ->findOrFail($sale);
    }
}
