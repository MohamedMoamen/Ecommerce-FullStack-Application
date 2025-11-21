<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    //Show Cart For This User
     public function show(Request $request)
    {
        $user = $request->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        // $cart->load('items.product');
        $cartItems=CartItem::with('product')->where('cart_id',$cart->id)->get();
        return response()->json($cartItems);
    }

    //Add  Product Or Increase Its quantity To Cart For This User
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $product = Product::findOrFail($request->product_id);

        //Store The Price of This Product
        $priceSnapshot = $product->price;

        $item = CartItem::where('cart_id', $cart->id)
                        ->where('product_id', $product->id)
                        ->first();

        if ($item) {
            $item->quantity += $request->quantity;
            $item->price = $priceSnapshot;
            $item->save();
        } else {
            $item = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $priceSnapshot,
            ]);
        }

        return response()->json(['message' => 'Added to cart', 'item' => $item]);
    }

    //Update Quantity Of A Product In Cart
    public function update(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer|exists:cart_items,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $item = CartItem::findOrFail($request->item_id);

        // To Be Sure That This Item( Record in cart_items Table) Belongs To This User
        if ($item->cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->quantity = $request->quantity;
        $item->save();

        return response()->json(['message' => 'Updated', 'item' => $item]);
    }


    //Deleting  A Product In Cart For This User
    public function removeItem(Request $request, $id)
    {
        $item = CartItem::findOrFail($id);

        // To Be Sure That This Item( Record in cart_items Table) Belongs To This User
        if ($item->cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->delete();
        return response()->json(['message' => 'Removed']);
    }

    //Make The Cart Empty
     public function clear(Request $request)
    {
        $cart = Cart::where('user_id', $request->user()->id)->first();
        if ($cart) {
            $cart->items()->delete();
        }
        return response()->json(['message' => 'Cleared']);
    }

    //Checkout
     public function checkout(Request $request)
    {
        $user = $request->user();
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        DB::beginTransaction();
        try {
            //Calculate Total Price 
            $total = 0;
            foreach ($cart->items as $item) {
                $product = $item->product;
                if ($product->quantity < $item->quantity) {
                    DB::rollBack();
                    return response()->json(['message' => "Product {$product->id} out of stock"], 400);
                }
                $linePrice = $product->price * $item->quantity;
                $total += $linePrice;
            }

            //Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => $total,
                'status' => 'pending',
            ]);

            //If you want to link order with cart
            // $order->cart_id = $cart->id; $order->save();

            // Transfer items to order_product Table
            foreach ($cart->items as $item) {
                OrderProduct::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                ]);

                //Decrease From Stock
                $item->product->decrement('quantity', $item->quantity);
            }

            //Make Cart Empty And Make Status of Cart Ordered
            $cart->items()->delete();
            $cart->status = 'ordered';
            $cart->save();

            DB::commit();
            return response()->json(['message' => 'Order placed', 'order' => $order]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Checkout failed', 'error' => $e->getMessage()], 500);
        }
    }



}
