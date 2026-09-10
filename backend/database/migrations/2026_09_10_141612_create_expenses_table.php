<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('warung_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('ingredient_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('description');

            $table->decimal('amount', 12, 2);

            $table->date('expense_date');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};