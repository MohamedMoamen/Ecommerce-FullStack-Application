<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\DeliveryMember;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class CountController extends Controller
  {
    function getCounts() {
    $users = User::count();

    $categories = Categorie::count();

    $products = Product::count();

    $deliveryMembers = DeliveryMember::count();

    $deliveredOrders = Order::where('status', 'delivered')->count();

    $topProducts = OrderProduct::select('product_id')
        ->selectRaw('SUM(quantity) as total_sold')
        ->groupBy('product_id')
        ->orderByDesc('total_sold')
        ->with('product:id,name') 
        ->take(5)
        ->get()
        ->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product->name ?? 'Unknown',
                'total_sold' => $item->total_sold,
            ];
        });

    return response()->json([
        'users' => $users,
        'categories' => $categories,
        'products' => $products,
        'delivery_members' => $deliveryMembers,
        'delivered_orders' => $deliveredOrders,
        'top_products' => $topProducts,
    ]);
  }
}
