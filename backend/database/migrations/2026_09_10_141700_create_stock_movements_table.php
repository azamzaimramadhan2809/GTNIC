<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('warung_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('ingredient_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('type');

            $table->decimal('quantity', 10, 2);

            $table->text('note')->nullable();

            $table->string('reference_type')->nullable();

            $table->unsignedBigInteger('reference_id')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};