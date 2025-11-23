<?php

namespace App\Http\Controllers;

use App\Models\Order;

class AdminOrderController extends Controller
{
    public function index()
   {
    $orders = Order::with(['user:id,name,email', 'deliveryMember:id,name'])
                   ->select('id','user_id','address','mobile','total_price','status','delivery_member_id','created_at')
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

   public function setProcessing($id)
  {
    $order = Order::findOrFail($id);

    $order->status = 'processing';
    $order->save();

    return response()->json([
        'message' => 'Order marked as processing',
        'order'   => $order
    ]);
   }




}
