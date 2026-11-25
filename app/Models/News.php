<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Concerns\HasContentImages;
use App\Models\Concerns\HasViewCount;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory, HasContentImages, HasViewCount;

    protected string $contentColumn = 'content';

    protected $fillable = [
        'title',
        'content',
        'image_path',
        'published_date',
    ];
}
