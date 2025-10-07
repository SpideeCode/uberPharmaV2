<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends BaseController
{
    /**
     * Get the authenticated user's cart.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $cartItems = Auth::user()->cart()->with('product')->get();
        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return $this->sendResponse([
            'items' => $cartItems,
            'total' => $total
        ]);
    }

    /**
     * Add an item to the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $product = Product::find($request->product_id);
        
        // Check if product is already in cart
        $cartItem = Auth::user()->cart()->where('product_id', $request->product_id)->first();
        
        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
        } else {
            $cartItem = Auth::user()->cart()->create([
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $product->price
            ]);
        }

        return $this->sendResponse($cartItem->load('product'), 'Item added to cart', 201);
    }

    /**
     * Update the specified cart item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $cartItem = Auth::user()->cart()->find($id);
        
        if (is_null($cartItem)) {
            return $this->sendError('Cart item not found');
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return $this->sendResponse($cartItem->load('product'), 'Cart updated successfully');
    }

    /**
     * Remove the specified item from cart.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $cartItem = Auth::user()->cart()->find($id);
        
        if (is_null($cartItem)) {
            return $this->sendError('Cart item not found');
        }

        $cartItem->delete();

        return $this->sendResponse(null, 'Item removed from cart');
    }

    /**
     * Clear the user's cart.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clear()
    {
        Auth::user()->cart()->delete();
        return $this->sendResponse(null, 'Cart cleared successfully');
    }
}
