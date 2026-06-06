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
        Schema::table('attendances', function (Blueprint $table) {
            $table->dateTime('overtime_clock_in_at')->nullable()->after('status');
            $table->string('overtime_clock_in_photo')->nullable()->after('overtime_clock_in_at');
            $table->decimal('overtime_clock_in_lat', 10, 7)->nullable()->after('overtime_clock_in_photo');
            $table->decimal('overtime_clock_in_lng', 10, 7)->nullable()->after('overtime_clock_in_lat');

            $table->dateTime('overtime_clock_out_at')->nullable()->after('overtime_clock_in_lng');
            $table->string('overtime_clock_out_photo')->nullable()->after('overtime_clock_out_at');
            $table->decimal('overtime_clock_out_lat', 10, 7)->nullable()->after('overtime_clock_out_photo');
            $table->decimal('overtime_clock_out_lng', 10, 7)->nullable()->after('overtime_clock_out_lat');

            $table->decimal('overtime_hours', 5, 2)->nullable()->after('overtime_clock_out_lng');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn([
                'overtime_clock_in_at',
                'overtime_clock_in_photo',
                'overtime_clock_in_lat',
                'overtime_clock_in_lng',
                'overtime_clock_out_at',
                'overtime_clock_out_photo',
                'overtime_clock_out_lat',
                'overtime_clock_out_lng',
                'overtime_hours',
            ]);
        });
    }
};
