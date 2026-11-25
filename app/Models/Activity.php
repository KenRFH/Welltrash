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

    /** Plain-text summary for link previews (strips the blog markup of utils/blogContent). */
    public function excerpt(int $limit = 160): string
    {
        $text = preg_replace(['/!\[[^\]]*\]\([^)]*\)/', '/^## /m', '/\*\*/'], '', (string) $this->description);

        return \Illuminate\Support\Str::limit(trim(preg_replace('/\s+/', ' ', $text)), $limit);
    }
}