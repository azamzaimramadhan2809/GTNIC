<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ingredient extends Model
{
    protected $fillable = [
        'warung_id',
        'ingredient_category_id',
        'name',
        'stock',
        'minimum_stock',
        'unit',
        'purchase_price',
    ];

    protected $casts = [
        'stock' => 'decimal:2',
        'minimum_stock' => 'decimal:2',
        'purchase_price' => 'decimal:2',
    ];

    /**
     * Bahan dimiliki oleh satu warung.
     */
    public function warung(): BelongsTo
    {
        return $this->belongsTo(Warung::class);
    }

    /**
     * Bahan termasuk dalam satu kategori.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(
            IngredientCategory::class,
            'ingredient_category_id'
        );
    }

    /**
     * Bahan digunakan oleh banyak menu.
     */
    public function menuIngredients(): HasMany
    {
        return $this->hasMany(MenuIngredient::class);
    }

    /**
     * Bahan memiliki banyak riwayat perubahan stok.
     */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Bahan dapat memiliki banyak pengeluaran pembelian.
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }
}
