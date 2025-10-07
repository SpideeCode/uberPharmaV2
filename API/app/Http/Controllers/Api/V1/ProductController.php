<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends BaseController
{
    /**
     * Display a listing of the products.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $products = Product::with(['category', 'pharmacies'])->get();
        return $this->sendResponse($products);
    }

    /**
     * Store a newly created product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|string',
            'category_id' => 'required|exists:product_categories,id',
            'pharmacy_id' => 'required|exists:pharmacies,id',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $product = Product::create($request->all());
        
        // Attach to pharmacy with stock
        if ($request->has('pharmacy_id')) {
            $product->pharmacies()->attach($request->pharmacy_id, [
                'stock' => $request->stock,
                'price' => $request->price
            ]);
        }

        return $this->sendResponse($product, 'Product created successfully', 201);
    }

    /**
     * Display the specified product.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $product = Product::with(['category', 'pharmacies'])->find($id);
        
        if (is_null($product)) {
            return $this->sendError('Product not found');
        }

        return $this->sendResponse($product);
    }

    /**
     * Update the specified product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        
        if (is_null($product)) {
            return $this->sendError('Product not found');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'stock' => 'integer|min:0',
            'image' => 'nullable|string',
            'category_id' => 'exists:product_categories,id',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $product->update($request->all());
        
        // Update pharmacy relationship if needed
        if ($request->has('pharmacy_id') && $request->has('stock')) {
            $product->pharmacies()->sync([
                $request->pharmacy_id => [
                    'stock' => $request->stock,
                    'price' => $request->price ?? $product->price
                ]
            ]);
        }

        return $this->sendResponse($product, 'Product updated successfully');
    }

    /**
     * Remove the specified product from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $product = Product::find($id);
        
        if (is_null($product)) {
            return $this->sendError('Product not found');
        }

        $product->delete();
        return $this->sendResponse(null, 'Product deleted successfully');
    }

    /**
     * Search products by name or description.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $products = Product::where('name', 'like', '%' . $request->query . '%')
            ->orWhere('description', 'like', '%' . $request->query . '%')
            ->with(['category', 'pharmacies'])
            ->get();

        return $this->sendResponse($products);
    }
}
