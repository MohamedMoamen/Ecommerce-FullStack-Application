<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use App\Models\Categorie;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
    $categories = Categorie::all();

    // Generate URL Image for frontend
    $categories->map(function ($cat) {
        $cat->image_url = $cat->imagepath 
            ? url('storage/' . $cat->imagepath) 
            : null;
        return $cat;
    });

    return response()->json($categories);
   }

    public function store(Request $request)
   {
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'image' => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('categories', 'public');
        $data['imagepath'] = $path;
    }

    $category = Categorie::create($data);

    // Generate URL Image for frontend
    $category->image_url = $category->imagepath 
        ? url('storage/'.$category->imagepath) 
        : null;

    return response()->json($category, 201);
}



public function update(Request $request, $id)
{
    $category = Categorie::findOrFail($id);

    $data = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'image' => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('image')) {
        if ($category->imagepath) {
            Storage::disk('public')->delete($category->imagepath);
        }

        $path = $request->file('image')->store('categories', 'public');
        $data['imagepath'] = $path;
    }

    $category->update($data);

    // Generate URL Image for frontend
    $category->image_url = $category->imagepath 
        ? url('storage/' . $category->imagepath) 
        : null;

    return response()->json($category);
}

public function getSpecificCategory($id)
    {
        $category=Categorie::findOrFail($id);
        
        return response()->json($category);
    }


    public function destroy($id)
    {
        $category = Categorie::findOrFail($id);

        if ($category->imagepath) {
           

        Storage::disk('public')->delete($category->imagepath);
    }

        $category->delete();

        return response()->json(['message' => 'Category deleted']);
    }
}
