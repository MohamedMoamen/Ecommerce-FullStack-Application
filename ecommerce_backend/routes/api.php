<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CountController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserAuthController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json(['message' => 'API working']);
});

Route::post('admin/login', [AdminAuthController::class, 'login'])->name('api.admin.login');;

Route::get('/categories', [CategoryController::class, 'index']);//To admins and users
Route::get('/category/{id}', [CategoryController::class, 'getSpecificCategory']);

Route::get('/allproducts', [ProductController::class, 'getAllProducts']);
Route::get('/productsOfCategory/{id}', [ProductController::class, 'getProductsOfCategory']);
Route::get('/product/{id}', [ProductController::class, 'getSpecificProduct']);

Route::middleware(['auth:sanctum',EnsureAdmin::class])->group(function () {
    
    
    Route::post('/categories', [CategoryController::class, 'store']); 
    Route::put('/categories/{id}', [CategoryController::class, 'update']); 
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']); 
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    Route::get('/counts',[CountController::class,'getCounts']);


    Route::post('admin/logout', [AdminAuthController::class, 'logout']);

});

Route::post('user/register', [UserAuthController::class, 'register'])->name('register.submit');
Route::post('user/login', [UserAuthController::class, 'login'])->name('api.user.login');;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/update', [CartController::class, 'update']);
    Route::delete('/cart/item/{id}', [CartController::class, 'removeItem']);
    Route::post('/cart/clear', [CartController::class, 'clear']);
    Route::post('/cart/checkout', [CartController::class, 'checkout']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    
    
    Route::post('user/logout', [UserAuthController::class, 'logout']);

    });