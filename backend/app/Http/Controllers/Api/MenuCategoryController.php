<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuCategory;
use App\Models\Warung;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MenuCategoryController extends Controller
{
    public function index(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);

        return response()->json([
            'categories' => $warung->menuCategories()
                ->withCount('menus')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $category = $warung->menuCategories()->create(
            $this->validateCategory($request, $warung)
        );

        return response()->json([
            'message' => 'Kategori menu berhasil dibuat.',
            'category' => $category,
        ], 201);
    }

    public function show(Request $request, int $warung, int $menuCategory): JsonResponse
    {
        return response()->json([
            'category' => $this->findCategory($request, $warung, $menuCategory)
                ->loadCount('menus'),
        ]);
    }

    public function update(
        Request $request,
        int $warung,
        int $menuCategory
    ): JsonResponse {
        $warungModel = $this->findUserWarung($request, $warung);
        $category = $warungModel->menuCategories()->findOrFail($menuCategory);
        $category->update(
            $this->validateCategory($request, $warungModel, $category, true)
        );

        return response()->json([
            'message' => 'Kategori menu berhasil diperbarui.',
            'category' => $category->fresh()->loadCount('menus'),
        ]);
    }

    public function destroy(
        Request $request,
        int $warung,
        int $menuCategory
    ): JsonResponse {
        $this->findCategory($request, $warung, $menuCategory)->delete();

        return response()->json(['message' => 'Kategori menu berhasil dihapus.']);
    }

    private function findUserWarung(Request $request, int $warung): Warung
    {
        return $request->user()->warungs()->findOrFail($warung);
    }

    private function findCategory(
        Request $request,
        int $warung,
        int $menuCategory
    ): MenuCategory {
        return $this->findUserWarung($request, $warung)
            ->menuCategories()
            ->findOrFail($menuCategory);
    }

    /** @return array<string, mixed> */
    private function validateCategory(
        Request $request,
        Warung $warung,
        ?MenuCategory $category = null,
        bool $partial = false
    ): array {
        return $request->validate([
            'name' => [
                $partial ? 'sometimes' : 'required',
                'string',
                'max:255',
                Rule::unique('menu_categories', 'name')
                    ->where('warung_id', $warung->id)
                    ->ignore($category?->id),
            ],
            'description' => ['nullable', 'string'],
        ]);
    }
}
