<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    /** @use HasFactory<\Database\Factories\DeliveryFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id',
        'courier_id',
        'status',
        'tracking_number',
        'shipped_at',
        'delivered_at',
    ];

    protected $casts = [
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    /**
     * Relation avec la commande
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Relation avec le livreur
     */
    public function courier()
    {
        return $this->belongsTo(User::class, 'courier_id');
    }

    /**
     * Options de statut disponibles pour les livraisons
     */
    public static function getStatusOptions()
    {
        return [
            // Nouveaux statuts alignés sur la migration
            'assigned' => 'Assignée',
            'picked_up' => 'Récupérée',
            'on_the_way' => 'En route',
            'arrived' => 'Arrivé chez le client',
            'delivered' => 'Livrée',
            // Anciens statuts (si présents en base pour compat)
            'pending' => 'En attente',
            'in_transit' => 'En cours de livraison',
            'out_for_delivery' => 'En livraison',
            'failed' => 'Échec de livraison',
            'returned' => 'Retournée',
        ];
    }

    /**
     * Couleurs associées aux statuts de livraison
     */
    public static function getStatusColors()
    {
        return [
            'assigned' => 'bg-yellow-100 text-yellow-800',
            'picked_up' => 'bg-blue-100 text-blue-800',
            'on_the_way' => 'bg-indigo-100 text-indigo-800',
            'arrived' => 'bg-purple-100 text-purple-800',
            'delivered' => 'bg-green-100 text-green-800',
            'pending' => 'bg-yellow-100 text-yellow-800',
            'in_transit' => 'bg-blue-100 text-blue-800',
            'out_for_delivery' => 'bg-indigo-100 text-indigo-800',
            'failed' => 'bg-red-100 text-red-800',
            'returned' => 'bg-gray-100 text-gray-800',
        ];
    }

    /**
     * Récupère le libellé du statut
     */
    public function getStatusLabelAttribute()
    {
        return self::getStatusOptions()[$this->status] ?? $this->status;
    }

    /**
     * Récupère la couleur du statut
     */
    public function getStatusColorAttribute()
    {
        return self::getStatusColors()[$this->status] ?? 'bg-gray-100 text-gray-800';
    }
}
