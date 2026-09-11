<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\IngredientCategoryController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MenuRecipeController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\StockMovementController;
use App\Http\Controllers\Api\WarungController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:60,1')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/user', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::apiResource('warungs', WarungController::class);

        Route::prefix('warungs/{warung}')->name('warungs.')->group(function (): void {
            Route::apiResource(
                'ingredient-categories',
                IngredientCategoryController::class
            )->parameters(['ingredient-categories' => 'category']);

            Route::apiResource('ingredients', IngredientController::class);
            Route::apiResource('menus', MenuController::class);
            Route::put('menus/{menu}/recipe', [MenuRecipeController::class, 'update'])
                ->name('menus.recipe.update');

            Route::apiResource('sales', SaleController::class)
                ->only(['index', 'store', 'show']);
            Route::post('sales/{sale}/cancel', [SaleController::class, 'cancel'])
                ->name('sales.cancel');

            Route::apiResource('expenses', ExpenseController::class);
            Route::apiResource('stock-movements', StockMovementController::class)
                ->only(['index', 'store', 'show'])
                ->parameters(['stock-movements' => 'stockMovement']);

            Route::get('dashboard', [DashboardController::class, 'show'])
                ->name('dashboard.show');
        });
    });
});
