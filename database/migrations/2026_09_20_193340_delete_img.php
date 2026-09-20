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
            $table->dropColumn(['organic_image_path', 'anorganic_image_path', 'residue_image_path']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pickups', function (Blueprint $table) {
            $table->string('organic_image_path')->nullable();
            $table->string('anorganic_image_path')->nullable();
            $table->string('residue_image_path')->nullable();
        });
    }
};
