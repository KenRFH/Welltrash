<?php

namespace App\Mail;

use App\Models\Pickup;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/** Pickup manifest sent to the partner's account email when an operator completes a pickup. */
class PickupReportMail extends Mailable
{
    public function __construct(public Pickup $pickup)
    {
        $this->pickup->loadMissing(['company', 'cleanup', 'vehicle']);
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Laporan Penjemputan Sampah ' . $this->dateLabel() . ' · ' . $this->pickup->company->company_name);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.laporan-pickup', with: ['pickup' => $this->pickup, 'dateLabel' => $this->dateLabel()]);
    }

    public function attachments(): array
    {
        File::ensureDirectoryExists(storage_path('fonts')); // dompdf font cache (needed on hosting)
        $pdf = Pdf::loadView('pdf.laporan-pickup', [
            'pickup' => $this->pickup,
            'dateLabel' => $this->dateLabel(),
            'photo' => self::compressedPhoto($this->pickup->evidence_pickup_path),
        ])->setPaper('a4')->setOption('defaultFont', 'DejaVu Sans')->setOption('enable_remote', false);

        $name = 'Laporan-Pickup-' . Carbon::parse($this->pickup->pickup_date)->format('Y-m-d') . '-' . $this->pickup->id . '.pdf';

        return [Attachment::fromData(fn () => $pdf->output(), $name)->withMime('application/pdf')];
    }

    private function dateLabel(): string
    {
        return Carbon::parse($this->pickup->pickup_date)->locale('id')->translatedFormat('d F Y');
    }

    /** Proof photo shrunk to <= 900px JPEG (q70) as a data URI, so the PDF stays small; null when unavailable. */
    public static function compressedPhoto(?string $path): ?string
    {
        $disk = Storage::disk('public');
        if (! $path || ! $disk->exists($path) || ! function_exists('imagecreatefromstring')) {
            return null;
        }
        $src = @imagecreatefromstring($disk->get($path));
        if (! $src) {
            return null;
        }
        [$w, $h] = [imagesx($src), imagesy($src)];
        $scale = min(1, 900 / max($w, $h));
        $dst = imagecreatetruecolor(max(1, (int) round($w * $scale)), max(1, (int) round($h * $scale)));
        imagecopyresampled($dst, $src, 0, 0, 0, 0, imagesx($dst), imagesy($dst), $w, $h);
        ob_start();
        imagejpeg($dst, null, 70);
        $jpeg = ob_get_clean();
        imagedestroy($src);
        imagedestroy($dst);

        return 'data:image/jpeg;base64,' . base64_encode($jpeg);
    }
}
