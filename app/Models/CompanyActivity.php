<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyActivity extends Model
{
    protected $fillable = [
        'company_id',
        'activity_date',
        'note',
        'media_path',
        'media_type',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
