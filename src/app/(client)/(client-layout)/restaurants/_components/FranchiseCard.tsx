"use client";

import Link from "next/link";
import { MapPin /*, Clock, Truck */ } from "lucide-react";
import type { Franchise } from "@good-food-maalsi/contracts/franchise";

interface FranchiseCardProps {
  franchise: Franchise;
}

export function FranchiseCard({ franchise }: FranchiseCardProps) {
  const initials = franchise.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/restaurants/${franchise.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Placeholder visuel avec initiales (pas d'image dans le modèle Franchise) */}
      <div className="relative h-48 w-full bg-secondary-100 flex items-center justify-center group-hover:bg-secondary-200 transition-colors duration-300">
        <div className="w-20 h-20 rounded-full bg-secondary-500 flex items-center justify-center shadow-md">
          <span className="text-3xl font-bold text-white">{initials}</span>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-1">{franchise.name}</h2>

        {/* Adresse (substitut à la description, non disponible dans le modèle) */}
        <div className="flex items-start gap-1 text-sm text-black-400 mb-4">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">
            {franchise.street}, {franchise.city} {franchise.zip}
          </span>
        </div>

        {/* Durée et prix de livraison estimés — commentés car non disponibles dans le modèle Franchise */}
        {/* <div className="flex items-center gap-4 text-sm text-black-500">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Durée estimée</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        <span>Prix de livraison</span>
                    </div>
                </div> */}

        {/* Catégories de menus — non disponibles dans le modèle Franchise (pas de relation exposée) */}
        {/* <div className="mt-4 flex flex-wrap gap-2">
                    {franchise.categories?.slice(0, 3).map((cat) => (
                        <span key={cat.id} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-black-600">
                            {cat.name}
                        </span>
                    ))}
                </div> */}
      </div>
    </Link>
  );
}
