@php
    $p = $pickup;
    $c = $p->company;
    $total = $p->organic_weight + $p->anorganic_weight + $p->residue_weight;
    $kg = fn ($v) => number_format((float) $v, 2, ',', '.') . ' kg';
    $logoPath = resource_path('js/assets/img/logowelltrash.png');
    $logoSrc = file_exists($logoPath) ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath)) : null;
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Penjemputan {{ $c->company_name }} · {{ $dateLabel }}</title>
    <style>
        * { margin: 0; padding: 0; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #10271D; }
        .page { padding: 32px 40px; }
        .head { width: 100%; border-bottom: 3px solid #0C3325; padding-bottom: 14px; margin-bottom: 20px; }
        .head td { vertical-align: middle; }
        .brand { font-size: 16px; font-weight: bold; color: #0C3325; }
        .muted { color: #5F756A; }
        h1 { font-size: 15px; margin-bottom: 2px; }
        .grid { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
        .grid td { padding: 6px 0; border-bottom: 1px solid #e5e7eb; }
        .grid td.k { width: 34%; color: #5F756A; }
        .w { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
        .w th { text-align: left; font-size: 10px; color: #5F756A; padding: 6px 8px; background: #F4F6EF; }
        .w td { padding: 7px 8px; border-bottom: 1px solid #e5e7eb; }
        .w .n { text-align: right; }
        .w tr.t td { font-weight: bold; border-top: 2px solid #0C3325; border-bottom: 0; }
        .photo { text-align: center; margin-top: 4px; }
        .photo img { max-width: 100%; max-height: 360px; border: 1px solid #e5e7eb; }
        .foot { margin-top: 24px; font-size: 9px; color: #5F756A; border-top: 1px solid #e5e7eb; padding-top: 8px; }
    </style>
</head>
<body>
<div class="page">
    <table class="head"><tr>
        <td style="width:60px">@if($logoSrc)<img src="{{ $logoSrc }}" style="width:48px;height:48px">@endif</td>
        <td><div class="brand">WellTrash</div><div class="muted">Pengelolaan sampah bisnis · Jember</div></td>
        <td style="text-align:right"><h1>Laporan Penjemputan</h1><div class="muted">No. PU-{{ str_pad($p->id, 6, '0', STR_PAD_LEFT) }}</div></td>
    </tr></table>

    <table class="grid">
        <tr><td class="k">Mitra</td><td><strong>{{ $c->company_name }}</strong></td></tr>
        <tr><td class="k">Alamat</td><td>{{ $c->address ?: '—' }}</td></tr>
        <tr><td class="k">Tanggal penjemputan</td><td>{{ $dateLabel }}</td></tr>
        <tr><td class="k">Diselesaikan</td><td>{{ $p->updated_at?->timezone(config('app.timezone'))->format('d/m/Y H.i') }} WIB</td></tr>
        <tr><td class="k">Petugas CleanUP</td><td>{{ $p->cleanup?->name ?: '—' }}</td></tr>
        <tr><td class="k">Armada</td><td>{{ $p->vehicle ? $p->vehicle->name . ' (' . $p->vehicle->license_plate . ')' : '—' }}</td></tr>
        <tr><td class="k">Jumlah trashbag</td><td><strong>{{ $p->trash_bag_count ? $p->trash_bag_count . ' kantong' : 'Tidak ada' }}</strong></td></tr>
    </table>

    <table class="w">
        <thead><tr><th>Kategori</th><th class="n">Berat</th></tr></thead>
        <tbody>
            <tr><td>Organik</td><td class="n">{{ $kg($p->organic_weight) }}</td></tr>
            <tr><td>Anorganik</td><td class="n">{{ $kg($p->anorganic_weight) }}</td></tr>
            <tr><td>Residu</td><td class="n">{{ $kg($p->residue_weight) }}</td></tr>
            <tr class="t"><td>Total</td><td class="n">{{ $total > 0 ? $kg($total) : 'Tidak ditimbang' }}</td></tr>
        </tbody>
    </table>

    <div class="muted" style="margin-bottom:6px">Foto bukti penjemputan</div>
    <div class="photo">
        @if($photo)<img src="{{ $photo }}">@else<span class="muted">Foto tersedia di dasbor mitra.</span>@endif
    </div>

    <div class="foot">Dokumen ini dibuat otomatis oleh sistem WellTrash saat petugas menyelesaikan penjemputan. Rekap lengkap tersedia di dasbor mitra.</div>
</div>
</body>
</html>
