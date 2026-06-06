<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');

            // Clock In
            $table->dateTime('clock_in_at');
            $table->string('clock_in_photo')->nullable();
            $table->decimal('clock_in_lat', 10, 7)->nullable();
            $table->decimal('clock_in_lng', 10, 7)->nullable();

            // Clock Out
            $table->dateTime('clock_out_at')->nullable();
            $table->string('clock_out_photo')->nullable();
            $table->decimal('clock_out_lat', 10, 7)->nullable();
            $table->decimal('clock_out_lng', 10, 7)->nullable();

            // Computed
            $table->decimal('work_hours', 5, 2)->nullable();
            $table->enum('status', ['present', 'incomplete'])->default('incomplete');

            $table->timestamps();

            // Satu CleanUP hanya boleh absen sekali per hari
            $table->unique(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
