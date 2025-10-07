<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PaymentController extends BaseController
{
    /**
     * Process a payment for an order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function processPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'payment_method' => 'required|in:credit_card,mobile_money,paypal',
            'amount' => 'required|numeric|min:0.01',
            'payment_details' => 'required|array',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $order = Order::find($request->order_id);
        
        // Verify the order belongs to the authenticated user
        if ($order->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return $this->sendForbidden('You are not authorized to pay for this order');
        }

        // Verify the order amount matches
        if (abs($order->total_amount - $request->amount) > 0.01) {
            return $this->sendError('Payment amount does not match order total');
        }

        // In a real application, you would integrate with a payment gateway here
        // For this example, we'll simulate a successful payment
        
        try {
            // Process payment with payment gateway
            $paymentResult = $this->processWithPaymentGateway(
                $request->payment_method, 
                $request->amount, 
                $request->payment_details
            );

            if (!$paymentResult['success']) {
                return $this->sendError('Payment failed: ' . $paymentResult['message']);
            }

            // Create payment record
            $payment = new Payment([
                'order_id' => $order->id,
                'user_id' => Auth::id(),
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'transaction_id' => $paymentResult['transaction_id'],
                'status' => 'completed',
                'payment_details' => json_encode($request->payment_details),
            ]);

            $payment->save();

            // Update order status
            $order->update([
                'status' => 'paid',
                'payment_status' => 'paid',
                'payment_date' => now(),
            ]);

            return $this->sendResponse([
                'payment' => $payment,
                'order' => $order
            ], 'Payment processed successfully');

        } catch (\Exception $e) {
            return $this->sendError('Payment processing failed: ' . $e->getMessage());
        }
    }

    /**
     * Get payment details for an order.
     *
     * @param  int  $orderId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPaymentDetails($orderId)
    {
        $order = Order::find($orderId);
        
        if (is_null($order)) {
            return $this->sendError('Order not found');
        }

        // Verify the order belongs to the authenticated user or the user is admin
        if ($order->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return $this->sendForbidden('You are not authorized to view this payment');
        }

        $payment = $order->payment;
        
        if (is_null($payment)) {
            return $this->sendError('No payment found for this order');
        }

        return $this->sendResponse($payment);
    }

    /**
     * Process refund for an order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $orderId
     * @return \Illuminate\Http\JsonResponse
     */
    public function processRefund(Request $request, $orderId)
    {
        $order = Order::find($orderId);
        
        if (is_null($order)) {
            return $this->sendError('Order not found');
        }

        // Only admin can process refunds
        if (Auth::user()->role !== 'admin') {
            return $this->sendForbidden('You are not authorized to process refunds');
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0.01|max:' . $order->total_amount,
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $payment = $order->payment;
        
        if (is_null($payment)) {
            return $this->sendError('No payment found for this order');
        }

        // In a real application, you would integrate with a payment gateway here
        // For this example, we'll simulate a successful refund
        
        try {
            // Process refund with payment gateway
            $refundResult = $this->processRefundWithPaymentGateway(
                $payment->transaction_id,
                $request->amount,
                $request->reason
            );

            if (!$refundResult['success']) {
                return $this->sendError('Refund failed: ' . $refundResult['message']);
            }

            // Update payment record
            $refundData = [
                'refund_id' => $refundResult['refund_id'],
                'refund_amount' => $request->amount,
                'refund_reason' => $request->reason,
                'refund_date' => now(),
                'status' => 'refunded',
            ];

            $payment->update($refundData);

            // Update order status if full refund
            if (abs($request->amount - $order->total_amount) < 0.01) {
                $order->update(['status' => 'refunded']);
            } else {
                $order->update(['status' => 'partially_refunded']);
            }

            return $this->sendResponse([
                'refund' => $refundData,
                'order' => $order
            ], 'Refund processed successfully');

        } catch (\Exception $e) {
            return $this->sendError('Refund processing failed: ' . $e->getMessage());
        }
    }

    /**
     * Simulate processing payment with a payment gateway.
     * In a real application, this would integrate with a payment provider like Stripe, PayPal, etc.
     *
     * @param  string  $method
     * @param  float  $amount
     * @param  array  $details
     * @return array
     */
    private function processWithPaymentGateway($method, $amount, $details)
    {
        // This is a simulation - in a real app, you would call the payment gateway API here
        // For example: Stripe, PayPal, etc.
        
        // Simulate API call delay
        usleep(500000); // 0.5 seconds
        
        // Always return success for this example
        return [
            'success' => true,
            'transaction_id' => 'txn_' . strtoupper(substr(md5(uniqid()), 0, 16)),
            'message' => 'Payment processed successfully',
        ];
    }

    /**
     * Simulate processing a refund with a payment gateway.
     *
     * @param  string  $transactionId
     * @param  float  $amount
     * @param  string  $reason
     * @return array
     */
    private function processRefundWithPaymentGateway($transactionId, $amount, $reason)
    {
        // This is a simulation - in a real app, you would call the payment gateway API here
        
        // Simulate API call delay
        usleep(500000); // 0.5 seconds
        
        // Always return success for this example
        return [
            'success' => true,
            'refund_id' => 're_' . strtoupper(substr(md5(uniqid()), 0, 16)),
            'message' => 'Refund processed successfully',
        ];
    }
}
