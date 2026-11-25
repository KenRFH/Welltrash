<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\Storage;

/**
 * Deletes images uploaded into a blog-style body (/storage/content/...) once the
 * body no longer references them, or when the record is deleted.
 * The using model sets `protected string $contentColumn`.
 */
trait HasContentImages
{
    public static function bootHasContentImages(): void
    {
        static::updated(function ($model) {
            $col = $model->contentColumn;
            if ($model->wasChanged($col)) {
                $model->deleteContentImages(array_diff(
                    static::contentImagePaths($model->getOriginal($col)),
                    static::contentImagePaths($model->{$col})
                ));
            }
        });

        static::deleted(fn ($model) => $model->deleteContentImages(
            static::contentImagePaths($model->{$model->contentColumn})
        ));
    }

    /** Disk paths (content/xxx.jpg) referenced as ![..](/storage/content/xxx.jpg). */
    public static function contentImagePaths(?string $text): array
    {
        preg_match_all('#\(/storage/(content/[^)\s]+)\)#', $text ?? '', $m);
        return array_unique($m[1]);
    }

    protected function deleteContentImages(array $paths): void
    {
        if ($paths) {
            Storage::disk('public')->delete(array_values($paths));
        }
    }
}
