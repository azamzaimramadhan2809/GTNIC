<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BusinessFlowApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_complete_pos_flow_updates_and_restores_stock(): void
    {
        $user = User::factory()->create();
        $warung = $user->warungs()->create(['name' => 'Warung Zaim']);
        $category = $warung->ingredientCategories()->create([
            'name' => 'Bahan Pokok',
        ]);
        $ingredient = $warung->ingredients()->create([
            'ingredient_category_id' => $category->id,
            'name' => 'Beras',
            'stock' => 1000,
            'minimum_stock' => 200,
            'unit' => 'gram',
            'purchase_price' => 5,
        ]);

        Sanctum::actingAs($user);

        $menuCategoryResponse = $this->postJson(
            "/api/warungs/{$warung->id}/menu-categories",
            ['name' => 'Makanan']
        )->assertCreated();
        $menuCategoryId = $menuCategoryResponse->json('category.id');

        $menuResponse = $this->postJson("/api/warungs/{$warung->id}/menus", [
            'menu_category_id' => $menuCategoryId,
            'name' => 'Nasi Goreng',
            'price' => 15000,
            'is_available' => true,
        ])->assertCreated();
        $menuId = $menuResponse->json('menu.id');

        $this->getJson(
            "/api/warungs/{$warung->id}/menus?search=nasi&category_id={$menuCategoryId}"
        )->assertOk()->assertJsonPath('menus.data.0.id', $menuId);

        $this->putJson("/api/warungs/{$warung->id}/menus/{$menuId}/recipe", [
            'ingredients' => [
                [
                    'ingredient_id' => $ingredient->id,
                    'quantity' => 100,
                ],
            ],
        ])->assertOk()->assertJsonPath(
            'menu.menu_ingredients.0.ingredient.name',
            'Beras'
        );

        $this->postJson("/api/warungs/{$warung->id}/stock-movements", [
            'ingredient_id' => $ingredient->id,
            'type' => 'purchase',
            'quantity' => 500,
            'note' => 'Pembelian stok',
        ])->assertCreated()->assertJsonPath(
            'stock_movement.ingredient.stock',
            '1500.00'
        );

        $this->postJson("/api/warungs/{$warung->id}/expenses", [
            'ingredient_id' => $ingredient->id,
            'description' => 'Beli beras',
            'amount' => 20000,
            'expense_date' => now()->toDateString(),
        ])->assertCreated();

        $saleResponse = $this->postJson("/api/warungs/{$warung->id}/sales", [
            'items' => [
                ['menu_id' => $menuId, 'quantity' => 2],
            ],
            'discount' => 0,
            'tax' => 5000,
            'payment' => [
                'method' => 'cash',
                'received_amount' => 50000,
            ],
        ])->assertCreated()
            ->assertJsonPath('sale.subtotal', '30000.00')
            ->assertJsonPath('sale.total', '35000.00')
            ->assertJsonPath('sale.payment.change_amount', '15000.00');

        $saleId = $saleResponse->json('sale.id');

        $this->assertDatabaseHas('ingredients', [
            'id' => $ingredient->id,
            'stock' => 1300,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'ingredient_id' => $ingredient->id,
            'type' => 'sale',
            'quantity' => -200,
            'reference_id' => $saleId,
        ]);

        $this->getJson("/api/warungs/{$warung->id}/dashboard")
            ->assertOk()
            ->assertJsonPath('summary.revenue', 35000)
            ->assertJsonPath('summary.expenses', 20000)
            ->assertJsonPath('summary.net_income', 15000)
            ->assertJsonPath('summary.estimated_cogs', 1000)
            ->assertJsonPath('summary.estimated_profit', 14000)
            ->assertJsonPath('summary.sales_count', 1)
            ->assertJsonPath('top_menus.0.name', 'Nasi Goreng');

        $this->deleteJson("/api/warungs/{$warung->id}/menus/{$menuId}")
            ->assertStatus(409);

        $this->postJson("/api/warungs/{$warung->id}/sales/{$saleId}/cancel")
            ->assertOk()
            ->assertJsonPath('sale.status', 'cancelled')
            ->assertJsonPath('sale.payment.status', 'refunded');

        $this->assertDatabaseHas('ingredients', [
            'id' => $ingredient->id,
            'stock' => 1500,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'ingredient_id' => $ingredient->id,
            'type' => 'return',
            'quantity' => 200,
            'reference_id' => $saleId,
        ]);
    }

    public function test_sale_is_rejected_without_enough_stock_and_rolls_back(): void
    {
        $user = User::factory()->create();
        $warung = $user->warungs()->create(['name' => 'Warung Zaim']);
        $category = $warung->ingredientCategories()->create([
            'name' => 'Bahan Pokok',
        ]);
        $ingredient = $warung->ingredients()->create([
            'ingredient_category_id' => $category->id,
            'name' => 'Beras',
            'stock' => 100,
            'minimum_stock' => 20,
            'unit' => 'gram',
        ]);
        $menu = $warung->menus()->create([
            'name' => 'Nasi Goreng',
            'price' => 15000,
            'is_available' => true,
        ]);
        $menu->menuIngredients()->create([
            'ingredient_id' => $ingredient->id,
            'quantity' => 200,
        ]);

        Sanctum::actingAs($user);

        $this->postJson("/api/warungs/{$warung->id}/sales", [
            'items' => [['menu_id' => $menu->id, 'quantity' => 1]],
            'payment' => [
                'method' => 'cash',
                'received_amount' => 20000,
            ],
        ])->assertUnprocessable()->assertJsonValidationErrors('stock');

        $this->assertDatabaseCount('sales', 0);
        $this->assertDatabaseHas('ingredients', [
            'id' => $ingredient->id,
            'stock' => 100,
        ]);
    }
}
