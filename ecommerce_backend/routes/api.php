<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminDeliveryMembersController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CountController;
use App\Http\Controllers\DeliveryAuthController;
use App\Http\Controllers\DeliveryOrderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserAuthController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json(['message' => 'API working']);
});
// Admin Routes
Route::post('admin/login', [AdminAuthController::class, 'login'])->name('api.admin.login');;

Route::get('/categories', [CategoryController::class, 'index']);//To admin and users
Route::get('/category/{id}', [CategoryController::class, 'getSpecificCategory']);//To admin and users

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

    Route::get('/admin/orders', [AdminOrderController::class, 'index']);
    Route::get('/admin/orders/{id}', [AdminOrderController::class, 'show']);
    Route::get('/admin/orders/by-status/{status}', [AdminOrderController::class, 'getByStatus']);
    Route::post('/admin/orders/{id}/processing', [AdminOrderController::class, 'setProcessing']);
    
    Route::get('/delivery-members', [AdminDeliveryMembersController::class, 'index']);
    Route::post('/delivery-members', [AdminDeliveryMembersController::class, 'store']);
    Route::put('/delivery-members/{id}', [AdminDeliveryMembersController::class, 'update']);
    Route::delete('/delivery-members/{id}', [AdminDeliveryMembersController::class, 'destroy']);

    Route::post('/orders/{id}/assign-delivery', [AdminDeliveryMembersController::class, 'assignDelivery']);

    Route::post('admin/logout', [AdminAuthController::class, 'logout']);

});

// User Routes
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

//Delivery Member Routes
Route::post('/delivery/login', [DeliveryAuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/delivery/orders', [DeliveryOrderController::class, 'myOrders']);
    Route::get('/delivery/orders/{status}', [DeliveryOrderController::class, 'myOrdersByStatus']);
    Route::put('/delivery/orders/{orderId}/status', [DeliveryOrderController::class, 'updateOrderStatus']);
    Route::get('/delivery/orders/order/{id}', [DeliveryOrderController::class, 'show']);
    Route::post('/delivery/logout', [DeliveryAuthController::class, 'logout']);

});