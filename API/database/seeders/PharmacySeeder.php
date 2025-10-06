<?php

namespace Database\Seeders;

use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PharmacySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pharmacies = [
            [
                'name' => 'Pharmacie de la Bourse',
                'address' => 'Place de la Bourse 1, 1000 Bruxelles',
                'phone' => '+32 2 511 66 77',
                'email' => 'pharmacie.bourse@example.com',
            ],
            [
                'name' => 'Pharmacie du Sablon',
                'address' => 'Rue des Minimes 2, 1000 Bruxelles',
                'phone' => '+32 2 512 34 56',
                'email' => 'sablon.pharma@example.com',
            ],
            [
                'name' => 'Pharmacie Européenne',
                'address' => 'Rue du Marché aux Herbes 91, 1000 Bruxelles',
                'phone' => '+32 2 513 45 67',
                'email' => 'european.pharma@example.com',
            ],
            [
                'name' => 'Pharmacie du Midi',
                'address' => 'Bd du Midi 2, 1000 Bruxelles',
                'phone' => '+32 2 514 56 78',
                'email' => 'midi.pharmacie@example.com',
            ],
            [
                'name' => 'Pharmacie de la Chasse',
                'address' => 'Rue de la Chasse 22, 1050 Ixelles',
                'phone' => '+32 2 515 67 89',
                'email' => 'pharmacie.chasse@example.com',
            ]
        ];

        // Créer un utilisateur pour chaque pharmacie
        foreach ($pharmacies as $pharmacyData) {
            $user = User::create([
                'name' => $pharmacyData['name'],
                'email' => $pharmacyData['email'],
                'password' => bcrypt('password'), // Mot de passe par défaut
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]);

            Pharmacy::create([
                'name' => $pharmacyData['name'],
                'address' => $pharmacyData['address'],
                'phone' => $pharmacyData['phone'],
                'user_id' => $user->id,
            ]);
        }
    }
}
