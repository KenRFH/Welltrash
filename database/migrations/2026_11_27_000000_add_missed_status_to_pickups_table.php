<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** "missed" = the day passed with no crew finishing or cancelling it (set by pickups:mark-missed). */
    public function up(): void
    {
        Schema::table('pickups', function (Blueprint $table) {
            $table->enum('status', ['scheduled', 'on_the_way', 'completed', 'failed', 'missed'])->default('scheduled')->change();
        });
    }

    public function down(): void
    {
        DB::table('pickups')->where('status', 'missed')->update(['status' => 'scheduled']);
        Schema::table('pickups', function (Blueprint $table) {
            $table->enum('status', ['scheduled', 'on_the_way', 'completed', 'failed'])->default('scheduled')->change();
        });
    }
};
