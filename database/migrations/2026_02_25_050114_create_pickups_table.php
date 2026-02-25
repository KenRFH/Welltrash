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
        Schema::create('pickups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('pickup_date');
            $table->enum('status', ['pending', 'on_the_way', 'picking', 'picked', 'cancelled'])->default('pending');
            $table->text('cancellation_reason')->nullable();
            
            $table->decimal('organic_weight', 8, 2)->nullable();
            $table->decimal('anorganic_weight', 8, 2)->nullable();
            $table->decimal('residue_weight', 8, 2)->nullable();
            
            $table->string('organic_image_path')->nullable();
            $table->string('anorganic_image_path')->nullable();
            $table->string('residue_image_path')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pickups');
    }
};
