<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Address;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AddressController extends BaseController
{
    /**
     * Get all addresses for the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $addresses = Address::where('user_id', Auth::id())
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->sendResponse($addresses);
    }

    /**
     * Store a newly created address in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:100',
            'recipient_name' => 'required|string|max:100',
            'phone_number' => 'required|string|max:20',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
            'landmark' => 'nullable|string|max:255',
            'type' => 'nullable|in:home,work,other',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        // If this is set as default, unset default for other addresses
        if ($request->is_default) {
            Address::where('user_id', Auth::id())->update(['is_default' => false]);
        } elseif (Address::where('user_id', Auth::id())->count() === 0) {
            // If this is the first address, set as default
            $request->merge(['is_default' => true]);
        }

        $address = new Address($request->all());
        $address->user_id = Auth::id();
        $address->save();

        return $this->sendResponse($address, 'Address added successfully', 201);
    }

    /**
     * Display the specified address.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $address = Address::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (is_null($address)) {
            return $this->sendError('Address not found');
        }

        return $this->sendResponse($address);
    }

    /**
     * Update the specified address in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $address = Address::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (is_null($address)) {
            return $this->sendError('Address not found');
        }

        $validator = Validator::make($request->all(), [
            'label' => 'string|max:100',
            'recipient_name' => 'string|max:100',
            'phone_number' => 'string|max:20',
            'address_line1' => 'string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'string|max:100',
            'state' => 'string|max:100',
            'postal_code' => 'string|max:20',
            'country' => 'string|max:100',
            'is_default' => 'boolean',
            'landmark' => 'nullable|string|max:255',
            'type' => 'nullable|in:home,work,other',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        // If this is set as default, unset default for other addresses
        if ($request->has('is_default') && $request->is_default) {
            Address::where('user_id', Auth::id())
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }

        $address->update($request->all());

        return $this->sendResponse($address, 'Address updated successfully');
    }

    /**
     * Remove the specified address from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $address = Address::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (is_null($address)) {
            return $this->sendError('Address not found');
        }

        // If this is the default address, set another address as default if available
        if ($address->is_default) {
            $newDefault = Address::where('user_id', Auth::id())
                ->where('id', '!=', $id)
                ->first();

            if ($newDefault) {
                $newDefault->update(['is_default' => true]);
            }
        }

        $address->delete();

        return $this->sendResponse(null, 'Address deleted successfully');
    }

    /**
     * Set an address as default
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function setDefault($id)
    {
        $address = Address::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (is_null($address)) {
            return $this->sendError('Address not found');
        }

        // Unset current default
        Address::where('user_id', Auth::id())
            ->where('id', '!=', $id)
            ->update(['is_default' => false]);

        // Set new default
        $address->update(['is_default' => true]);

        return $this->sendResponse($address, 'Default address updated successfully');
    }

    /**
     * Get the user's default address
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDefault()
    {
        $address = Address::where('user_id', Auth::id())
            ->where('is_default', true)
            ->first();

        if (is_null($address)) {
            return $this->sendError('No default address found');
        }

        return $this->sendResponse($address);
    }

    /**
     * Get pharmacies near an address
     *
     * @param  int  $addressId
     * @return \Illuminate\Http\JsonResponse
     */
    public function nearbyPharmacies($addressId)
    {
        $address = Address::find($addressId);

        if (is_null($address)) {
            return $this->sendError('Address not found');
        }

        // In a real application, you would use geolocation to find nearby pharmacies
        // For this example, we'll just return a list of pharmacies in the same city
        $pharmacies = Pharmacy::where('city', $address->city)
            ->where('is_active', true)
            ->get();

        return $this->sendResponse([
            'address' => $address,
            'nearby_pharmacies' => $pharmacies
        ]);
    }
}
