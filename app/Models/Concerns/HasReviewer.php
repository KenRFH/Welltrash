<?php

namespace App\Models\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Records who decided an approval (reviewed_by/reviewed_at) alongside the model's own status fields. */
trait HasReviewer
{
    public function initializeHasReviewer(): void
    {
        $this->mergeFillable(['reviewed_by', 'reviewed_at']);
        $this->mergeCasts(['reviewed_at' => 'datetime']);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /** Apply the decision and stamp the reviewer in one write. */
    public function review(?User $by, array $attributes): bool
    {
        return $this->update($attributes + ['reviewed_by' => $by?->id, 'reviewed_at' => now()]);
    }
}
