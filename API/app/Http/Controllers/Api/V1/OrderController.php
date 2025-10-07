<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Pharmacy;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends BaseController
{
    /**
     * Display a listing of the orders.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'admin') {
            $orders = Order::with(['user', 'items.product', 'delivery'])->get();
        } elseif ($user->role === 'pharmacy') {
            $orders = Order::whereHas('items.product', function($query) use ($user) {
                $query->where('pharmacy_id', $user->pharmacy->id);
            })->with(['user', 'items.product', 'delivery'])->get();
        } else {
            $orders = Order::where('user_id', $user->id)
                ->with(['items.product', 'delivery'])
                ->get();
        }
        
        return $this->sendResponse($orders);
    }

    /**
     * Store a newly created order in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:100',
            'shipping_postal_code' => 'required|string|max:20',
            'shipping_country' => 'required|string|max:100',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        // Check product availability and calculate total
        $total = 0;
        $items = [];
        
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            
            if (!$product || $product->stock < $item['quantity']) {
                return $this->sendError("Product {$product->name} is out of stock or insufficient quantity");
            }
            
            $items[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'unit_price' => $product->price,
                'total_price' => $product->price * $item['quantity'],
            ];
            
            $total += $product->price * $item['quantity'];
        }

        // Create the order
        $order = Order::create([
            'user_id' => Auth::id(),
            'total_amount' => $total,
            'status' => 'pending',
            'shipping_address' => $request->shipping_address,
            'shipping_city' => $request->shipping_city,
            'shipping_postal_code' => $request->shipping_postal_code,
            'shipping_country' => $request->shipping_country,
            'notes' => $request->notes,
        ]);

        // Add order items
        foreach ($items as $item) {
            $order->items()->create($item);
            
            // Update product stock
            $product = Product::find($item['product_id']);
            $product->decrement('stock', $item['quantity']);
        }

        return $this->sendResponse($order->load('items'), 'Order created successfully', 201);
    }

    /**
     * Display the specified order.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $order = Order::with(['user', 'items.product', 'delivery'])->find($id);
        
        if (is_null($order)) {
            return $this->sendError('Order not found');
        }

        // Check if user is authorized to view this order
        $user = Auth::user();
        if ($user->role === 'client' && $order->user_id !== $user->id) {
            return $this->sendForbidden('You are not authorized to view this order');
        }
        
        if ($user->role === 'pharmacy') {
            $pharmacyProducts = $order->items->pluck('product.pharmacy_id')->unique();
            if (!in_array($user->pharmacy->id, $pharmacyProducts->toArray())) {
                return $this->sendForbidden('You are not authorized to view this order');
            }
        }

        return $this->sendResponse($order);
    }

    /**
     * Update the specified order status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $order = Order::find($id);
        
        if (is_null($order)) {
            return $this->sendError('Order not found');
        }

        // Check authorization
        $user = Auth::user();
        if ($user->role === 'client' && $order->user_id !== $user->id) {
            return $this->sendForbidden('You are not authorized to update this order');
        }

        $order->update(['status' => $request->status]);
        
        // If order is cancelled, restock products
        if ($request->status === 'cancelled') {
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                $product->increment('stock', $item->quantity);
            }
        }

        return $this->sendResponse($order, 'Order status updated successfully');
    }
    /**
     * Get orders for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function myOrders()
    {
        $user = Auth::user();
        $orders = Order::with(['items.product', 'pharmacy', 'delivery'])
            ->where('user_id', $user->id)
            ->get();

        // Commandes assignées au livreur
        $myDeliveries = Order::with(['pharmacy', 'delivery'])
            ->whereHas('delivery', function($query) use ($user) {
                $query->where('courier_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // Statistiques
        $stats = [
            'total' => $myDeliveries->count(),
            'in_progress' => $myDeliveries->whereIn('status', ['picked_up', 'on_the_way'])->count(),
            'delivered' => $myDeliveries->where('status', 'delivered')->count(),
        ];

        return $this->sendResponse([
            'available_orders' => $availableOrders,
            'my_deliveries' => $myDeliveries,
            'stats' => $stats
        ]);
    }

    /**
     * Accept an order for delivery.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function acceptOrder($id)
    {
        $user = Auth::user();

        if ($user->role !== 'courier') {
            return $this->sendError('Unauthorized', [], 403);
        }

        $order = Order::with('delivery')->findOrFail($id);

        // Vérifier si la commande est disponible pour livraison
        if ($order->status !== 'ready_for_delivery' || 
            ($order->delivery && $order->delivery->courier_id !== null)) {
            return $this->sendError('This order is not available for delivery', [], 400);
        }

        DB::beginTransaction();
        try {
            // Mettre à jour la livraison
            $order->delivery()->updateOrCreate(
                ['order_id' => $order->id],
                [
                    'courier_id' => $user->id,
                    'status' => 'assigned',
                    'assigned_at' => now()
                ]
            );

            // Mettre à jour le statut de la commande
            $order->update(['status' => 'assigned_to_courier']);

            // Envoyer une notification au client et à la pharmacie
            // TODO: Implémenter le système de notification

            DB::commit();
            return $this->sendResponse($order->load('delivery'), 'Order accepted for delivery');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to accept order: ' . $e->getMessage(), [], 500);
        }
    }

    /**
     * Mark an order as picked up by the courier.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function pickUpOrder($id)
    {
        $user = Auth::user();
        $order = Order::with('delivery')->findOrFail($id);

        if ($user->role !== 'courier' || $order->delivery->courier_id !== $user->id) {
            return $this->sendError('Unauthorized', [], 403);
        }

        if ($order->status !== 'assigned_to_courier') {
            return $this->sendError('Order cannot be picked up in its current state', [], 400);
        }

        DB::beginTransaction();
        try {
            // Mettre à jour la livraison
            $order->delivery()->update([
                'status' => 'picked_up',
                'picked_up_at' => now()
            ]);

            // Mettre à jour le statut de la commande
            $order->update(['status' => 'in_delivery']);

            // Envoyer une notification au client
            // TODO: Implémenter le système de notification

            DB::commit();
            return $this->sendResponse($order->load('delivery'), 'Order picked up successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to update order status: ' . $e->getMessage(), [], 500);
        }
    }

    /**
     * Mark an order as delivered.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function completeOrder($id)
    {
        $user = Auth::user();
        $order = Order::with('delivery')->findOrFail($id);

        if ($user->role !== 'courier' || $order->delivery->courier_id !== $user->id) {
            return $this->sendError('Unauthorized', [], 403);
        }

        if ($order->status !== 'in_delivery') {
            return $this->sendError('Order cannot be marked as delivered in its current state', [], 400);
        }

        DB::beginTransaction();
        try {
            // Mettre à jour la livraison
            $order->delivery()->update([
                'status' => 'delivered',
                'delivered_at' => now()
            ]);

            // Mettre à jour le statut de la commande
            $order->update(['status' => 'delivered']);

            // Envoyer une notification au client et à la pharmacie
            // TODO: Implémenter le système de notification

            DB::commit();
            return $this->sendResponse($order->load('delivery'), 'Order marked as delivered');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to update order status: ' . $e->getMessage(), [], 500);
        }
    }
