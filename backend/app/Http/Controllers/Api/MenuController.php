<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Warung;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);

        return response()->json([
            'menus' => $warung->menus()
                ->with('menuIngredients.ingredient:id,name,unit')
                ->when(
                    $request->has('available'),
                    fn ($query) => $query->where(
                        'is_available',
                        $request->boolean('available')
                    )
                )
                ->latest()
                ->paginate(15),
        ]);
    }

    public function store(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $menu = $warung->menus()->create($this->validateMenu($request));

        return response()->json([
            'message' => 'Menu berhasil dibuat.',
            'menu' => $menu,
        ], 201);
    }

    public function show(Request $request, int $warung, int $menu): JsonResponse
    {
        return response()->json([
            'menu' => $this->findMenu($request, $warung, $menu)
                ->load('menuIngredients.ingredient:id,name,stock,unit'),
        ]);
    }

    public function update(Request $request, int $warung, int $menu): JsonResponse
    {
        $menu = $this->findMenu($request, $warung, $menu);
        $menu->update($this->validateMenu($request, true));

        return response()->json([
            'message' => 'Menu berhasil diperbarui.',
            'menu' => $menu->fresh()
                ->load('menuIngredients.ingredient:id,name,stock,unit'),
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
    private function validateMenu(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
            'price' => [$required, 'numeric', 'min:0'],
            'is_available' => ['sometimes', 'boolean'],
        ]);
    }
}
