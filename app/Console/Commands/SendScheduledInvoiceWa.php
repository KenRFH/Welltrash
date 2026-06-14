<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SendScheduledInvoiceWa extends Command
{
    protected $signature   = 'invoices:send-wa';
    protected $description = 'Kirim WhatsApp invoice terjadwal via Fonnte API';

    public function handle(): int
    {
        $invoices = Invoice::with('company')
            ->pendingWa()
            ->get();

        if ($invoices->isEmpty()) {
            $this->info('[' . now() . '] Tidak ada invoice yang perlu dikirim.');
            return self::SUCCESS;
        }

        $this->info("[" . now() . "] Ditemukan {$invoices->count()} invoice untuk dikirim...");

        foreach ($invoices as $invoice) {
            $this->sendWa($invoice);
        }

        return self::SUCCESS;
    }

    private function sendWa(Invoice $invoice): void
    {
        $company = $invoice->company;

        // Normalise nomor HP: hilangkan karakter non-digit, pastikan berawalan 62
        $raw   = preg_replace('/\D/', '', $company->phone ?? '');
        $phone = ltrim($raw, '0');
        if (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }

        if (strlen($phone) < 10) {
            Log::warning("[InvoiceWA] Invoice #{$invoice->invoice_number} — nomor HP tidak valid: {$company->phone}");
            $invoice->update(['wa_status' => 'failed']);
            return;
        }

        // Susun URL PDF (dari storage publik)
        $pdfUrl = $invoice->pdf_path
            ? url('storage/' . $invoice->pdf_path)
            : null;

        // Format tanggal dalam Bahasa Indonesia
        Carbon::setLocale('id');
        $periodStart = Carbon::parse($invoice->period_start)->translatedFormat('d F Y');
        $periodEnd   = Carbon::parse($invoice->period_end)->translatedFormat('d F Y');
        $dueDate     = Carbon::parse($invoice->due_date)->translatedFormat('d F Y');
        $amount      = 'Rp ' . number_format($invoice->amount, 0, ',', '.');

        // Pesan WA
        $message = "Halo *{$company->pic_name}*,\n\n"
            . "Berikut kami sampaikan *Invoice Tagihan Welltrash* untuk *{$company->company_name}*.\n\n"
            . "━━━━━━━━━━━━━━━━━━━\n"
            . "📋 *No. Invoice* : {$invoice->invoice_number}\n"
            . "📅 *Periode*      : {$periodStart} – {$periodEnd}\n"
            . "💰 *Total Tagihan*: {$amount}\n"
            . "⏰ *Jatuh Tempo*  : {$dueDate}\n"
            . ($invoice->notes ? "📝 *Catatan*      : {$invoice->notes}\n" : '')
            . "━━━━━━━━━━━━━━━━━━━\n";

        if ($pdfUrl) {
            $message .= "\n🔗 *Download Invoice PDF*:\n{$pdfUrl}\n";
        }

        $message .= "\nMohon segera melakukan pembayaran sebelum tanggal jatuh tempo.\n"
            . "Untuk pertanyaan, balas pesan ini atau hubungi kami.\n\n"
            . "Terima kasih atas kepercayaan Anda 🌿\n"
            . "*Tim Welltrash*";

        try {
            $token = config('services.fonnte.token');
            $url   = config('services.fonnte.url');

            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->asForm()->post($url, [
                'target'  => $phone,
                'message' => $message,
            ]);

            $body = $response->json();

            if ($response->successful() && ($body['status'] ?? false) === true) {
                $invoice->update([
                    'wa_status'  => 'sent',
                    'wa_sent_at' => now(),
                ]);
                $this->info("  ✅ Terkirim → {$company->company_name} ({$phone})");
                Log::info("[InvoiceWA] Terkirim: #{$invoice->invoice_number} → {$phone}");
            } else {
                $reason = $body['reason'] ?? $body['message'] ?? 'Unknown error';
                $invoice->update(['wa_status' => 'failed']);
                $this->error("  ❌ Gagal → {$company->company_name}: {$reason}");
                Log::error("[InvoiceWA] Gagal: #{$invoice->invoice_number} → {$reason}", $body);
            }

        } catch (\Exception $e) {
            $invoice->update(['wa_status' => 'failed']);
            $this->error("  ❌ Exception → {$company->company_name}: {$e->getMessage()}");
            Log::error("[InvoiceWA] Exception: #{$invoice->invoice_number} → {$e->getMessage()}");
        }
    }
}
