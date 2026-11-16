<?php

namespace Tests\Feature;

use Tests\TestCase;

class BackupDatabaseTest extends TestCase
{
    public function test_backup_refuses_non_mysql_connections_instead_of_writing_an_empty_file(): void
    {
        // Test suite runs on SQLite: the command must fail loudly, not leave a fake backup behind.
        $before = glob(storage_path('app/backups/*.sql.gz')) ?: [];
        $this->artisan('db:backup')->assertFailed();
        $this->assertSame($before, glob(storage_path('app/backups/*.sql.gz')) ?: [], 'a refused run writes no file');
    }
}
