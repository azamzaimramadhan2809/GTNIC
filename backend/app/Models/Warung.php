<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warung extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'phone',
        'address',
        'city',
        'province',
    ];

    /**
     * Warung dimiliki oleh satu user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Warung memiliki banyak kategori bahan.
     */
    public function ingredientCategories(): HasMany
    {
        return $this->hasMany(IngredientCategory::class);
    }

    /**
     * Warung memiliki banyak bahan.
     */
    public function ingredients(): HasMany
    {
        return $this->hasMany(Ingredient::class);
    }

    /**
     * Warung memiliki banyak menu.
     */
    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class);
    }

    public function menuCategories(): HasMany
    {
        return $this->hasMany(MenuCategory::class);
    }

    /**
     * Warung memiliki banyak transaksi penjualan.
     */
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    /**
     * Warung memiliki banyak pengeluaran.
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    /**
     * Warung memiliki banyak riwayat perubahan stok.
     */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }
}
