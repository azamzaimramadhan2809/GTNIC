<?php

namespace Tests\Feature;

use App\Models\IngredientCategory;
use App\Models\User;
use App\Models\Warung;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InventoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_manage_warung_categories_and_ingredients(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $warungResponse = $this->postJson('/api/warungs', [
            'name' => 'Warung Zaim',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
        ])->assertCreated();

        $warungId = $warungResponse->json('warung.id');

        $categoryResponse = $this->postJson(
            "/api/warungs/{$warungId}/ingredient-categories",
            [
                'name' => 'Bahan Pokok',
                'description' => 'Bahan utama dapur',
            ]
        )->assertCreated();

        $categoryId = $categoryResponse->json('category.id');

        $ingredientResponse = $this->postJson(
            "/api/warungs/{$warungId}/ingredients",
            [
                'ingredient_category_id' => $categoryId,
                'name' => 'Beras',
                'stock' => 1000,
                'minimum_stock' => 2000,
                'unit' => 'gram',
            ]
        )->assertCreated();

        $ingredientId = $ingredientResponse->json('ingredient.id');

        $this->getJson("/api/warungs/{$warungId}/ingredients?low_stock=true")
            ->assertOk()
            ->assertJsonPath('ingredients.data.0.id', $ingredientId);

        $this->patchJson(
            "/api/warungs/{$warungId}/ingredients/{$ingredientId}",
            ['stock' => 3000]
        )->assertOk()->assertJsonPath('ingredient.stock', '3000.00');

        $this->deleteJson(
            "/api/warungs/{$warungId}/ingredient-categories/{$categoryId}"
        )->assertStatus(409);

        $this->deleteJson(
            "/api/warungs/{$warungId}/ingredients/{$ingredientId}"
        )->assertOk();

        $this->deleteJson(
            "/api/warungs/{$warungId}/ingredient-categories/{$categoryId}"
        )->assertOk();

        $this->deleteJson("/api/warungs/{$warungId}")
            ->assertOk();

        $this->assertDatabaseMissing('warungs', ['id' => $warungId]);
        $this->assertDatabaseMissing('ingredients', ['id' => $ingredientId]);
    }

    public function test_user_cannot_access_another_users_warung(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $warung = Warung::create([
            'user_id' => $owner->id,
            'name' => 'Warung Milik Orang Lain',
        ]);

        Sanctum::actingAs($otherUser);

        $this->getJson("/api/warungs/{$warung->id}")
            ->assertNotFound();

        $this->getJson("/api/warungs/{$warung->id}/ingredients")
            ->assertNotFound();
    }

    public function test_ingredient_category_must_belong_to_the_same_warung(): void
    {
        $user = User::factory()->create();
        $firstWarung = Warung::create([
            'user_id' => $user->id,
            'name' => 'Warung Pertama',
        ]);
        $secondWarung = Warung::create([
            'user_id' => $user->id,
            'name' => 'Warung Kedua',
        ]);
        $otherCategory = IngredientCategory::create([
            'warung_id' => $secondWarung->id,
            'name' => 'Kategori Warung Kedua',
        ]);

        Sanctum::actingAs($user);

        $this->postJson("/api/warungs/{$firstWarung->id}/ingredients", [
            'ingredient_category_id' => $otherCategory->id,
            'name' => 'Beras',
            'stock' => 1000,
            'minimum_stock' => 100,
            'unit' => 'gram',
        ])->assertUnprocessable()->assertJsonValidationErrors(
            'ingredient_category_id'
        );
    }
}
