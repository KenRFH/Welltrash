<?php

namespace App\Models\Concerns;

/** Public view counter: starts at a random 50–300, then +1 per visitor session. */
trait HasViewCount
{
    public static function bootHasViewCount(): void
    {
        static::creating(fn ($model) => $model->views ??= random_int(50, 300));
    }

    public function recordView(): void
    {
        $key = 'viewed.' . $this->getTable() . '.' . $this->getKey();
        if (session()->has($key)) {
            return;
        }
        session()->put($key, true);
        $this->timestamps = false; // a view isn't an edit: keep updated_at
        $this->incrementQuietly('views');
    }
}
