<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Médicaments sans ordonnance',
            'Médicaments sur ordonnance',
            'Soins du corps',
            'Soins du visage',
            'Hygiène bucco-dentaire',
            'Hygiène intime',
            'Premiers secours',
            'Maternité et bébé',
            'Compléments alimentaires',
            'Médecine naturelle',
            'Soins capillaires',
            'Soins solaires',
            'Matériel médical',
            'Nutrition',
            'Vétérinaire'
        ];

        foreach ($categories as $category) {
            ProductCategory::firstOrCreate(['name' => $category]);
        }
    }
}
