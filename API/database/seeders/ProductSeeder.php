<?php

namespace Database\Seeders;

use App\Models\Pharmacy;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pharmacies = Pharmacy::all();
        $categories = ProductCategory::all();

        // Produits courants en pharmacie
        $products = [
            // Médicaments sans ordonnance
            [
                'name' => 'Doliprane 1000mg',
                'description' => 'Paracétamol 1000mg, boîte de 16 comprimés',
                'price' => 3.50,
                'stock' => 50,
                'category' => 'Médicaments sans ordonnance',
                'image' => 'doliprane.jpg'
            ],
            [
                'name' => 'Spasfon',
                'description' => 'Antispasmodique, boîte de 30 comprimés',
                'price' => 4.20,
                'stock' => 35,
                'category' => 'Médicaments sans ordonnance',
                'image' => 'spasfon.jpg'
            ],
            [
                'name' => 'Ibuprofène 400mg',
                'description' => 'Anti-inflammatoire, boîte de 20 comprimés',
                'price' => 5.10,
                'stock' => 40,
                'category' => 'Médicaments sans ordonnance',
                'image' => 'ibuprofene.jpg'
            ],
            
            // Soins du corps
            [
                'name' => 'Crème NivEA Soft',
                'description' => 'Crème hydratante pour le corps, 400ml',
                'price' => 8.90,
                'stock' => 25,
                'category' => 'Soins du corps',
                'image' => 'nivea_soft.jpg'
            ],
            [
                'name' => 'Déodorant Sanex',
                'description' => 'Déodorant roll-on 50ml, sans alcool',
                'price' => 4.30,
                'stock' => 30,
                'category' => 'Soins du corps',
                'image' => 'sanex.jpg'
            ],
            
            // Hygiène bucco-dentaire
            [
                'name' => 'Elmex Sensitive',
                'description' => 'Dentifrice pour dents sensibles, 75ml',
                'price' => 3.90,
                'stock' => 40,
                'category' => 'Hygiène bucco-dentaire',
                'image' => 'elmex.jpg'
            ],
            [
                'name' => 'Brosse à dents Signal',
                'description' => 'Brosse à dents souple, 1 unité',
                'price' => 2.50,
                'stock' => 60,
                'category' => 'Hygiène bucco-dentaire',
                'image' => 'brosse_dents.jpg'
            ],
            
            // Compléments alimentaires
            [
                'name' => 'Vitamine D3 1000UI',
                'description' => 'Complément alimentaire, 60 gélules',
                'price' => 12.90,
                'stock' => 20,
                'category' => 'Compléments alimentaires',
                'image' => 'vitamine_d3.jpg'
            ],
            [
                'name' => 'Magnésium B6',
                'description' => 'Complément alimentaire, 60 comprimés',
                'price' => 9.50,
                'stock' => 25,
                'category' => 'Compléments alimentaires',
                'image' => 'magnesium_b6.jpg'
            ],
            
            // Matériel médical
            [
                'name' => 'Thermomètre électronique',
                'description' => 'Thermomètre digital, résultat en 30 secondes',
                'price' => 14.90,
                'stock' => 15,
                'category' => 'Matériel médical',
                'image' => 'thermometre.jpg'
            ],
            [
                'name' => 'Tensiomètre bras',
                'description' => 'Tensiomètre électronique avec brassard',
                'price' => 49.90,
                'stock' => 8,
                'category' => 'Matériel médical',
                'image' => 'tensiometre.jpg'
            ]
        ];

        foreach ($pharmacies as $pharmacy) {
            foreach ($products as $productData) {
                $category = $categories->firstWhere('name', $productData['category']);
                
                // Créer le produit avec une quantité aléatoire en stock
                $product = new Product([
                    'name' => $productData['name'],
                    'description' => $productData['description'],
                    'price' => $productData['price'],
                    'stock' => rand(5, $productData['stock']), // Quantité aléatoire
                    'image' => $productData['image'],
                    'pharmacy_id' => $pharmacy->id,
                    'category_id' => $category ? $category->id : null,
                ]);
                
                $product->save();
            }
        }
    }
}
