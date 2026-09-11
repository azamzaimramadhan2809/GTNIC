<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MenuRecipeController extends Controller
{
    public function update(Request $request, int $warung, int $menu): JsonResponse
    {
        $warung = $request->user()->warungs()->findOrFail($warung);
        $menu = $warung->menus()->findOrFail($menu);

        $validated = $request->validate([
            'ingredients' => ['required', 'array', 'min:1'],
            'ingredients.*.ingredient_id' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('ingredients', 'id')->where(
                    fn (Builder $query) => $query->where('warung_id', $warung->id)
                ),
            ],
            'ingredients.*.quantity' => ['required', 'numeric', 'gt:0'],
        ]);

        DB::transaction(function () use ($menu, $validated): void {
            $menu->menuIngredients()->delete();
            $menu->menuIngredients()->createMany($validated['ingredients']);
        });

        return response()->json([
            'message' => 'Resep menu berhasil diperbarui.',
            'menu' => $menu->fresh()
                ->load('menuIngredients.ingredient:id,name,stock,unit'),
        ]);
    }
}
