<?php

namespace App\Http\Controllers;

use App\Models\DeliveryMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DeliveryAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $member = DeliveryMember::where('email', $request->email)->first();

        if (! $member || ! Hash::check($request->password, $member->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        $member->tokens()->delete();
        $token = $member->createToken('delivery_token')->plainTextToken;

        return response()->json([
            'member' => $member,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Delivery member logged out successfully'
        ]);
    }


}
