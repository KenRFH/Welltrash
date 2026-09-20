<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Sampah {{ $company->company_name }} | Welltrash</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11px;
            color: #1a1a2e;
            background: #fff;
        }

        .page { padding: 32px 40px; min-height: 100vh; position: relative; }

        /* ── WATERMARK ── */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-35deg);
            font-size: 72px;
            font-weight: 900;
            opacity: 0.04;
            letter-spacing: 6px;
            white-space: nowrap;
            z-index: 0;
            color: #16a34a;
        }

        /* ── HEADER ── */
        .header {
            display: table;
            width: 100%;
            margin-bottom: 28px;
            padding-bottom: 18px;
            border-bottom: 3px solid #16a34a;
        }
        .header-left  { display: table-cell; vertical-align: middle; width: 55%; }
        .header-right { display: table-cell; vertical-align: middle; text-align: right; width: 45%; }

        .logo-wrap { display: table; }
        .logo-img  { display: table-cell; vertical-align: middle; }
        .logo-img img { width: 56px; height: 56px; object-fit: contain; }
        .logo-text { display: table-cell; vertical-align: middle; padding-left: 10px; }

        .brand-name {
            font-size: 24px;
            font-weight: 900;
            color: #16a34a;
            letter-spacing: -1px;
        }
        .brand-tagline {
            font-size: 8.5px;
            color: #6b7280;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-top: 2px;
        }
        .brand-address {
            font-size: 8.5px;
            color: #9ca3af;
            margin-top: 5px;
            line-height: 1.5;
        }

        .report-label {
            font-size: 20px;
            font-weight: 900;
            color: #111827;
            letter-spacing: -0.5px;
        }
        .report-sub {
            font-size: 10px;
            font-weight: 700;
            color: #16a34a;
            margin-top: 3px;
        }
        .report-date {
            margin-top: 6px;
            font-size: 9px;
            color: #6b7280;
            line-height: 1.7;
        }
        .report-date strong { color: #374151; }

        /* ── INFO BOX ── */
        .info-box {
            display: table;
            width: 100%;
            margin-bottom: 24px;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .info-cell { display: table-cell; padding: 14px 18px; vertical-align: top; width: 33.33%; }
        .info-cell + .info-cell { border-left: 1px solid #e5e7eb; }
        .info-label {
            font-size: 8px;
            font-weight: 900;
            color: #9ca3af;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 12px;
            font-weight: 900;
            color: #111827;
        }
        .info-sub {
            font-size: 9px;
            color: #6b7280;
            margin-top: 2px;
        }

        /* ── SUMMARY CARDS ── */
        .summary-row {
            display: table;
            width: 100%;
            margin-bottom: 22px;
        }
        .summary-card {
            display: table-cell;
            width: 25%;
            padding: 12px 14px;
            border-radius: 8px;
            vertical-align: top;
        }
        .summary-card + .summary-card { padding-left: 10px; }
        .card-organic   { background: #f0fdf4; border: 1px solid #bbf7d0; }
        .card-anorganic { background: #eff6ff; border: 1px solid #bfdbfe; }
        .card-residue   { background: #fef3c7; border: 1px solid #fde68a; }
        .card-total     { background: #111827; border: 1px solid #374151; }

        .card-label {
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 6px;
        }
        .card-organic .card-label   { color: #15803d; }
        .card-anorganic .card-label { color: #1d4ed8; }
        .card-residue .card-label   { color: #92400e; }
        .card-total .card-label     { color: #9ca3af; }

        .card-value {
            font-size: 18px;
            font-weight: 900;
        }
        .card-organic .card-value   { color: #15803d; }
        .card-anorganic .card-value { color: #1d4ed8; }
        .card-residue .card-value   { color: #92400e; }
        .card-total .card-value     { color: #ffffff; }

        .card-unit {
            font-size: 9px;
            font-weight: 700;
        }
        .card-organic .card-unit   { color: #4ade80; }
        .card-anorganic .card-unit { color: #60a5fa; }
        .card-residue .card-unit   { color: #fbbf24; }
        .card-total .card-unit     { color: #6b7280; }

        /* ── TABLE ── */
        .section-title {
            font-size: 9.5px;
            font-weight: 900;
            color: #374151;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e5e7eb;
        }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table thead tr { background: #111827; color: #fff; }
        .data-table thead th {
            padding: 9px 10px;
            text-align: left;
            font-size: 8.5px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }
        .data-table thead th.center { text-align: center; }
        .data-table tbody tr { border-bottom: 1px solid #f3f4f6; }
        .data-table tbody tr:nth-child(even) { background: #f9fafb; }
        .data-table tbody td {
            padding: 8px 10px;
            font-size: 10px;
            color: #374151;
            vertical-align: middle;
        }
        .data-table tbody td.center { text-align: center; }

        .status-done {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            background: #dcfce7;
            color: #15803d;
            font-size: 8.5px;
            font-weight: 900;
            letter-spacing: 0.5px;
        }
        .status-other {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            background: #f3f4f6;
            color: #6b7280;
            font-size: 8.5px;
            font-weight: 900;
        }

        .no-data {
            text-align: center;
            padding: 32px;
            color: #9ca3af;
            font-size: 11px;
        }

        .organic-val   { color: #15803d; font-weight: 700; }
        .anorganic-val { color: #1d4ed8; font-weight: 700; }
        .residue-val   { color: #92400e; font-weight: 700; }
        .total-val     { color: #111827; font-weight: 900; }

        /* ── FOOTER ── */
        .footer {
            display: table;
            width: 100%;
            margin-top: 28px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
        }
        .footer-left  { display: table-cell; vertical-align: bottom; width: 60%; }
        .footer-right { display: table-cell; vertical-align: top; text-align: center; width: 40%; }
        .footer-legal {
            font-size: 8px;
            color: #9ca3af;
            line-height: 1.8;
        }
        .footer-legal strong { color: #6b7280; }
        .signature-box {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 10px 16px;
            background: #f9fafb;
            display: inline-block;
            min-width: 150px;
        }
        .sig-label {
            font-size: 8px;
            color: #9ca3af;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 36px;
        }
        .sig-line  { border-top: 1px solid #d1d5db; margin-bottom: 4px; }
        .sig-name  { font-size: 9px; font-weight: 900; color: #111827; }
        .sig-role  { font-size: 8px; color: #9ca3af; }

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
    <div class="watermark">WELLTRASH</div>

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
            <div class="logo-wrap">
                @if($logoSrc)
                <div class="logo-img">
                    <img src="{{ $logoSrc }}" alt="Welltrash Logo">
                </div>
                @endif
                <div class="logo-text">
                    <div class="brand-name">Welltrash</div>
                    <div class="brand-tagline">Well solutions for trash</div>
                    <div class="brand-address">
                        Baratan Wetan, Baratan, Kec. Patrang<br>
                        Kabupaten Jember, Jawa Timur 68100
                    </div>
                </div>
            </div>
        </div>
        <div class="header-right">
            <div class="report-label">LAPORAN</div>
            <div class="report-sub">Pengambilan Sampah</div>
            <div class="report-date">
                <strong>Dicetak:</strong> {{ \Carbon\Carbon::now()->isoFormat('D MMMM YYYY') }}<br>
                <strong>Total Pickup:</strong> {{ $pickups->count() }} pengambilan
            </div>
        </div>
    </div>

    <!-- ── INFO PERUSAHAAN ── -->
    <div class="info-box">
        <div class="info-cell">
            <div class="info-label">Perusahaan / Mitra</div>
            <div class="info-value">{{ $company->company_name }}</div>
            <div class="info-sub">{{ $company->address }}</div>
        </div>
        <div class="info-cell">
            <div class="info-label">PIC & Kontak</div>
            <div class="info-value">{{ $company->pic_name }}</div>
            <div class="info-sub">{{ $company->phone }}</div>
        </div>
        <div class="info-cell">
            <div class="info-label">Paket Layanan</div>
            <div class="info-value">{{ $company->subscription_plan }}</div>
            <div class="info-sub">Status: {{ ucfirst($company->subscription_status ?? '-') }}</div>
        </div>
    </div>

    <!-- ── RINGKASAN BERAT ── -->
    @php
        $totalOrganic   = $pickups->where('status', 'completed')->sum('organic_weight');
        $totalAnorganic = $pickups->where('status', 'completed')->sum('anorganic_weight');
        $totalResidue   = $pickups->where('status', 'completed')->sum('residue_weight');
        $totalSemua     = $totalOrganic + $totalAnorganic + $totalResidue;
    @endphp
    <div class="summary-row">
        <div class="summary-card card-organic" style="padding-right:5px;">
            <div class="card-label">Organik</div>
            <div class="card-value">{{ number_format($totalOrganic, 1) }} <span class="card-unit">kg</span></div>
        </div>
        <div class="summary-card card-anorganic">
            <div class="card-label">Anorganik</div>
            <div class="card-value">{{ number_format($totalAnorganic, 1) }} <span class="card-unit">kg</span></div>
        </div>
        <div class="summary-card card-residue">
            <div class="card-label">Residu</div>
            <div class="card-value">{{ number_format($totalResidue, 1) }} <span class="card-unit">kg</span></div>
        </div>
        <div class="summary-card card-total">
            <div class="card-label">Total Sampah</div>
            <div class="card-value">{{ number_format($totalSemua, 1) }} <span class="card-unit">kg</span></div>
        </div>
    </div>

    <!-- ── DETAIL TABEL ── -->
    <div class="section-title">Detail Pengambilan Sampah</div>

    @if($pickups->isEmpty())
        <div class="no-data">Tidak ada data laporan pengambilan sampah.</div>
    @else
    <table class="data-table">
        <thead>
            <tr>
                <th style="width:4%">No</th>
                <th style="width:15%">Tanggal</th>
                <th class="center" style="width:14%">Organik (kg)</th>
                <th class="center" style="width:15%">Anorganik (kg)</th>
                <th class="center" style="width:12%">Residu (kg)</th>
                <th class="center" style="width:13%">Total (kg)</th>
                <th style="width:15%">CleanUP</th>
                <th class="center" style="width:12%">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pickups as $pickup)
            @php
                $berat = ($pickup->organic_weight ?? 0) + ($pickup->anorganic_weight ?? 0) + ($pickup->residue_weight ?? 0);
            @endphp
            <tr>
                <td class="center">{{ $loop->iteration }}</td>
                <td>{{ \Carbon\Carbon::parse($pickup->pickup_date)->isoFormat('D MMM YYYY') }}</td>
                <td class="center organic-val">{{ number_format($pickup->organic_weight ?? 0, 1) }}</td>
                <td class="center anorganic-val">{{ number_format($pickup->anorganic_weight ?? 0, 1) }}</td>
                <td class="center residue-val">{{ number_format($pickup->residue_weight ?? 0, 1) }}</td>
                <td class="center total-val">{{ number_format($berat, 1) }}</td>
                <td>{{ $pickup->cleanup->name ?? '-' }}</td>
                <td class="center">
                    @if($pickup->status === 'completed')
                        <span class="status-done">✓ Selesai</span>
                    @else
                        <span class="status-other">{{ ucfirst($pickup->status) }}</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <!-- ── FOOTER ── -->
    <div class="footer">
        <div class="footer-left">
            <div class="footer-legal">
                <strong>Welltrash</strong> — Well solutions for trash<br>
                Baratan Wetan, Baratan, Kec. Patrang, Kabupaten Jember, Jawa Timur 68100<br>
                Dokumen ini dicetak secara otomatis oleh sistem Welltrash.<br>
                Harap simpan sebagai arsip kegiatan pengelolaan sampah Anda.
            </div>
        </div>
        <div class="footer-right">
            <div class="signature-box">
                <div class="sig-label">Diterbitkan oleh</div>
                <div class="sig-line"></div>
                <div class="sig-name">Tim Welltrash</div>
                <div class="sig-role">Pengelola Layanan</div>
            </div>
        </div>
    </div>

    <div class="page-number">Welltrash · Laporan Sampah · {{ $company->company_name }}</div>

</div>
</body>
</html>