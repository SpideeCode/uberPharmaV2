<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Création d'utilisateurs fixes (idempotent)
        User::updateOrCreate(
            ['email' => 'admin@uberpharma.com'],
            [
                'name' => 'Administrateur UberPharma',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
        User::updateOrCreate(
            ['email' => 'admin@site.test'],
            [
                'name' => 'adminTest',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
        User::updateOrCreate(
            ['email' => 'client@site.test'],
            [
                'name' => 'clientTest',
                'password' => Hash::make('password'),
                'role' => 'client',
                'email_verified_at' => now(),
            ]
        );
        User::updateOrCreate(
            ['email' => 'pharmacy@site.test'],
            [
                'name' => 'pharmacyTest',
                'password' => Hash::make('password'),
                'role' => 'pharmacy',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'courier@site.test'],
            [
                'name' => 'courierTest',
                'password' => Hash::make('password'),
                'role' => 'courier',
                'email_verified_at' => now(),
            ]
        );

        // Création de 5 clients
        for ($i = 1; $i <= 5; $i++) {
            User::firstOrCreate(
                ['email' => 'client' . $i . '@example.com'],
                [
                    'name' => 'Client ' . $i,
                    'password' => Hash::make('password'),
                    'role' => 'client',
                    'email_verified_at' => now(),
                    'phone' => '+32 4' . rand(10, 99) . ' ' . rand(10, 99) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                ]
            );
        }
    }
}
