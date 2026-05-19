<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Sampah | Welltrash</title>

    <style>
        body {
            font-family: poppins, sans-serif;
            font-size: 12px;
            padding: 20px;
        }

        h2 {
            margin-bottom: 5px;
        }

        p {
            margin-top: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
        }

        th {
            background: #f3f3f3;
        }
    </style>
</head>
<body>

    <h2>Laporan Pengambilan Sampah</h2>

    <p>
        <strong>Perusahaan:</strong>
        {{ $company->company_name }}
    </p>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Organic (kg)</th>
                <th>Anorganic (kg)</th>
                <th>Residu (kg)</th>
                <th>Driver</th>
                <th>Status</th>
            </tr>
        </thead>

        <tbody>
            @forelse($pickups as $pickup)
                <tr>
                    <td>{{ $loop->iteration }}</td>

                    <td>
                        {{ \Carbon\Carbon::parse($pickup->pickup_date)->format('d M Y') }}
                    </td>

                    <td>{{ $pickup->organic_weight ?? 0 }}</td>

                    <td>{{ $pickup->anorganic_weight ?? 0 }}</td>

                    <td>{{ $pickup->residue_weight ?? 0 }}</td>

                    <td>{{ $pickup->driver->name ?? '-' }}</td>

                    <td>
                        @if($pickup->status == 'completed')
                            <span style="color: green; font-weight: bold;"> Selesai</span>
                        @else
                            <span>{{ ucfirst($pickup->status) }}</span>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6">
                        Tidak ada data laporan
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>