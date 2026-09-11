<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IngredientCategory;
use App\Models\Warung;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IngredientCategoryController extends Controller
{
    public function index(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);

        return response()->json([
            'categories' => $warung->ingredientCategories()
                ->withCount('ingredients')
                ->latest()
                ->paginate(15),
        ]);
    }

    public function store(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $category = $warung->ingredientCategories()->create(
            $this->validateCategory($request)
        );

        return response()->json([
            'message' => 'Kategori bahan berhasil dibuat.',
            'category' => $category,
        ], 201);
    }

    public function show(Request $request, int $warung, int $category): JsonResponse
    {
        return response()->json([
            'category' => $this->findCategory($request, $warung, $category)
                ->loadCount('ingredients'),
        ]);
    }

    public function update(
        Request $request,
        int $warung,
        int $category
    ): JsonResponse {
        $category = $this->findCategory($request, $warung, $category);
        $category->update($this->validateCategory($request, true));

        return response()->json([
            'message' => 'Kategori bahan berhasil diperbarui.',
            'category' => $category->fresh()->loadCount('ingredients'),
        ]);
    }

    public function destroy(
        Request $request,
        int $warung,
        int $category
    ): JsonResponse {
        $category = $this->findCategory($request, $warung, $category);

        if ($category->ingredients()->exists()) {
            return response()->json([
                'message' => 'Kategori yang masih memiliki bahan tidak dapat dihapus.',
            ], 409);
        }

        $category->delete();

        return response()->json([
            'message' => 'Kategori bahan berhasil dihapus.',
        ]);
    }

    private function findUserWarung(Request $request, int $warung): Warung
    {
        return $request->user()->warungs()->findOrFail($warung);
    }

    private function findCategory(
        Request $request,
        int $warung,
        int $category
    ): IngredientCategory {
        return $this->findUserWarung($request, $warung)
            ->ingredientCategories()
            ->findOrFail($category);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateCategory(Request $request, bool $partial = false): array
    {
        return $request->validate([
            'name' => [$partial ? 'sometimes' : 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);
    }
}
