<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class DeliveryMember extends Model
{
    use HasFactory,HasApiTokens;

    protected $fillable = [
        'name', 'email', 'password', 'phone', 'vehicle', 'notes'
    ];

    protected $hidden = ['password'];

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'delivery_member_id');
    }
}

