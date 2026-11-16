@php
    $num = fn ($v, $d = 0) => number_format((float) $v, $d, ',', '.');
    $rp = fn ($v) => 'Rp ' . number_format((float) $v, 0, ',', '.');
    $delta = function ($cur, $prev) {
        if (!$prev) return $cur > 0 ? ['Baru', 'up'] : ['–', 'flat'];
        $p = round(($cur - $prev) / $prev * 100);
        return [($p >= 0 ? '+' : '') . $p . '%', $p >= 0 ? 'up' : 'down'];
    };
    $c = $current; $p = $previous;
    $maxWeekKg = max(1, collect($weeks)->max('kg'));
    $logoPath = resource_path('js/assets/img/logowelltrash.png');
    if (!file_exists($logoPath)) $logoPath = resource_path('js/assets/img/logowelltrash.webp');
    $logoSrc = file_exists($logoPath)
        ? 'data:image/' . (pathinfo($logoPath, PATHINFO_EXTENSION) === 'webp' ? 'webp' : 'png') . ';base64,' . base64_encode(file_get_contents($logoPath))
        : '';
    $monthLabel = $start->translatedFormat('F Y');
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Bulanan {{ $monthLabel }} | Welltrash</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #0f172a; }
        .page { padding: 28px 34px; }
        .green { color: #2f7a22; } .orange { color: #c2410c; } .muted { color: #64748b; }

        .header { display: table; width: 100%; padding-bottom: 14px; border-bottom: 3px solid #5daf3c; margin-bottom: 18px; }
        .header > div { display: table-cell; vertical-align: middle; }
        .logo img { width: 46px; height: 46px; }
        .brand { padding-left: 10px; }
        .brand-name { font-size: 20px; font-weight: bold; color: #2f7a22; }
        .brand-tag { font-size: 7.5px; letter-spacing: 2px; color: #64748b; text-transform: uppercase; }
        .title { text-align: right; }
        .title-main { font-size: 15px; font-weight: bold; }
        .title-sub { font-size: 9px; color: #64748b; margin-top: 2px; }

        h2 { font-size: 11.5px; margin: 16px 0 7px; padding-left: 7px; border-left: 3px solid #ff7a13; }

        .kpis { width: 100%; border-collapse: separate; border-spacing: 6px 0; margin: 0 -6px; }
        .kpi { border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 10px; width: 25%; vertical-align: top; }
        .kpi-label { font-size: 8.5px; color: #64748b; }
        .kpi-value { font-size: 17px; font-weight: bold; margin: 3px 0 2px; }
        .pill { font-size: 8px; font-weight: bold; padding: 1px 5px; border-radius: 8px; }
        .pill.up { background: #eff7e9; color: #2f7a22; } .pill.down { background: #fee2e2; color: #b91c1c; } .pill.flat { background: #f1f5f9; color: #64748b; }

        table.data { width: 100%; border-collapse: collapse; }
        table.data th { background: #f8fafc; color: #64748b; font-size: 8.5px; text-transform: uppercase; text-align: left; padding: 5px 7px; border-bottom: 1px solid #e2e8f0; }
        table.data td { padding: 5px 7px; border-bottom: 1px solid #f1f5f9; }
        table.data .r { text-align: right; }
        .bar { height: 7px; background: #5daf3c; border-radius: 3px; }

        .two { width: 100%; border-collapse: separate; border-spacing: 10px 0; margin: 0 -10px; }
        .two > tbody > tr > td { width: 50%; vertical-align: top; }
        .box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 10px; }
        .row { display: table; width: 100%; padding: 3px 0; }
        .row > span { display: table-cell; } .row > span:last-child { text-align: right; font-weight: bold; }
        .empty { color: #94a3b8; font-style: italic; padding: 6px 7px; }
        .footer { margin-top: 18px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 8px; color: #94a3b8; }
    </style>
</head>
<body>
<div class="page">
    <div class="header">
        @if($logoSrc)<div class="logo" style="width:48px"><img src="{{ $logoSrc }}" alt="Welltrash"></div>@endif
        <div class="brand">
            <div class="brand-name">Welltrash</div>
            <div class="brand-tag">Well solution for trash</div>
        </div>
        <div class="title">
            <div class="title-main">Laporan Bulanan {{ $monthLabel }}</div>
            <div class="title-sub">{{ $start->translatedFormat('d M') }} – {{ $end->translatedFormat('d M Y') }} · dibanding {{ $prevLabel }}</div>
            <div class="title-sub">Dicetak {{ now()->locale('id')->translatedFormat('d F Y H:i') }}</div>
        </div>
    </div>

    <h2>Ringkasan Operasional</h2>
    <table class="kpis"><tr>
        @foreach([
            ['Penjemputan selesai', $num($c['pickups']), $delta($c['pickups'], $p['pickups']), "dari {$num($c['scheduled'])} terjadwal"],
            ['Total sampah (kg)', $num($c['kg']), $delta($c['kg'], $p['kg']), "{$prevLabel}: {$num($p['kg'])} kg"],
            ['Gagal dijemput', $num($c['failed']), $delta($c['failed'], $p['failed']), $c['scheduled'] ? $num($c['failed'] / $c['scheduled'] * 100, 1) . '% dari jadwal' : '–'],
            ['Mitra baru', $num($companiesNew), null, 'pendaftaran bulan ini'],
        ] as [$label, $value, $d, $sub])
            <td class="kpi">
                <div class="kpi-label">{{ $label }}</div>
                <div class="kpi-value">{{ $value }}
                    @if($d)<span class="pill {{ $label === 'Gagal dijemput' ? ($d[1] === 'up' ? 'down' : ($d[1] === 'down' ? 'up' : 'flat')) : $d[1] }}">{{ $d[0] }}</span>@endif
                </div>
                <div class="kpi-label">{{ $sub }}</div>
            </td>
        @endforeach
    </tr></table>

    @if($target['kg'] || $target['pickups'])
        <h2>Pencapaian Target</h2>
        <table class="data">
            <tr><th>Target</th><th class="r">Realisasi</th><th class="r">Target</th><th class="r">Capaian</th></tr>
            @foreach(array_filter(['Total sampah (kg)' => [$c['kg'], $target['kg']], 'Penjemputan selesai' => [$c['pickups'], $target['pickups']]], fn ($v) => $v[1]) as $label => [$real, $goal])
                <tr>
                    <td>{{ $label }}</td>
                    <td class="r">{{ $num($real) }}</td>
                    <td class="r">{{ $num($goal) }}</td>
                    <td class="r {{ $real >= $goal ? 'green' : 'orange' }}"><b>{{ $num($real / $goal * 100) }}%</b></td>
                </tr>
            @endforeach
        </table>
    @endif

    <h2>Komposisi Sampah &amp; Tren Mingguan</h2>
    <table class="two"><tr>
        <td>
            <div class="box">
                @foreach(['Organik' => 'organic', 'Anorganik' => 'anorganic', 'Residu' => 'residue'] as $label => $k)
                    <div class="row"><span>{{ $label }}</span><span>{{ $num($c[$k]) }} kg <span class="muted">({{ $c['kg'] ? $num($c[$k] / $c['kg'] * 100) : 0 }}%)</span></span></div>
                @endforeach
                <div class="row" style="border-top:1px solid #e2e8f0;margin-top:3px"><span><b>Total</b></span><span class="green">{{ $num($c['kg']) }} kg</span></div>
            </div>
        </td>
        <td>
            <table class="data">
                <tr><th>Minggu</th><th class="r">Jemput</th><th class="r">Kg</th><th style="width:40%"></th></tr>
                @foreach($weeks as $w)
                    <tr>
                        <td>{{ $w['label'] }}</td>
                        <td class="r">{{ $num($w['pickups']) }}</td>
                        <td class="r">{{ $num($w['kg']) }}</td>
                        <td><div class="bar" style="width: {{ max(2, round($w['kg'] / $maxWeekKg * 100)) }}%"></div></td>
                    </tr>
                @endforeach
            </table>
        </td>
    </tr></table>

    <h2>10 Mitra dengan Sampah Terbanyak</h2>
    <table class="data">
        <tr><th>#</th><th>Mitra</th><th class="r">Penjemputan</th><th class="r">Sampah (kg)</th><th class="r">Porsi</th></tr>
        @forelse($companies as $i => $co)
            <tr>
                <td>{{ $i + 1 }}</td><td>{{ $co->name }}</td>
                <td class="r">{{ $num($co->pickups) }}</td><td class="r">{{ $num($co->kg) }}</td>
                <td class="r muted">{{ $c['kg'] ? $num($co->kg / $c['kg'] * 100, 1) : 0 }}%</td>
            </tr>
        @empty
            <tr><td colspan="5" class="empty">Belum ada penjemputan selesai bulan ini.</td></tr>
        @endforelse
    </table>

    <table class="two" style="margin-top: 4px"><tr>
        <td>
            <h2>Kinerja Kru</h2>
            <table class="data">
                <tr><th>Kru</th><th class="r">Jemput</th><th class="r">Kg</th></tr>
                @forelse($crew as $m)
                    <tr><td>{{ $m->name }}</td><td class="r">{{ $num($m->pickups) }}</td><td class="r">{{ $num($m->kg) }}</td></tr>
                @empty
                    <tr><td colspan="3" class="empty">Tidak ada data.</td></tr>
                @endforelse
            </table>
        </td>
        <td>
            <h2>SDM &amp; Persetujuan</h2>
            <div class="box">
                <div class="row"><span>Hari kerja tercatat (presensi)</span><span>{{ $num($people['attendance_days']) }}</span></div>
                <div class="row"><span>Kru yang hadir minimal sekali</span><span>{{ $num($people['crew_present']) }}</span></div>
                <div class="row"><span>Izin/sakit disetujui</span><span>{{ $num($people['leave_approved']) }}</span></div>
                <div class="row"><span>Lembur disetujui</span><span>{{ $num($people['overtime_approved']) }}</span></div>
            </div>
            <table class="data" style="margin-top: 6px">
                <tr><th>Penyetuju</th><th class="r">Izin</th><th class="r">Lembur</th><th class="r">Mitra</th></tr>
                @forelse($approvers as $name => $a)
                    <tr><td>{{ $name }}</td><td class="r">{{ $a['izin'] ?? 0 }}</td><td class="r">{{ $a['lembur'] ?? 0 }}</td><td class="r">{{ $a['mitra'] ?? 0 }}</td></tr>
                @empty
                    <tr><td colspan="4" class="empty">Belum ada keputusan tercatat.</td></tr>
                @endforelse
            </table>
        </td>
    </tr></table>

    <h2>Keuangan Mitra</h2>
    <table class="kpis"><tr>
        <td class="kpi"><div class="kpi-label">Invoice terbit</div><div class="kpi-value">{{ $num($finance['issued_count']) }}</div><div class="kpi-label">{{ $rp($finance['issued_amount']) }}</div></td>
        <td class="kpi"><div class="kpi-label">Sudah dibayar (terbit bulan ini)</div><div class="kpi-value green">{{ $rp($finance['paid_amount']) }}</div><div class="kpi-label">{{ $finance['issued_amount'] ? $num($finance['paid_amount'] / $finance['issued_amount'] * 100) : 0 }}% dari tagihan</div></td>
        <td class="kpi"><div class="kpi-label">Piutang per {{ $end->translatedFormat('d M') }}</div><div class="kpi-value orange">{{ $rp($finance['unpaid_amount']) }}</div><div class="kpi-label">semua invoice belum lunas</div></td>
        <td class="kpi"><div class="kpi-label">Lewat jatuh tempo</div><div class="kpi-value {{ $finance['overdue_count'] ? 'orange' : '' }}">{{ $num($finance['overdue_count']) }}</div><div class="kpi-label">invoice</div></td>
    </tr></table>

    <div class="footer">Laporan otomatis dari sistem Welltrash berdasarkan data penjemputan, presensi, dan invoice. Angka bulan berjalan dapat berubah sampai akhir bulan.</div>
</div>
</body>
</html>
