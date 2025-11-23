<?php

namespace App\Http\Controllers;

use App\Models\Order;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user:id,name,email','deliveryMember'])
                       ->orderBy('id', 'desc')
                       ->get();

        return response()->json($orders);
    }

   public function show($id)
  {
    $order = Order::with([
            'user:id,name,email',
            'items.product:id,name,price,imagepath'
        ])
        ->findOrFail($id);

    return response()->json($order);
   }



}
