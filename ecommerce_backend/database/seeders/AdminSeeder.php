<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    public function run()
    {
        Admin::create([
            'name' => 'Mohamed',
            'email' => 'mohamed@test.com',
            'password' => '123456789', 
        ]);
    }
}
