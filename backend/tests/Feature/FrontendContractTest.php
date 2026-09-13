<?php

namespace Tests\Feature;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FrontendContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_menu_stock_uses_limiting_ingredient_and_reports_match_checkout(): void
    {
        $this->travelTo(Carbon::parse('2026-09-12 12:00:00'));
        $user = User::factory()->create();
        $warung = $user->warungs()->create(['name' => 'Dapur']);
        $category = $warung->ingredientCategories()->create(['name' => 'Bahan']);
        $ingredient = $warung->ingredients()->create(['ingredient_category_id' => $category->id, 'name' => 'Beras', 'stock' => 250, 'minimum_stock' => 20, 'unit' => 'gram', 'purchase_price' => 10]);
        $menu = $warung->menus()->create(['name' => 'Nasi', 'price' => 5000]);
        $menu->menuIngredients()->create(['ingredient_id' => $ingredient->id, 'quantity' => 100]);
        Sanctum::actingAs($user);
        $this->getJson('/api/warungs/'.$warung->id.'/menus')->assertOk()->assertJsonPath('menus.data.0.available_stock', 2);
        $this->postJson('/api/warungs/'.$warung->id.'/sales', ['items' => [['menu_id' => $menu->id, 'quantity' => 2]], 'payment' => ['method' => 'cash', 'received_amount' => 12000]])->assertCreated()->assertJsonPath('sale.payment.change_amount', '2000.00');
        $this->getJson('/api/warungs/'.$warung->id.'/reports?date_from=2026-09-11&date_to=2026-09-12')->assertOk()
            ->assertJsonPath('summary.revenue', 10000)->assertJsonPath('summary.estimated_profit', 8000)
            ->assertJsonPath('chart.0.transactions', 0)->assertJsonPath('chart.1.transactions', 1)
            ->assertJsonPath('top_products.0.sold', 2)->assertJsonCount(1, 'transactions');
        $this->assertDatabaseHas('ingredients', ['id' => $ingredient->id, 'stock' => 50]);
        $this->getJson('/api/warungs/'.$warung->id.'/menus')->assertOk()->assertJsonPath('menus.data.0.available_stock', 0);
    }

    public function test_missing_recipe_cannot_appear_as_available_stock(): void
    {
        $user = User::factory()->create();
        $warung = $user->warungs()->create(['name' => 'Dapur']);
        $warung->menus()->create(['name' => 'Belum ada resep', 'price' => 5000]);
        Sanctum::actingAs($user);
        $this->getJson('/api/warungs/'.$warung->id.'/menus')->assertOk()->assertJsonPath('menus.data.0.available_stock', 0);
    }

    public function test_reports_require_authentication_and_reject_other_owner_and_invalid_dates(): void
    {
        $warung = User::factory()->create()->warungs()->create(['name' => 'Milik orang lain']);
        $path = '/api/warungs/'.$warung->id.'/reports?date_from=2026-09-11&date_to=2026-09-12';
        $this->getJson($path)->assertUnauthorized();
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $this->getJson($path)->assertNotFound();
        $own = $user->warungs()->create(['name' => 'Sendiri']);
        $this->getJson('/api/warungs/'.$own->id.'/reports?date_from=2026-09-12&date_to=2026-09-11')->assertUnprocessable()->assertJsonValidationErrors('date_to');
    }

    public function test_ingredient_initial_stock_edit_and_restock_are_recorded(): void
    {
        $this->travelTo(Carbon::parse('2026-09-12 12:00:00'));
        $user = User::factory()->create();
        $warung = $user->warungs()->create(['name' => 'Dapur']);
        $category = $warung->ingredientCategories()->create(['name' => 'Bahan']);
        Sanctum::actingAs($user);
        $path = '/api/warungs/'.$warung->id;
        $response = $this->postJson($path.'/ingredients', ['name' => 'Gula', 'ingredient_category_id' => $category->id, 'unit' => 'kg', 'stock' => 1.5, 'purchase_price' => 10000])->assertCreated();
        $id = $response->json('ingredient.id');
        $this->assertDatabaseHas('stock_movements', ['ingredient_id' => $id, 'quantity' => 1.5, 'type' => 'adjustment']);
        $this->patchJson($path.'/ingredients/'.$id, ['stock' => 1.25])->assertOk();
        $this->assertDatabaseHas('stock_movements', ['ingredient_id' => $id, 'quantity' => -0.25, 'type' => 'adjustment']);
        $this->postJson($path.'/stock-movements', ['ingredient_id' => $id, 'type' => 'purchase', 'quantity' => 0.5, 'occurred_at' => '2026-09-11'])->assertCreated();
        $this->assertDatabaseHas('ingredients', ['id' => $id, 'stock' => 1.75]);
        $this->assertDatabaseHas('stock_movements', ['ingredient_id' => $id, 'type' => 'purchase', 'created_at' => '2026-09-11 00:00:00']);
    }
}
