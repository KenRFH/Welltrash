<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Agenda extends Model
{
    /** Reminder choices offered by the app, in minutes before the start. */
    public const REMIND_OPTIONS = [0, 15, 30, 60, 120, 1440];

    protected $fillable = ['title', 'location', 'notes', 'starts_at', 'remind_minutes', 'reminded_at', 'created_by'];

    protected $casts = ['starts_at' => 'datetime', 'reminded_at' => 'datetime'];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function toApi(User $viewer): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'location'       => $this->location,
            'notes'          => $this->notes,
            'starts_at'      => $this->starts_at->toIso8601String(),
            'remind_minutes' => $this->remind_minutes,
            'created_by'     => $this->creator?->name,
            'can_edit'       => $this->created_by === $viewer->id || $viewer->hasRole(User::ACCOUNT_ROLES),
        ];
    }
}
