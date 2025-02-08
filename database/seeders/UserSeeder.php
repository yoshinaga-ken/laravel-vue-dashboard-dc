<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->withPersonalTeam()->create([
            'name' => env('TEST_USER_NAME', 'test'),
            'email' => env('TEST_USER_EMAIL', 'test@example.com'),
        ]);
        User::factory(10)->withPersonalTeam()->create();
    }
}
