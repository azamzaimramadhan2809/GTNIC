<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockMovement;
use App\Models\Warung;
use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StockMovementController extends Controller
{
    public function index(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $request->validate([
            'type' => ['nullable', Rule::in(['purchase', 'sale', 'adjustment', 'return'])],
            'ingredient_id' => ['nullable', 'integer'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        return response()->json([
            'stock_movements' => $warung->stockMovements()
                ->with('ingredient:id,name,unit')
                ->when(
                    $request->filled('type'),
                    fn ($query) => $query->where(
                        'type',
                        $request->string('type')->toString()
                    )
                )
                ->when(
                    $request->filled('ingredient_id'),
                    fn ($query) => $query->where('ingredient_id', $request->integer('ingredient_id'))
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
                ->paginate(20),
        ]);
    }

    public function store(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $validated = $request->validate([
            'ingredient_id' => [
                'required',
                'integer',
                Rule::exists('ingredients', 'id')->where(
                    fn (Builder $query) => $query->where('warung_id', $warung->id)
                ),
            ],
            'type' => ['required', Rule::in(['purchase', 'adjustment', 'return'])],
            'quantity' => ['required', 'numeric', 'not_in:0'],
            'note' => ['nullable', 'string'],
            'occurred_at' => ['nullable', 'date_format:Y-m-d', 'before_or_equal:today'],
        ]);

        if (in_array($validated['type'], ['purchase', 'return'], true)
            && (float) $validated['quantity'] < 0) {
            throw ValidationException::withMessages([
                'quantity' => 'Jumlah purchase atau return harus positif.',
            ]);
        }

        $movement = DB::transaction(function () use ($warung, $validated): StockMovement {
            $ingredient = $warung->ingredients()
                ->lockForUpdate()
                ->findOrFail($validated['ingredient_id']);
            $newStock = (float) $ingredient->stock + (float) $validated['quantity'];

            if ($newStock < 0) {
                throw ValidationException::withMessages([
                    'quantity' => 'Penyesuaian akan membuat stok menjadi negatif.',
                ]);
            }

            $ingredient->update(['stock' => $newStock]);

            $occurredAt = $validated['occurred_at'] ?? null;
            unset($validated['occurred_at']);
            $movement = $warung->stockMovements()->make([
                ...$validated,
                'reference_type' => null,
                'reference_id' => null,
            ]);
            $movement->created_at = $occurredAt ? Carbon::parse($occurredAt) : now();
            $movement->save();

            return $movement;
        });

        return response()->json([
            'message' => 'Stok berhasil disesuaikan.',
            'stock_movement' => $movement->load('ingredient:id,name,stock,unit'),
        ], 201);
    }

    public function show(
        Request $request,
        int $warung,
        int $stockMovement
    ): JsonResponse {
        $warung = $this->findUserWarung($request, $warung);

        return response()->json([
            'stock_movement' => $warung->stockMovements()
                ->with('ingredient:id,name,stock,unit')
                ->findOrFail($stockMovement),
        ]);
    }

    private function findUserWarung(Request $request, int $warung): Warung
    {
        return $request->user()->warungs()->findOrFail($warung);
    }
}
