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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('license_plate', 20)->unique();
            $table->string('type', 50)->default('Truk Bak');
            $table->string('capacity', 50)->nullable();
            $table->string('status', 20)->default('active'); // active, maintenance, inactive
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('vehicle_id')
                ->nullable()
                ->after('role')
                ->constrained('vehicles')
                ->nullOnDelete();
        });

        Schema::table('pickups', function (Blueprint $table) {
            $table->foreignId('vehicle_id')
                ->nullable()
                ->after('cleanup_id')
                ->constrained('vehicles')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pickups', function (Blueprint $table) {
            $table->dropForeign(['vehicle_id']);
            $table->dropColumn('vehicle_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['vehicle_id']);
            $table->dropColumn('vehicle_id');
        });

        Schema::dropIfExists('vehicles');
    }
};
