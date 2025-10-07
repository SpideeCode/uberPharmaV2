<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeliveryController extends BaseController
{
    /**
     * Get all deliveries (for admin and couriers)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'admin') {
            $deliveries = Delivery::with(['order', 'courier'])->get();
        } else if ($user->role === 'courier') {
            $deliveries = $user->deliveries()->with('order')->get();
        } else {
            return $this->sendForbidden('You are not authorized to view deliveries');
        }

        return $this->sendResponse($deliveries);
    }

    /**
     * Get available deliveries for couriers
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function available()
    {
        if (Auth::user()->role !== 'courier') {
            return $this->sendForbidden('Only couriers can view available deliveries');
        }

        $deliveries = Delivery::whereNull('courier_id')
            ->where('status', 'pending')
            ->with('order')
            ->get();

        return $this->sendResponse($deliveries);
    }

    /**
     * Accept a delivery (for couriers)
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function accept($id)
    {
        $user = Auth::user();
        
        if ($user->role !== 'courier') {
            return $this->sendForbidden('Only couriers can accept deliveries');
        }

        $delivery = Delivery::find($id);
        
        if (is_null($delivery)) {
            return $this->sendError('Delivery not found');
        }

        if ($delivery->courier_id) {
            return $this->sendError('Delivery already assigned');
        }

        $delivery->update([
            'courier_id' => $user->id,
            'status' => 'accepted',
            'accepted_at' => now()
        ]);

        // Update order status
        $delivery->order->update(['status' => 'shipped']);

        return $this->sendResponse($delivery, 'Delivery accepted successfully');
    }

    /**
     * Update delivery status
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        
        if ($user->role !== 'courier') {
            return $this->sendForbidden('Only couriers can update delivery status');
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:picked_up,in_transit,delivered,delayed,cancelled',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $delivery = $user->deliveries()->find($id);
        
        if (is_null($delivery)) {
            return $this->sendError('Delivery not found or not assigned to you');
        }

        $updates = [
            'status' => $request->status,
            'notes' => $request->notes
        ];

        // Set delivered_at timestamp if status is delivered
        if ($request->status === 'delivered') {
            $updates['delivered_at'] = now();
            
            // Update order status to completed
            $delivery->order->update(['status' => 'completed']);
        }

        $delivery->update($updates);

        return $this->sendResponse($delivery, 'Delivery status updated successfully');
    }

    /**
     * Get delivery tracking information
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function track($id)
    {
        $delivery = Delivery::with(['order', 'courier'])->find($id);
        
        if (is_null($delivery)) {
            return $this->sendError('Delivery not found');
        }

        // Only allow the customer who placed the order, the assigned courier, or admin to track
        $user = Auth::user();
        if ($user->role !== 'admin' && 
            $user->id !== $delivery->order->user_id && 
            $user->id !== $delivery->courier_id) {
            return $this->sendForbidden('You are not authorized to track this delivery');
        }

        $trackingInfo = [
            'status' => $delivery->status,
            'courier' => $delivery->courier ? $delivery->courier->name : 'Not assigned',
            'estimated_delivery' => $delivery->estimated_delivery,
            'current_location' => $delivery->current_location,
            'notes' => $delivery->notes,
            'accepted_at' => $delivery->accepted_at,
            'picked_up_at' => $delivery->picked_up_at,
            'delivered_at' => $delivery->delivered_at,
            'order' => $delivery->order
        ];

        return $this->sendResponse($trackingInfo);
    }
}
