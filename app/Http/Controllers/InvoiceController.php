<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Company;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class InvoiceController extends Controller
{
    // ─── ADMIN ───────────────────────────────────────────────────────────────

    /**
     * GET /admin/invoices — daftar semua invoice
     */
    public function index(Request $request)
    {
        $query = Invoice::with('company')
            ->orderBy('created_at', 'desc');

        if ($request->filled('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $invoices = $query->paginate(15)->withQueryString();

        $companies = Company::select('id', 'company_name')
            ->where('subscription_status', 'active')
            ->orderBy('company_name')
            ->get();

        return Inertia::render('Admin/Invoices/Index', [
            'invoices'  => $invoices,
            'companies' => $companies,
            'filters'   => $request->only(['company_id', 'status']),
        ]);
    }

    /**
     * GET /admin/invoices/create — form buat invoice baru
     */
    public function create(Request $request)
    {
        $companies = Company::select('id', 'company_name', 'pic_name', 'phone', 'address', 'subscription_plan')
            ->where('subscription_status', 'active')
            ->orderBy('company_name')
            ->get();

        $selectedCompanyId = $request->query('company_id');

        return Inertia::render('Admin/Invoices/Create', [
            'companies'         => $companies,
            'selectedCompanyId' => $selectedCompanyId ? (int) $selectedCompanyId : null,
        ]);
    }

    /**
     * POST /admin/invoices — simpan invoice + generate PDF
     */
    public function store(Request $request)
    {
        $request->validate([
            'company_id'   => 'required|exists:companies,id',
            'period_start' => 'required|date',
            'period_end'   => 'required|date|after_or_equal:period_start',
            'due_date'     => 'required|date',
            'amount'       => 'required|numeric|min:0',
            'notes'        => 'nullable|string|max:1000',
        ]);

        $company = Company::with(['pickups' => function ($q) use ($request) {
            $q->where('status', 'completed')
              ->whereBetween('pickup_date', [$request->period_start, $request->period_end]);
        }])->findOrFail($request->company_id);

        $invoiceNumber = Invoice::generateInvoiceNumber();

        $invoice = Invoice::create([
            'company_id'     => $company->id,
            'invoice_number' => $invoiceNumber,
            'period_start'   => $request->period_start,
            'period_end'     => $request->period_end,
            'due_date'       => $request->due_date,
            'amount'         => $request->amount,
            'status'         => 'unpaid',
            'notes'          => $request->notes,
        ]);

        // Generate PDF & simpan — gunakan nama file aman (ganti / dengan -)
        $safeFilename = str_replace('/', '-', $invoiceNumber);
        $pdf = $this->generatePdf($invoice, $company);
        $storagePath = 'invoices/' . $safeFilename . '.pdf';
        Storage::disk('public')->put($storagePath, $pdf->output());

        $invoice->update(['pdf_path' => $storagePath]);

        return redirect()->route('admin.invoices.index')
            ->with('success', "Invoice {$invoiceNumber} berhasil dibuat.");
    }

    /**
     * GET /admin/invoices/{invoice} — preview/download PDF (admin)
     */
    public function show(Invoice $invoice)
    {
        $invoice->load('company');
        $company = $invoice->company->load(['pickups' => function ($q) use ($invoice) {
            $q->where('status', 'completed')
              ->whereBetween('pickup_date', [$invoice->period_start, $invoice->period_end]);
        }]);

        $pdf = $this->generatePdf($invoice, $company);
        // Sanitize: ganti / dengan - agar valid sebagai nama file
        $safeFilename = str_replace('/', '-', $invoice->invoice_number);
        return $pdf->stream("invoice-{$safeFilename}.pdf");
    }

    /**
     * PATCH /admin/invoices/{invoice}/mark-paid — tandai lunas
     */
    public function markPaid(Invoice $invoice)
    {
        $invoice->update(['status' => 'paid']);
        return back()->with('success', "Invoice {$invoice->invoice_number} ditandai sebagai LUNAS.");
    }

    /**
     * DELETE /admin/invoices/{invoice} — hapus invoice
     */
    public function destroy(Invoice $invoice)
    {
        if ($invoice->pdf_path) {
            Storage::disk('public')->delete($invoice->pdf_path);
        }
        $invoiceNumber = $invoice->invoice_number;
        $invoice->delete();
        return back()->with('success', "Invoice {$invoiceNumber} berhasil dihapus.");
    }

    /**
     * GET /admin/invoices/{invoice}/whatsapp — redirect ke wa.me dengan pesan pre-filled
     */
    public function sendWhatsApp(Invoice $invoice)
    {
        $invoice->load('company');
        $company = $invoice->company;

        // Normalise phone: strip leading 0, prefix 62
        $raw   = preg_replace('/\D/', '', $company->phone ?? '');
        $phone = ltrim($raw, '0');
        if (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }

        $periodStart = Carbon::parse($invoice->period_start)->translatedFormat('d F Y');
        $periodEnd   = Carbon::parse($invoice->period_end)->translatedFormat('d F Y');
        $dueDate     = Carbon::parse($invoice->due_date)->translatedFormat('d F Y');
        $amount      = 'Rp ' . number_format($invoice->amount, 0, ',', '.');

        $message = "Halo {$company->pic_name},\n\n"
            . "Berikut kami sampaikan *Invoice Welltrash* untuk *{$company->company_name}*.\n\n"
            . "📋 *No. Invoice* : {$invoice->invoice_number}\n"
            . "📅 *Periode*      : {$periodStart} – {$periodEnd}\n"
            . "💰 *Total Tagihan*: {$amount}\n"
            . "⏰ *Jatuh Tempo*  : {$dueDate}\n"
            . ($invoice->notes ? "\n📝 *Catatan*: {$invoice->notes}\n" : '');

        // Sertakan link PDF jika file tersimpan
        if ($invoice->pdf_path) {
            $pdfUrl = url('storage/' . $invoice->pdf_path);
            $message .= "\n🔗 *Download Invoice PDF*:\n{$pdfUrl}";
        }

        $message .= "\n\nUntuk pertanyaan, hubungi kami kembali.\n"
            . "Terima kasih atas kepercayaan Anda 🌿\n"
            . "*Tim Welltrash*";

        $url = 'https://wa.me/' . $phone . '?text=' . rawurlencode($message);

        return redirect($url);
    }

    // ─── COMPANY (MITRA) ─────────────────────────────────────────────────────

    /**
     * GET /company/invoices — daftar invoice milik mitra sendiri
     */
    public function companyInvoices()
    {
        $user    = Auth::user();
        $company = $user->company;

        if (!$company) {
            return redirect()->route('company.register');
        }

        $activeDaysLeft = 0;
        if ($company->subscription_end_date) {
            $endDate = Carbon::parse($company->subscription_end_date);
            if ($endDate->isFuture()) {
                $activeDaysLeft = (int) ceil(now()->floatDiffInDays($endDate));
            }
        }

        $invoices = $company->invoices()->paginate(10);

        return Inertia::render('Company/Invoices', [
            'company'       => $company,
            'invoices'      => $invoices,
            'activeDaysLeft' => $activeDaysLeft,
        ]);
    }

    /**
     * GET /company/invoices/{invoice}/download — download PDF oleh mitra
     */
    public function downloadInvoice(Invoice $invoice)
    {
        $user = Auth::user();

        // Pastikan invoice milik company yang login
        if ($invoice->company_id !== $user->company?->id) {
            abort(403);
        }

        $invoice->load('company');
        $company = $invoice->company->load(['pickups' => function ($q) use ($invoice) {
            $q->where('status', 'completed')
              ->whereBetween('pickup_date', [$invoice->period_start, $invoice->period_end]);
        }]);

        $pdf = $this->generatePdf($invoice, $company);
        // Sanitize: ganti / dengan - agar valid sebagai nama file download
        $safeFilename = str_replace('/', '-', $invoice->invoice_number);
        return $pdf->download("invoice-{$safeFilename}.pdf");
    }

    // ─── HELPER ──────────────────────────────────────────────────────────────

    private function generatePdf(Invoice $invoice, Company $company)
    {
        $pickups = $company->pickups ?? collect();

        // Pastikan folder font cache ada dan writable (penting di hosting)
        $fontDir = storage_path('fonts');
        if (!is_dir($fontDir)) {
            mkdir($fontDir, 0775, true);
        }

        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'company' => $company,
            'pickups' => $pickups,
        ]);

        $pdf->setOption('defaultFont', 'DejaVu Sans');
        $pdf->setOption('enable_html5_parser', true);
        $pdf->setOption('enable_remote', false);
        $pdf->setPaper('A4', 'portrait');

        return $pdf;
    }
}
