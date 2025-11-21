<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class CountController extends Controller
{
    function getCounts(){
        $users=User::count();
        $categories=Categorie::count();
        $products=Product::count();
        return response()->json(['users'=>$users,'categoris'=>$categories,'products'=>$products]);
    }
}
