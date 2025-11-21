<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderProduct;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
   {
    $user = $request->user();

    $orders = Order::where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->select('id', 'total_price', 'status', 'created_at')
                    ->get();

    return response()->json($orders);
   }



  public function show(Request $request, $id)
  {
    $user = $request->user();
    
    $order = Order::where('id', $id)
                  ->where('user_id', $user->id)
                  ->firstOrFail();

    $items = OrderProduct::where('order_id', $order->id)
                        ->with('product')
                        ->get()
                        ->map(function($item) {
                            return [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'price' => $item->price,
                                'quantity' => $item->quantity,
                            ];
                        });

    return response()->json([
        'order' => $order,
        'items' => $items
    ]);
   }


}
