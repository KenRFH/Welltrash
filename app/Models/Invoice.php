<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'invoice_number',
        'period_start',
        'period_end',
        'due_date',
        'amount',
        'status',
        'notes',
        'pdf_path',
        'payment_proof_path',
        'wa_send_at',
        'wa_sent_at',
        'wa_status',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end'   => 'date',
        'due_date'     => 'date',
        'amount'       => 'decimal:2',
        'wa_send_at'   => 'datetime',
        'wa_sent_at'   => 'datetime',
    ];

    /**
     * Scope: invoice yang jadwal WA-nya sudah tiba dan belum dikirim.
     */
    public function scopePendingWa($query)
    {
        return $query->where('wa_status', 'pending')
                     ->whereNotNull('wa_send_at')
                     ->where('wa_send_at', '<=', now());
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Generate a unique invoice number: INV/YYYY/MM/NNN
     */
    public static function generateInvoiceNumber(): string
    {
        $year  = now()->format('Y');
        $month = now()->format('m');
        $prefix = "INV/{$year}/{$month}/";

        $last = self::where('invoice_number', 'like', $prefix . '%')
            ->orderByDesc('invoice_number')
            ->first();

        $sequence = 1;
        if ($last) {
            $parts    = explode('/', $last->invoice_number);
            $sequence = ((int) end($parts)) + 1;
        }

        return $prefix . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }
}
