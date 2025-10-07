<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Review;
use App\Models\Order;
use App\Models\Product;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends BaseController
{
    /**
     * Get reviews for a specific entity (product/pharmacy/order)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reviewable_type' => 'required|in:product,pharmacy,order',
            'reviewable_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $reviews = Review::where('reviewable_type', $request->reviewable_type)
            ->where('reviewable_id', $request->reviewable_id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 10));

        return $this->sendResponse($reviews);
    }

    /**
     * Store a newly created review in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reviewable_type' => 'required|in:product,pharmacy,order',
            'reviewable_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        // Check if the reviewable exists
        $reviewable = $this->getReviewable($request->reviewable_type, $request->reviewable_id);
        if (!$reviewable) {
            return $this->sendError('Invalid reviewable entity');
        }

        // Check if the user has already reviewed this item
        $existingReview = Review::where('user_id', Auth::id())
            ->where('reviewable_type', $request->reviewable_type)
            ->where('reviewable_id', $request->reviewable_id)
            ->first();

        if ($existingReview) {
            return $this->sendError('You have already reviewed this item');
        }

        // For orders, verify that the user has purchased the item
        if ($request->reviewable_type === 'product') {
            $hasPurchased = Order::where('user_id', Auth::id())
                ->whereHas('items', function($query) use ($request) {
                    $query->where('product_id', $request->reviewable_id);
                })
                ->where('status', 'completed')
                ->exists();

            if (!$hasPurchased) {
                return $this->sendError('You can only review products you have purchased');
            }
        }

        $review = new Review([
            'user_id' => Auth::id(),
            'reviewable_type' => $request->reviewable_type,
            'reviewable_id' => $request->reviewable_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 'pending', // Moderation might be needed
        ]);

        $review->save();

        // Update the reviewable's average rating
        $this->updateAverageRating($reviewable);

        return $this->sendResponse($review->load('user'), 'Review submitted successfully', 201);
    }

    /**
     * Update the specified review in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $review = Review::find($id);
        
        if (is_null($review)) {
            return $this->sendError('Review not found');
        }

        // Check if the authenticated user is the owner of the review
        if ($review->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return $this->sendForbidden('You are not authorized to update this review');
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'status' => 'in:pending,approved,rejected',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        // Only admin can change status
        if ($request->has('status') && Auth::user()->role !== 'admin') {
            unset($request['status']);
        }

        $review->update($request->all());

        // Update the reviewable's average rating
        $reviewable = $review->reviewable;
        $this->updateAverageRating($reviewable);

        return $this->sendResponse($review->load('user'), 'Review updated successfully');
    }

    /**
     * Remove the specified review from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $review = Review::find($id);
        
        if (is_null($review)) {
            return $this->sendError('Review not found');
        }

        // Check if the authenticated user is the owner of the review or an admin
        if ($review->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            return $this->sendForbidden('You are not authorized to delete this review');
        }

        $reviewable = $review->reviewable;
        $review->delete();

        // Update the reviewable's average rating
        $this->updateAverageRating($reviewable);

        return $this->sendResponse(null, 'Review deleted successfully');
    }

    /**
     * Get the reviewable model instance.
     *
     * @param  string  $type
     * @param  int  $id
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    private function getReviewable($type, $id)
    {
        switch ($type) {
            case 'product':
                return Product::find($id);
            case 'pharmacy':
                return Pharmacy::find($id);
            case 'order':
                return Order::find($id);
            default:
                return null;
        }
    }

    /**
     * Update the average rating of a reviewable model.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $reviewable
     * @return void
     */
    private function updateAverageRating($reviewable)
    {
        if (!$reviewable) return;

        $averageRating = $reviewable->reviews()
            ->where('status', 'approved')
            ->avg('rating');

        $reviewable->update([
            'average_rating' => round($averageRating, 1),
            'review_count' => $reviewable->reviews()->where('status', 'approved')->count(),
        ]);
    }
}
