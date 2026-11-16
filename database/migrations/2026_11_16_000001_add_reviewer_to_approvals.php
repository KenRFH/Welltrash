<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Who decided an approval and when: several tiers (Direktur, Manager, Koordinator) can now approve.
return new class extends Migration
{
    private const TABLES = ['leave_requests', 'overtime_requests', 'companies'];

    public function up(): void
    {
        foreach (self::TABLES as $t) {
            Schema::table($t, function (Blueprint $table) {
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('reviewed_at')->nullable();
            });
        }
    }

    public function down(): void
    {
        foreach (self::TABLES as $t) {
            Schema::table($t, function (Blueprint $table) {
                $table->dropConstrainedForeignId('reviewed_by');
                $table->dropColumn('reviewed_at');
            });
        }
    }
};
