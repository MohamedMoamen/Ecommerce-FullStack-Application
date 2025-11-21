<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function getAllProducts()
    {
        $products = Product::all();

    // Generate URL Image for frontend
    // $products->map(function ($product) {
    //     $product->image_url = $product->imagepath 
    //         ? url('storage/' . $product->imagepath) 
    //         : null;
    //     return $product;
    // });

    return response()->json($products);
    }

    public function getProductsOfCategory($id)
    {
        $products=Product::where('category_id',$id)->get();
        // $products->map(function ($product) {
        // $product->image_url = $product->imagepath 
        //     ? url('storage/' . $product->imagepath) 
        //     : null;
        // return $product;
        // });

    return response()->json($products);
    }

    public function getSpecificProduct($id)
    {
        $product=Product::findOrFail($id);
        // $product->image_url = $product->imagepath 
        //     ? url('storage/' . $product->imagepath) 
        //     : null;
        return response()->json($product);
    }

    public function store(Request $request)
    {
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'quantity' => 'required|integer',
        'category_id' => 'required|exists:categories,id',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $data['imagepath'] = $request->file('image')->store('products', 'public');
    }

    $product = Product::create($data);

    return response()->json($product, 201);
    }

     public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'quantity' => 'nullable|integer',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($product->imagepath) {
                Storage::disk('public')->delete($product->imagepath);
            }
            $data['imagepath'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->imagepath) {
            Storage::disk('public')->delete($product->imagepath);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
