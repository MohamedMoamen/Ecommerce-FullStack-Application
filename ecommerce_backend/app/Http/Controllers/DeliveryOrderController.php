<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class DeliveryOrderController extends Controller
{
    public function myOrders(Request $request)
    {
        $deliveryUser = $request->user();

        $orders = Order::where('delivery_member_id', $deliveryUser->id)
                        ->with('user:id,name,email')
                        ->orderBy('id', 'desc')
                        ->get();

        return response()->json($orders);
    }

    public function myOrdersByStatus(Request $request, $status)
  {
    $deliveryUser = $request->user();

    $allowedStatuses = ['assigned', 'on_the_way', 'delivered', 'failed'];

    if (!in_array($status, $allowedStatuses)) {
        return response()->json([
            'message' => 'Invalid order status'
        ], 400);
    }

    $orders = Order::where('delivery_member_id', $deliveryUser->id)
                    ->where('status', $status)
                    ->with('user:id,name,email')
                    ->orderBy('id', 'desc')
                    ->get();

    return response()->json($orders);
   }

   public function updateOrderStatus(Request $request, $orderId)
  {
    $deliveryUser = $request->user();

    $order = Order::where('id', $orderId)
                  ->where('delivery_member_id', $deliveryUser->id)
                  ->first();

    if (!$order) {
        return response()->json(['message' => 'Order not found or not assigned to you'], 404);
    }

    $allowedStatuses = ['on_the_way', 'delivered', 'failed'];

    $newStatus = $request->status;

    if (!in_array($newStatus, $allowedStatuses)) {
        return response()->json([
            'message' => 'Invalid status value'
        ], 400);
    }

    if ($order->status !== 'assigned' && $newStatus === 'on_the_way') {
        return response()->json([
            'message' => 'Cannot mark as on_the_way unless current status is assigned'
        ], 400);
    }

    $order->status = $newStatus;
    $order->save();

    return response()->json([
        'message' => 'Order status updated successfully',
        'order'   => $order
    ]);
   }

   public function show(Request $request, $id)
   {
    $deliveryUser = $request->user();

    $order = Order::with([
            'user:id,name,email',
             'deliveryMember:id,name',
            'items.product:id,name,price,imagepath'
        ])
        ->where('delivery_member_id', $deliveryUser->id)
        ->findOrFail($id);

    return response()->json($order);
  }



}
