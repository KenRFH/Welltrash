<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            // Tanggal & jam kapan WA harus dikirim (set oleh admin)
            $table->dateTime('wa_send_at')->nullable()->after('pdf_path');

            // Kapan WA berhasil dikirim (null = belum terkirim)
            $table->dateTime('wa_sent_at')->nullable()->after('wa_send_at');

            // Status pengiriman WA
            $table->enum('wa_status', ['pending', 'sent', 'failed', 'skipped'])
                  ->default('skipped')
                  ->after('wa_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['wa_send_at', 'wa_sent_at', 'wa_status']);
        });
    }
};
