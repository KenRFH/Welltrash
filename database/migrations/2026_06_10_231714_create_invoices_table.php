<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('invoice_number')->unique();
            $table->date('period_start');
            $table->date('period_end');
            $table->date('due_date');
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['unpaid', 'paid'])->default('unpaid');
            $table->text('notes')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
