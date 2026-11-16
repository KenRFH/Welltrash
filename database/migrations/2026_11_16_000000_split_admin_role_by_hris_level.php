<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

// The single "admin" role is replaced by HRIS levels. Existing admins keep full access as director;
// their next HRIS login or crew sync moves them to their real level (manager/coordinator).
return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')->whereIn('role', ['admin', 'Admin', 'management'])->update(['role' => 'director']);
        DB::table('users')->where('role', 'Superadmin')->update(['role' => 'superadmin']);
    }

    public function down(): void
    {
        DB::table('users')->whereIn('role', ['superadmin', 'director', 'manager', 'coordinator'])->update(['role' => 'admin']);
        DB::table('users')->where('role', 'staff')->update(['role' => 'CleanUP']);
    }
};
