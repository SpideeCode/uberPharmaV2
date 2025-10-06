<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');                     // Nom du produit
            $table->text('description')->nullable();     // Description du produit
            $table->string('image')->nullable();         // Chemin de l'image du produit
            $table->decimal('price', 8, 2);             // Prix
            $table->integer('stock');                   // Stock disponible
            $table->foreignId('pharmacy_id')->constrained()->onDelete('cascade'); 
            $table->foreignId('category_id')->constrained('product_categories')->onDelete('cascade'); // 🔹 lien vers categories
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
