<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/** Berita is merged into Aktivitas: copy every news post into activities, then drop the news table. */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('news')) {
            return;
        }

        foreach (DB::table('news')->orderBy('id')->get() as $n) {
            $already = DB::table('activities')->where('title', $n->title)->where('date', $n->published_date)->exists();
            if ($already) {
                continue;
            }
            DB::table('activities')->insert([
                'title'       => $n->title,
                'description' => $n->content,
                'image_path'  => $n->image_path,
                'date'        => $n->published_date,
                'views'       => $n->views ?? 0,
                'created_at'  => $n->created_at,
                'updated_at'  => $n->updated_at,
            ]);
        }

        Schema::dropIfExists('news');
    }

    public function down(): void
    {
        // Recreates the (empty) table so earlier migrations can roll back; the posts stay in activities.
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('image_path')->nullable();
            $table->date('published_date')->nullable();
            $table->unsignedInteger('views')->default(0);
            $table->timestamps();
        });
    }
};
