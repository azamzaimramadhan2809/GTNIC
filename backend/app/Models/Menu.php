<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    protected $fillable = [
        'warung_id',
        'name',
        'description',
        'image',
        'price',
        'is_available',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    /**
     * Menu dimiliki oleh satu warung.
     */
    public function warung(): BelongsTo
    {
        return $this->belongsTo(Warung::class);
    }

    /**
     * Menu memiliki banyak bahan dalam resepnya.
     */
    public function menuIngredients(): HasMany
    {
        return $this->hasMany(MenuIngredient::class);
    }

    /**
     * Menu dapat muncul di banyak item transaksi.
     */
    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }
}