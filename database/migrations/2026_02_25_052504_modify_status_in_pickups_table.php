<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pickups', function (Blueprint $table) {
            // Modify the status column
            $table->enum('status', ['scheduled', 'on_the_way', 'completed', 'failed'])->default('scheduled')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pickups', function (Blueprint $table) {
            $table->enum('status', ['pending', 'on_the_way', 'picking', 'picked', 'cancelled'])->default('pending')->change();
        });
    }
};
