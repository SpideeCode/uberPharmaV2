<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // 1. Créer les utilisateurs admin et clients
            UserSeeder::class,
            // 2. Créer les catégories de produits
            ProductCategorySeeder::class,
            // 3. Créer les pharmacies et leurs utilisateurs associés
            PharmacySeeder::class,
            // 4. Créer les produits pour chaque pharmacie
            ProductSeeder::class,
            // 5. (Optionnel) Créer des commandes et des avis
            // OrderSeeder::class,
        ]);
    }
}
