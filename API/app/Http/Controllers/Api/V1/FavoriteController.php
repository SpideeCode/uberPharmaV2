<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Favorite;
use App\Models\Product;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FavoriteController extends BaseController
{
    /**
     * Get all favorites for the authenticated user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $favorites = Favorite::where('user_id', Auth::id())
            ->with(['favoriteable'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 10));

        return $this->sendResponse($favorites);
    }

    /**
     * Add an item to favorites
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'favoriteable_type' => 'required|in:product,pharmacy',
            'favoriteable_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        // Check if the favoriteable exists
        $favoriteable = $this->getFavoriteable($request->favoriteable_type, $request->favoriteable_id);
        if (!$favoriteable) {
            return $this->sendError('Invalid favoriteable entity');
        }

        // Check if already favorited
        $existingFavorite = Favorite::where('user_id', Auth::id())
            ->where('favoriteable_type', $request->favoriteable_type)
            ->where('favoriteable_id', $request->favoriteable_id)
            ->first();

        if ($existingFavorite) {
            return $this->sendError('Item is already in your favorites');
        }

        $favorite = new Favorite([
            'user_id' => Auth::id(),
            'favoriteable_type' => $request->favoriteable_type,
            'favoriteable_id' => $request->favoriteable_id,
        ]);

        $favorite->save();
        $favorite->load('favoriteable');

        return $this->sendResponse($favorite, 'Item added to favorites', 201);
    }

    /**
     * Remove an item from favorites
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $favorite = Favorite::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (is_null($favorite)) {
            return $this->sendError('Favorite not found or you do not have permission to remove it');
        }

        $favorite->delete();

        return $this->sendResponse(null, 'Item removed from favorites');
    }

    /**
     * Check if an item is in favorites
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function check(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'favoriteable_type' => 'required|in:product,pharmacy',
            'favoriteable_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors(), 422);
        }

        $isFavorite = Favorite::where('user_id', Auth::id())
            ->where('favoriteable_type', $request->favoriteable_type)
            ->where('favoriteable_id', $request->favoriteable_id)
            ->exists();

        return $this->sendResponse([
            'is_favorite' => $isFavorite
        ]);
    }

    /**
     * Get the favoriteable model instance.
     *
     * @param  string  $type
     * @param  int  $id
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    private function getFavoriteable($type, $id)
    {
        switch ($type) {
            case 'product':
                return Product::find($id);
            case 'pharmacy':
                return Pharmacy::find($id);
            default:
                return null;
        }
    }
}
