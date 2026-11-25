<?php

namespace App\Models;

use App\Models\Concerns\HasContentImages;
use App\Models\Concerns\HasViewCount;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasContentImages, HasViewCount;

    protected string $contentColumn = 'description';

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'date',
    ];
}