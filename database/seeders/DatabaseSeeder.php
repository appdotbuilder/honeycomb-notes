<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a few test users for easy login
        $users = User::factory(3)->create();

        // Ensure at least one default user always exists
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );

        // Seed notes for each created user
        foreach ($users as $user) {
            $this->callWith(NoteSeeder::class, ['user' => $user]);
        }
    }
}
