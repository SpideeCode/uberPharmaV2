<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class ProductCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name']; // si ta table a une colonne 'name'

    // 🔹 Relation avec Product
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
