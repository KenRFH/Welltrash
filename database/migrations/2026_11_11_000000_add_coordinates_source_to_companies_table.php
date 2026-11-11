<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // 'manual' = di-set admin lewat picker (tidak boleh ditimpa geocoder), 'geocoded' = hasil Nominatim
            $table->string('coordinates_source', 20)->nullable()->after('longitude');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('coordinates_source');
        });
    }
};
