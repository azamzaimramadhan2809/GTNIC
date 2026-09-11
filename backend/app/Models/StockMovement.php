<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StockMovement extends Model
{
    protected $fillable = [
        'warung_id',
        'ingredient_id',
        'type',
        'quantity',
        'note',
        'reference_type',
        'reference_id',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'reference_id' => 'integer',
    ];

    /**
     * Pergerakan stok terjadi pada satu warung.
     */
    public function warung(): BelongsTo
    {
        return $this->belongsTo(Warung::class);
    }

    /**
     * Pergerakan stok berkaitan dengan satu bahan.
     */
    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }

    /**
     * Sumber perubahan stok, misalnya transaksi penjualan.
     */
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }
}
