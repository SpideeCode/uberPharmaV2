<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PharmacyController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\AddressController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth routes
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

                // User routes
        Route::get('/profile', [UserController::class, 'profile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        
        // Pharmacy routes
        Route::apiResource('pharmacies', PharmacyController::class);
        Route::get('pharmacies/{id}/products', [PharmacyController::class, 'products']);
        
        // Product routes
        Route::apiResource('products', ProductController::class)->except(['update']);
        Route::post('products/{product}', [ProductController::class, 'update']); // Workaround for form-data
        Route::get('products/search/{query}', [ProductController::class, 'search']);
        
        // Order routes
        Route::apiResource('orders', OrderController::class)->except(['update']);
        Route::post('orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::get('my-orders', [OrderController::class, 'myOrders']);
        
        // Admin only routes
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('users', UserController::class);
        });
        
        // Pharmacy owner routes
        Route::middleware('role:pharmacy')->group(function () {
            Route::get('pharmacy/orders', [OrderController::class, 'pharmacyOrders']);
            Route::post('products/{product}/stock', [ProductController::class, 'updateStock']);
        });
        
        // Courier routes
        Route::middleware('role:courier')->group(function () {
            Route::get('courier/orders', [OrderController::class, 'availableOrders']);
            Route::post('orders/{order}/accept', [OrderController::class, 'acceptOrder']);
            Route::post('orders/{order}/complete', [OrderController::class, 'completeOrder']);
        });

        // Review routes
        Route::apiResource('reviews', ReviewController::class)->except(['index']);
        Route::get('reviews', [ReviewController::class, 'index']); // Separate to include query params
        
        // Payment routes
        Route::post('payments/process', [PaymentController::class, 'processPayment']);
        Route::get('orders/{order}/payment', [PaymentController::class, 'getPaymentDetails']);
        Route::post('orders/{order}/refund', [PaymentController::class, 'processRefund'])->middleware('role:admin');
        
        // Notification routes
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::put('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);
        Route::delete('notifications', [NotificationController::class, 'clear']);
        
        // Favorite routes
        Route::get('favorites', [FavoriteController::class, 'index']);
        Route::post('favorites', [FavoriteController::class, 'store']);
        Route::get('favorites/check', [FavoriteController::class, 'check']);
        Route::delete('favorites/{id}', [FavoriteController::class, 'destroy']);
        
        // Address routes
        Route::apiResource('addresses', AddressController::class);
        Route::put('addresses/{id}/default', [AddressController::class, 'setDefault']);
        Route::get('addresses/default', [AddressController::class, 'getDefault']);
        Route::get('addresses/{id}/nearby-pharmacies', [AddressController::class, 'nearbyPharmacies']);
    });
});

// Fallback route for undefined API endpoints
Route::fallback(function () {
    return response()->json([
        'message' => 'API endpoint not found.'
    ], 404);
});
