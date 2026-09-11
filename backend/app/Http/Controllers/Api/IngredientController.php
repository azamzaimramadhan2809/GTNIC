<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\Warung;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class IngredientController extends Controller
{
    public function index(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);

        $ingredients = $warung->ingredients()
            ->with('category:id,name')
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
                    'ingredient_category_id',
                    $request->integer('category_id')
                )
            )
            ->when(
                $request->boolean('low_stock'),
                fn ($query) => $query->whereColumn('stock', '<=', 'minimum_stock')
            )
            ->latest()
            ->paginate(15);

        return response()->json([
            'ingredients' => $ingredients,
        ]);
    }

    public function store(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $ingredient = $warung->ingredients()->create(
            $this->validateIngredient($request, $warung)
        );

        return response()->json([
            'message' => 'Bahan berhasil dibuat.',
            'ingredient' => $ingredient->load('category:id,name'),
        ], 201);
    }

    public function show(Request $request, int $warung, int $ingredient): JsonResponse
    {
        return response()->json([
            'ingredient' => $this->findIngredient($request, $warung, $ingredient)
                ->load('category:id,name'),
        ]);
    }

    public function update(
        Request $request,
        int $warung,
        int $ingredient
    ): JsonResponse {
        $warungModel = $this->findUserWarung($request, $warung);
        $ingredient = $warungModel->ingredients()->findOrFail($ingredient);
        $ingredient->update(
            $this->validateIngredient($request, $warungModel, true)
        );

        return response()->json([
            'message' => 'Bahan berhasil diperbarui.',
            'ingredient' => $ingredient->fresh()->load('category:id,name'),
        ]);
    }

    public function destroy(
        Request $request,
        int $warung,
        int $ingredient
    ): JsonResponse {
        $this->findIngredient($request, $warung, $ingredient)->delete();

        return response()->json([
            'message' => 'Bahan berhasil dihapus.',
        ]);
    }

    private function findUserWarung(Request $request, int $warung): Warung
    {
        return $request->user()->warungs()->findOrFail($warung);
    }

    private function findIngredient(
        Request $request,
        int $warung,
        int $ingredient
    ): Ingredient {
        return $this->findUserWarung($request, $warung)
            ->ingredients()
            ->findOrFail($ingredient);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateIngredient(
        Request $request,
        Warung $warung,
        bool $partial = false
    ): array {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'ingredient_category_id' => [
                $required,
                'integer',
                Rule::exists('ingredient_categories', 'id')->where(
                    fn (Builder $query) => $query->where('warung_id', $warung->id)
                ),
            ],
            'name' => [$required, 'string', 'max:255'],
            'stock' => ['sometimes', 'numeric', 'min:0'],
            'minimum_stock' => ['sometimes', 'numeric', 'min:0'],
            'unit' => [$required, 'string', 'max:30'],
            'purchase_price' => ['sometimes', 'numeric', 'min:0'],
        ]);
    }
}
