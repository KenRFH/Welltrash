<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Shared agenda of Manager / Direktur / Superadmin, with a push reminder before it starts.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agendas', function (Blueprint $table) {
            $table->id();
            $table->string('title', 150);
            $table->string('location', 255)->nullable();
            $table->text('notes')->nullable();
            $table->dateTime('starts_at')->index();
            $table->unsignedSmallInteger('remind_minutes')->nullable(); // null = no reminder
            $table->timestamp('reminded_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agendas');
    }
};
