<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['news', 'activities'] as $table) {
            Schema::table($table, fn (Blueprint $t) => $t->unsignedInteger('views')->default(0));
            // Random starting count per existing post (same range as HasViewCount::creating)
            DB::table($table)->update(['views' => DB::raw('FLOOR(50 + RAND() * 251)')]);
        }
    }

    public function down(): void
    {
        foreach (['news', 'activities'] as $table) {
            Schema::table($table, fn (Blueprint $t) => $t->dropColumn('views'));
        }
    }
};
