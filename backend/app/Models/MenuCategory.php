<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuCategory extends Model
{
    protected $fillable = [
        'warung_id',
        'name',
        'description',
    ];

    public function warung(): BelongsTo
    {
        return $this->belongsTo(Warung::class);
    }

    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class);
    }
}
