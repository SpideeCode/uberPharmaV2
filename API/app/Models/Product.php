<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OrderItem;
use App\Models\Pharmacy;
use App\Models\ProductCategory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'stock', 'pharmacy_id', 'category_id', 'image'];

    protected $appends = ['image_url'];

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // 🔹 Relation avec ProductCategory
    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}
