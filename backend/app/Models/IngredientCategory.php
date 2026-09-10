<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IngredientCategory extends Model
{
    protected $fillable = [
        'warung_id',
        'name',
        'description',
    ];

    /**
     * Kategori bahan dimiliki oleh satu warung.
     */
    public function warung(): BelongsTo
    {
        return $this->belongsTo(Warung::class);
    }

    /**
     * Kategori memiliki banyak bahan.
     */
    public function ingredients(): HasMany
    {
        return $this->hasMany(Ingredient::class);
    }
}