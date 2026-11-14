<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Labels mirrored from HRIS (divisions/positions are managed there, not here).
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('division', 100)->nullable()->after('employee_code');
            $table->string('position', 100)->nullable()->after('division');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['division', 'position']);
        });
    }
};
