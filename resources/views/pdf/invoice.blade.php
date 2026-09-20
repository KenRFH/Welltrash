<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $invoice->invoice_number }} | Welltrash</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #1a1a2e;
            background: #fff;
            padding: 0;
        }

        /* ── PAGE LAYOUT ── */
        .page { padding: 32px 40px; min-height: 100vh; position: relative; }

        /* ── WATERMARK ── */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-35deg);
            font-size: 80px;
            font-weight: 900;
            opacity: 0.05;
            letter-spacing: 6px;
            white-space: nowrap;
            z-index: 0;
            color: {{ $invoice->status === 'paid' ? '#16a34a' : '#dc2626' }};
        }

        /* ── HEADER ── */
        .header {
            display: table;
            width: 100%;
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 3px solid #16a34a;
        }
        .header-left  { display: table-cell; vertical-align: middle; width: 55%; }
        .header-right { display: table-cell; vertical-align: middle; text-align: right; width: 45%; }

        .brand-name {
            font-size: 28px;
            font-weight: 900;
            color: #16a34a;
            letter-spacing: -1px;
        }
        .brand-tagline {
            font-size: 9px;
            color: #6b7280;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-top: 2px;
        }
        .brand-address {
            font-size: 9px;
            color: #9ca3af;
            margin-top: 6px;
            line-height: 1.5;
        }

        .invoice-label {
            font-size: 22px;
            font-weight: 900;
            color: #111827;
            letter-spacing: -0.5px;
        }
        .invoice-number {
            font-size: 13px;
            font-weight: 700;
            color: #16a34a;
            margin-top: 3px;
        }
        .invoice-dates {
            margin-top: 8px;
            font-size: 9.5px;
            color: #6b7280;
            line-height: 1.7;
        }
        .invoice-dates strong { color: #374151; }

        /* ── STATUS BADGE ── */
        .status-badge {
            display: inline-block;
            margin-top: 8px;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            background: {{ $invoice->status === 'paid' ? '#dcfce7' : '#fef2f2' }};
            color:      {{ $invoice->status === 'paid' ? '#15803d'  : '#dc2626'  }};
            border: 1px solid {{ $invoice->status === 'paid' ? '#bbf7d0' : '#fecaca' }};
        }

        /* ── PARTIES ── */
        .parties {
            display: table;
            width: 100%;
            margin-bottom: 28px;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .party { display: table-cell; padding: 18px 20px; vertical-align: top; width: 50%; }
        .party + .party { border-left: 1px solid #e5e7eb; }

        .party-label {
            font-size: 8.5px;
            font-weight: 900;
            color: #9ca3af;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .party-name {
            font-size: 13px;
            font-weight: 900;
            color: #111827;
            margin-bottom: 5px;
        }
        .party-detail {
            font-size: 9.5px;
            color: #6b7280;
            line-height: 1.7;
        }
        .plan-badge {
            display: inline-block;
            margin-top: 6px;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 8.5px;
            font-weight: 900;
            background: #d1fae5;
            color: #065f46;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* ── ITEMS TABLE ── */
        .section-title {
            font-size: 10px;
            font-weight: 900;
            color: #374151;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e5e7eb;
        }

        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table thead tr {
            background: #111827;
            color: #fff;
        }
        .items-table thead th {
            padding: 10px 12px;
            text-align: left;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }
        .items-table thead th:last-child { text-align: right; }
        .items-table tbody tr { border-bottom: 1px solid #f3f4f6; }
        .items-table tbody tr:nth-child(even) { background: #f9fafb; }
        .items-table tbody td {
            padding: 9px 12px;
            font-size: 10px;
            color: #374151;
        }
        .items-table tbody td:last-child { text-align: right; font-weight: 700; }
        .items-table tfoot tr { background: #f0fdf4; }
        .items-table tfoot td {
            padding: 11px 12px;
            font-size: 11px;
            font-weight: 900;
            border-top: 2px solid #16a34a;
        }
        .items-table tfoot td:last-child {
            text-align: right;
            color: #15803d;
            font-size: 14px;
        }

        /* ── PICKUP TABLE ── */
        .pickup-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 9.5px; }
        .pickup-table thead tr { background: #f3f4f6; }
        .pickup-table thead th {
            padding: 7px 10px;
            text-align: left;
            font-weight: 900;
            color: #6b7280;
            font-size: 8.5px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .pickup-table thead th:not(:first-child) { text-align: center; }
        .pickup-table tbody tr { border-bottom: 1px solid #f3f4f6; }
        .pickup-table tbody td { padding: 6px 10px; color: #374151; }
        .pickup-table tbody td:not(:first-child) { text-align: center; }
        .status-done { color: #16a34a; font-weight: 700; }

        /* ── NOTES ── */
        .notes-box {
            background: #fffbeb;
            border-left: 3px solid #f59e0b;
            padding: 10px 14px;
            border-radius: 4px;
            margin-bottom: 24px;
            font-size: 10px;
            color: #78350f;
            line-height: 1.6;
        }

        /* ── FOOTER / SIGNATURE ── */
        .footer-grid {
            display: table;
            width: 100%;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .footer-left  { display: table-cell; vertical-align: bottom; width: 60%; }
        .footer-right { display: table-cell; vertical-align: top; text-align: center; width: 40%; }

        .footer-legal {
            font-size: 8.5px;
            color: #9ca3af;
            line-height: 1.7;
        }
        .footer-legal strong { color: #6b7280; }

        .signature-box {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 10px 16px;
            background: #f9fafb;
            display: inline-block;
            min-width: 160px;
        }
        .sig-label {
            font-size: 8.5px;
            color: #9ca3af;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 40px;
        }
        .sig-line {
            border-top: 1px solid #d1d5db;
            margin-bottom: 4px;
        }
        .sig-name {
            font-size: 9.5px;
            font-weight: 900;
            color: #111827;
        }
        .sig-role {
            font-size: 8.5px;
            color: #9ca3af;
        }

        .page-number {
            position: fixed;
            bottom: 14px;
            right: 40px;
            font-size: 8px;
            color: #d1d5db;
        }
    </style>
</head>
<body>
<div class="page">

    <!-- WATERMARK -->
    <div class="watermark">
        {{ $invoice->status === 'paid' ? 'LUNAS' : 'BELUM LUNAS' }}
    </div>

    <!-- ── HEADER ── -->
    <div class="header">
        <div class="header-left">
            @php
                $logoPath = resource_path('js/assets/img/logowelltrash.png');
                if (!file_exists($logoPath)) {
                    $logoPath = resource_path('js/assets/img/logowelltrash.webp');
                }
                $logoSrc = '';
                if (file_exists($logoPath)) {
                    $ext = pathinfo($logoPath, PATHINFO_EXTENSION);
                    $logoSrc = 'data:image/' . ($ext === 'webp' ? 'webp' : 'png') . ';base64,' . base64_encode(file_get_contents($logoPath));
                }
            @endphp
            @if($logoSrc)
                <div style="width:80px; height:80px;">
                    <img src="{{ $logoSrc }}" alt="Welltrash Logo" style="width:100%; height:100%; object-fit:contain;">
                </div>
            @else
                <div class="brand-name">Welltrash</div>
            @endif
            <div class="brand-tagline">Well solutions for trash</div>
            <div class="brand-address">
                Baratan Wetan, Baratan, Kec. Patrang, Kabupaten Jember, Jawa Timur 68100
            </div>
        </div>
        <div class="header-right">
            <div class="invoice-label">INVOICE</div>
            <div class="invoice-number">{{ $invoice->invoice_number }}</div>
            <div class="invoice-dates">
                <strong>Tanggal Terbit:</strong> {{ \Carbon\Carbon::parse($invoice->created_at)->isoFormat('D MMMM YYYY') }}<br>
                <strong>Jatuh Tempo:</strong> {{ \Carbon\Carbon::parse($invoice->due_date)->isoFormat('D MMMM YYYY') }}<br>
                <strong>Periode:</strong>
                {{ \Carbon\Carbon::parse($invoice->period_start)->isoFormat('D MMM Y') }} –
                {{ \Carbon\Carbon::parse($invoice->period_end)->isoFormat('D MMM Y') }}
            </div>
            <div>
                <span class="status-badge">
                    {{ $invoice->status === 'paid' ? '✓ LUNAS' : '⚠ BELUM LUNAS' }}
                </span>
            </div>
        </div>
    </div>

    <!-- ── PARTIES ── -->
    <div class="parties">
        <div class="party">
            <div class="party-label">Dari</div>
            <div class="party-name">Welltrash</div>
            <div class="party-detail">
                Well solution for trash<br>
                Baratan Wetan, Baratan, Kec. Patrang, Kabupaten Jember, Jawa Timur 68100<br>
                +62 812-3456-7890
            </div>
        </div>
        <div class="party">
            <div class="party-label">Kepada (Mitra)</div>
            <div class="party-name">{{ $company->company_name }}</div>
            <div class="party-detail">
                <strong>PIC:</strong> {{ $company->pic_name }}<br>
                <strong>Telepon:</strong> {{ $company->phone }}<br>
                <strong>Alamat:</strong> {{ $company->address }}
            </div>
            <span class="plan-badge">Paket: {{ $company->subscription_plan }}</span>
        </div>
    </div>

    <!-- ── RINCIAN TAGIHAN ── -->
    <div class="section-title">Rincian Tagihan</div>
    <table class="items-table">
        <thead>
            <tr>
                <th style="width:5%">No</th>
                <th>Deskripsi Layanan</th>
                <th style="width:18%">Periode</th>
                <th style="width:20%">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>
                    Layanan Pengambilan Sampah — Paket <strong>{{ $company->subscription_plan }}</strong><br>
                    <span style="color:#9ca3af; font-size:9px;">
                        {{ $pickups->count() }} pengambilan selesai pada periode ini
                    </span>
                </td>
                <td>
                    {{ \Carbon\Carbon::parse($invoice->period_start)->isoFormat('D MMM') }} –
                    {{ \Carbon\Carbon::parse($invoice->period_end)->isoFormat('D MMM YYYY') }}
                </td>
                <td>Rp {{ number_format($invoice->amount, 0, ',', '.') }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" style="text-align:right; font-size:10px; letter-spacing:1px;">
                    TOTAL TAGIHAN
                </td>
                <td>Rp {{ number_format($invoice->amount, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <!-- ── DETAIL PICKUP ── -->
    @if($pickups->count() > 0)
    <div class="section-title">Detail Pengambilan Sampah ({{ $pickups->count() }} Pickup)</div>
    <table class="pickup-table">
        <thead>
            <tr>
                <th style="width:5%">No</th>
                <th>Tanggal Pickup</th>
                <th>Organik (kg)</th>
                <th>Anorganik (kg)</th>
                <th>Residu (kg)</th>
                <th>Total (kg)</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pickups as $i => $pickup)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ \Carbon\Carbon::parse($pickup->pickup_date)->isoFormat('D MMM YYYY') }}</td>
                <td>{{ number_format($pickup->organic_weight ?? 0, 1) }}</td>
                <td>{{ number_format($pickup->anorganic_weight ?? 0, 1) }}</td>
                <td>{{ number_format($pickup->residue_weight ?? 0, 1) }}</td>
                <td>
                    {{ number_format(($pickup->organic_weight ?? 0) + ($pickup->anorganic_weight ?? 0) + ($pickup->residue_weight ?? 0), 1) }}
                </td>
                <td class="status-done">Selesai</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <!-- ── NOTES ── -->
    @if($invoice->notes)
    <div class="notes-box">
        <strong>📝 Catatan:</strong><br>{{ $invoice->notes }}
    </div>
    @endif

    <!-- ── FOOTER / SIGNATURE ── -->
    <div class="footer-grid">
        <div class="footer-left">
            <div class="footer-legal">
                <strong>Informasi Pembayaran</strong><br>
                Bank: BCA · No. Rekening: 1234567890<br>
                A/N: PT. Welltrash Indonesia<br><br>
                Invoice ini sah dan diterbitkan secara digital oleh sistem Welltrash.<br>
                Harap lakukan pembayaran sebelum tanggal jatuh tempo.<br>
                Pertanyaan: welltrash@email.com
            </div>
        </div>
        <div class="footer-right">
            <div class="signature-box">
                <div class="sig-label">Diterbitkan oleh</div>
                <div class="sig-line"></div>
                <div class="sig-name">Tim Welltrash</div>

            </div>
        </div>
    </div>

    <div class="page-number">Welltrash · {{ $invoice->invoice_number }}</div>
</div>
</body>
</html>
