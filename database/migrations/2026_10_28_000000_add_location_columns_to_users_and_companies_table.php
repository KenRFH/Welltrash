<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('current_lat', 10, 7)->nullable()->after('daily_salary');
            $table->decimal('current_lng', 10, 7)->nullable()->after('current_lat');
            $table->timestamp('last_location_at')->nullable()->after('current_lng');
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('address');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['current_lat', 'current_lng', 'last_location_at']);
        });

        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
