<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PharmacyController extends BaseController
{
    /**
     * Display a listing of the pharmacies.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $pharmacies = Pharmacy::all();
        return $this->sendResponse($pharmacies);
    }

    /**
     * Store a newly created pharmacy in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:pharmacies,email',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $pharmacy = Pharmacy::create($request->all());
        return $this->sendResponse($pharmacy, 'Pharmacy created successfully', 201);
    }

    /**
     * Display the specified pharmacy.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $pharmacy = Pharmacy::find($id);
        
        if (is_null($pharmacy)) {
            return $this->sendError('Pharmacy not found');
        }

        return $this->sendResponse($pharmacy);
    }

    /**
     * Update the specified pharmacy in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $pharmacy = Pharmacy::find($id);
        
        if (is_null($pharmacy)) {
            return $this->sendError('Pharmacy not found');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'address' => 'string|max:255',
            'city' => 'string|max:100',
            'postal_code' => 'string|max:20',
            'country' => 'string|max:100',
            'phone' => 'string|max:20',
            'email' => 'email|unique:pharmacies,email,' . $id,
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $pharmacy->update($request->all());
        return $this->sendResponse($pharmacy, 'Pharmacy updated successfully');
    }

    /**
     * Remove the specified pharmacy from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $pharmacy = Pharmacy::find($id);
        
        if (is_null($pharmacy)) {
            return $this->sendError('Pharmacy not found');
        }

        $pharmacy->delete();
        return $this->sendResponse(null, 'Pharmacy deleted successfully');
    }

    /**
     * Get the products of the specified pharmacy.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function products($id)
    {
        $pharmacy = Pharmacy::with('products')->find($id);
        
        if (is_null($pharmacy)) {
            return $this->sendError('Pharmacy not found');
        }

        return $this->sendResponse($pharmacy->products);
    }
}
