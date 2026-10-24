<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Solution extends Model
{
    protected $fillable = [
        'title',
        'segment',
        'tag',
        'desc',
        'icon',
        'accent_color',
        'image_path',
        'link_url',
        'order_num',
    ];
}
