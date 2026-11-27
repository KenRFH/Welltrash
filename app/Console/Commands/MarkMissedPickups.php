<?php

namespace App\Console\Commands;

use App\Models\Pickup;
use Carbon\Carbon;
use Illuminate\Console\Command;

/**
 * Close pickups whose day passed without the crew finishing or cancelling them, so partners see "Tidak terambil"
 * instead of a pickup that stays "scheduled" forever. Not final: the operator's 48h offline sync and the admin's
 * manual completion can still turn a missed pickup into a completed one.
 */
class MarkMissedPickups extends Command
{
    protected $signature = 'pickups:mark-missed {--days=3 : How many past days to look back}';

    protected $description = 'Tandai penjemputan yang lewat tanggal tanpa diselesaikan sebagai "Tidak terambil"';

    public function handle(): int
    {
        $today = Carbon::today();
        // Query update: no model events, so no partner email for a pickup that did not happen.
        $n = Pickup::whereIn('status', ['scheduled', 'on_the_way'])
            ->whereDate('pickup_date', '<', $today->toDateString())
            ->whereDate('pickup_date', '>=', $today->copy()->subDays(max(1, (int) $this->option('days')))->toDateString())
            ->update(['status' => 'missed', 'updated_at' => now()]);

        $this->info("{$n} penjemputan ditandai tidak terambil.");

        return Command::SUCCESS;
    }
}
