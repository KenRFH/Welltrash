@php $total = $pickup->organic_weight + $pickup->anorganic_weight + $pickup->residue_weight; @endphp
<div style="font-family: Arial, sans-serif; font-size: 14px; color: #10271D; line-height: 1.6; max-width: 560px;">
    <p>Yth. {{ $pickup->company->pic_name ?: $pickup->company->company_name }},</p>
    <p>Penjemputan sampah untuk <strong>{{ $pickup->company->company_name }}</strong> pada <strong>{{ $dateLabel }}</strong> telah diselesaikan oleh petugas CleanUP WellTrash.</p>
    <p>
        Total: <strong>{{ $total > 0 ? number_format($total, 2, ',', '.') . ' kg' : 'tidak ditimbang' }}</strong>
        @if($pickup->trash_bag_count) · {{ $pickup->trash_bag_count }} trashbag @endif
    </p>
    <p>Rincian berat per kategori dan foto bukti terlampir dalam PDF.</p>
    <p style="color:#5F756A; font-size:12px;">Email ini dikirim otomatis. Untuk pertanyaan, balas email ini atau hubungi tim WellTrash.</p>
    <p>Salam,<br>WellTrash Jember</p>
</div>
