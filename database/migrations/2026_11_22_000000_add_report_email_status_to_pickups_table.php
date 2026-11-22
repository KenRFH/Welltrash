<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pickups', function (Blueprint $table) {
            $table->timestamp('report_emailed_at')->nullable()->after('evidence_pickup_path');
            $table->string('report_email_error', 500)->nullable()->after('report_emailed_at');
        });
    }

    public function down(): void
    {
        Schema::table('pickups', function (Blueprint $table) {
            $table->dropColumn(['report_emailed_at', 'report_email_error']);
        });
    }
};
