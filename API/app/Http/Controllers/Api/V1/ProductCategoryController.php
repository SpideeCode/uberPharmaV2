<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductCategoryController extends BaseController
{
    /**
     * Display a listing of the product categories.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $categories = ProductCategory::withCount('products')->get();
        return $this->sendResponse($categories);
    }

    /**
     * Store a newly created product category in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:product_categories',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $category = ProductCategory::create($request->all());

        return $this->sendResponse($category, 'Category created successfully', 201);
    }

    /**
     * Display the specified product category.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $category = ProductCategory::with('products')->find($id);
        
        if (is_null($category)) {
            return $this->sendError('Category not found');
        }

        return $this->sendResponse($category);
    }

    /**
     * Update the specified product category in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $category = ProductCategory::find($id);
        
        if (is_null($category)) {
            return $this->sendError('Category not found');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|unique:product_categories,name,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $category->update($request->all());

        return $this->sendResponse($category, 'Category updated successfully');
    }

    /**
     * Remove the specified product category from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $category = ProductCategory::find($id);
        
        if (is_null($category)) {
            return $this->sendError('Category not found');
        }

        // Check if category has products
        if ($category->products()->count() > 0) {
            return $this->sendError('Cannot delete category with associated products', [], 422);
        }

        $category->delete();

        return $this->sendResponse(null, 'Category deleted successfully');
    }

    /**
     * Get products by category
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function products($id)
    {
        $category = ProductCategory::with('products')->find($id);
        
        if (is_null($category)) {
            return $this->sendError('Category not found');
        }

        return $this->sendResponse($category->products);
    }
}
