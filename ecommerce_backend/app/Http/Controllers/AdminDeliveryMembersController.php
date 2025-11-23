<?php

namespace App\Http\Controllers;

use App\Models\DeliveryMember;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminDeliveryMembersController extends Controller
  {
    public function index()
    {
        return DeliveryMember::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required',
            'email'    => 'required|email|unique:delivery_members,email',
            'password' => 'required|min:6',
            'phone'    => 'nullable|string',
            'vehicle'  => 'nullable|string',
            'notes'    => 'nullable|string'
        ]);

        return DeliveryMember::create($data);
    }

    public function update(Request $request, $id)
   {
    $deliveryMember = DeliveryMember::findOrFail($id);

    $data = $request->validate([
        'name'     => 'sometimes|required',
        'email'    => "sometimes|required|email|unique:delivery_members,email,{$deliveryMember->id}",
        'password' => 'nullable|min:6',
        'phone'    => 'nullable',
        'vehicle'  => 'nullable',
        'notes'    => 'nullable'
    ]);


    $deliveryMember->update($data);

    return response()->json([
        'message' => 'Delivery Member updated successfully',
        'member' => $deliveryMember
    ]);
   }

    public function destroy($id)
   {
    $deliveryMember = DeliveryMember::findOrFail($id);

    $deliveryMember->delete();

    return response()->json([
        'message' => 'Delivery Member deleted successfully'
    ]);
   }


    public function assignDelivery(Request $request, Order $order)
    {
    $request->validate([
        'delivery_member_id' => 'required|exists:delivery_members,id'
    ]);

    $order->delivery_member_id = $request->delivery_member_id;
    $order->save();

    return $order->load('deliveryMember');
    }

  }

