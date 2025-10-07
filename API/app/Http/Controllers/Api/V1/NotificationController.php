<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends BaseController
{
    /**
     * Get all notifications for the authenticated user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return $this->sendResponse($notifications);
    }

    /**
     * Mark a notification as read
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->find($id);
        
        if (is_null($notification)) {
            return $this->sendError('Notification not found');
        }

        $notification->markAsRead();

        return $this->sendResponse(null, 'Notification marked as read');
    }

    /**
     * Mark all notifications as read
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();
        return $this->sendResponse(null, 'All notifications marked as read');
    }

    /**
     * Get unread notifications count
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function unreadCount()
    {
        $count = Auth::user()->unreadNotifications()->count();
        return $this->sendResponse(['count' => $count]);
    }

    /**
     * Delete a notification
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->find($id);
        
        if (is_null($notification)) {
            return $this->sendError('Notification not found');
        }

        $notification->delete();

        return $this->sendResponse(null, 'Notification deleted');
    }

    /**
     * Clear all notifications
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clear()
    {
        Auth::user()->notifications()->delete();
        return $this->sendResponse(null, 'All notifications cleared');
    }
}
