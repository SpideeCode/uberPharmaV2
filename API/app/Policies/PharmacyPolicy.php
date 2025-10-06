<?php

namespace App\Policies;

use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PharmacyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Pharmacy $pharmacy): bool
    {
        // L'admin peut tout voir, sinon l'utilisateur doit être le propriétaire
        return $user->role === 'admin' || $user->id === $pharmacy->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Seul l'admin peut créer des pharmacies
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Pharmacy $pharmacy): bool
    {
        // L'admin peut tout mettre à jour, sinon l'utilisateur doit être le propriétaire
        return $user->role === 'admin' || $user->id === $pharmacy->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Pharmacy $pharmacy): bool
    {
        // Seul l'admin peut supprimer des pharmacies
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Pharmacy $pharmacy): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Pharmacy $pharmacy): bool
    {
        return false;
    }
}
