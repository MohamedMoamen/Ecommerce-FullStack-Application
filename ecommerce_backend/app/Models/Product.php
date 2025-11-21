<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable=['name', 'description', 'price', 'quantity', 'imagepath', 'category_id'];

     protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->imagepath
            ? url('storage/' . $this->imagepath)
            : null;
    }

    
    public function category()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function orders() {
    return $this->belongsToMany(Order::class, 'order_product')
                ->withPivot('quantity', 'price')
                ->withTimestamps();
    }

     public function cartItems()
     {
         return $this->hasMany(CartItem::class);
     }

}
