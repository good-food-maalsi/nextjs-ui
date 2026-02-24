"use client";

import Link from "next/link";
import { Sparkles, ShoppingBasket  } from 'lucide-react';



export function PromoBanner() {
  return (
  <div className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-sm">
          {/* Left side - Promo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <p className="text-black-500">
              Gagnez <span className="font-semibold">-5%</span> sur votre
              première commande,{" "}
              <Link
                href="#"
                className="text-secondary-500 font-semibold underline hover:text-secondary-400"
              >
                Promo: FIRSTSTORE
              </Link>
            </p>
          </div>

          {/* Right side - Address & Cart */}
          <div className="flex items-center gap-6">
            {/* Address */}
            <div className="flex items-center gap-2">
              <span className="text-black-500">📍</span>
              <span className="text-black-500">64 rue d'Elbeuf, 76100 Rouen</span>
              <Link
                href="#"
                className="text-secondary-500 hover:text-secondary-400 text-sm"
              >
                Changer d'adresse
              </Link>
            </div>

            {/* Cart */}
            <Link
              href="/client/cart"
              className="flex items-center gap-4 bg-primary-400 hover:bg-primary-500 transition-colors rounded-lg overflow-hidden"
            >
              <div className="bg-primary-500 px-4 py-2">
                <ShoppingBasket  className="w-6 h-6 text-white" />
              </div>
              <div className="px-4 py-2 flex items-center gap-4">
                <span className="font-semibold text-black-500">26 Articles</span>
                <span className="font-bold text-black-500">79,89 €</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
