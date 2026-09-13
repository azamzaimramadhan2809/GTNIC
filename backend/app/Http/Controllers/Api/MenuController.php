<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Warung;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MenuController extends Controller
{
    public function index(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);

        return response()->json([
            'menus' => $warung->menus()
                ->with([
                    'category:id,name',
                    'menuIngredients.ingredient:id,name,stock,unit',
                ])
                ->when(
                    $request->filled('search'),
                    fn ($query) => $query->where(
                        'name',
                        'like',
                        '%'.$request->string('search')->toString().'%'
                    )
                )
                ->when(
                    $request->filled('category_id'),
                    fn ($query) => $query->where(
                        'menu_category_id',
                        $request->integer('category_id')
                    )
                )
                ->when(
                    $request->has('available'),
                    fn ($query) => $query->where(
                        'is_available',
                        $request->boolean('available')
                    )
                )
                ->latest()
                ->paginate(15)->through(function (Menu $menu): Menu {
                    $menu->setAttribute('available_stock', $menu->is_available && $menu->menuIngredients->isNotEmpty()
                        ? (int) $menu->menuIngredients->min(fn ($recipe) => $recipe->ingredient && (float) $recipe->quantity > 0
                            ? floor((float) $recipe->ingredient->stock / (float) $recipe->quantity) : 0) : 0);

                    return $menu;
                }),
        ]);
    }

    public function store(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $menu = $warung->menus()->create($this->validateMenu($request, $warung));

        return response()->json([
            'message' => 'Menu berhasil dibuat.',
            'menu' => $menu,
        ], 201);
    }

    public function show(Request $request, int $warung, int $menu): JsonResponse
    {
        return response()->json([
            'menu' => $this->findMenu($request, $warung, $menu)
                ->load([
                    'category:id,name',
                    'menuIngredients.ingredient:id,name,stock,unit',
                ]),
        ]);
    }

    public function update(Request $request, int $warung, int $menu): JsonResponse
    {
        $warungModel = $this->findUserWarung($request, $warung);
        $menu = $warungModel->menus()->findOrFail($menu);
        $menu->update($this->validateMenu($request, $warungModel, true));

        return response()->json([
            'message' => 'Menu berhasil diperbarui.',
            'menu' => $menu->fresh()
                ->load([
                    'category:id,name',
                    'menuIngredients.ingredient:id,name,stock,unit',
                ]),
        ]);
    }

    public function destroy(Request $request, int $warung, int $menu): JsonResponse
    {
        $menu = $this->findMenu($request, $warung, $menu);

        if ($menu->saleItems()->exists()) {
            return response()->json([
                'message' => 'Menu yang sudah memiliki riwayat penjualan tidak dapat dihapus.',
            ], 409);
        }

        $menu->delete();

        return response()->json(['message' => 'Menu berhasil dihapus.']);
    }

    private function findUserWarung(Request $request, int $warung): Warung
    {
        return $request->user()->warungs()->findOrFail($warung);
    }

    private function findMenu(Request $request, int $warung, int $menu): Menu
    {
        return $this->findUserWarung($request, $warung)
            ->menus()
            ->findOrFail($menu);
    }

    /** @return array<string, mixed> */
    private function validateMenu(
        Request $request,
        Warung $warung,
        bool $partial = false
    ): array {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'menu_category_id' => [
                'nullable',
                'integer',
                Rule::exists('menu_categories', 'id')->where(
                    fn (Builder $query) => $query->where('warung_id', $warung->id)
                ),
            ],
            'name' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
            'price' => [$required, 'numeric', 'min:0'],
            'is_available' => ['sometimes', 'boolean'],
        ]);
    }
}
