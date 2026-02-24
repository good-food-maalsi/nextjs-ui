"use client";

import Image from "next/image";
import { useState } from "react";

export function HeroBanner() {
  const [postcode, setPostcode] = useState("");

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Searching for:", postcode);
  };

  return (
    <div className="relative w-full rounded-[40px] overflow-visible shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
        {/* Left side - Text and Search (White background) */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-l-[40px] flex flex-col justify-center p-8 lg:p-12 lg:pl-16 z-10">
          <p className="text-black-400 text-base mb-4">
            Commandez des plats de restaurant, à emporter et des courses.
          </p>

          <h1 className="text-[52px] font-bold mb-1 text-black-500 leading-tight">
            Réveillez vos sens,
          </h1>
          <h2 className="text-[52px] font-bold text-secondary-500 mb-6 leading-tight">
            Rapide et frais
          </h2>

          <div className="mt-4">
            <p className="text-sm text-black-400 mb-3 font-medium">
              Entrez un code postal pour voir ce que nous livrons
            </p>

            <div className="flex gap-3 max-w-md">
              <input
                type="text"
                placeholder="Exemple : Tr0pB1au"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="flex-1 px-6 py-3 rounded-full border-2 border-black-200 bg-white text-black-500 placeholder:text-black-300 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="relative z-50 cursor-pointer px-8 py-3 bg-secondary-500 hover:bg-secondary-400 text-white font-bold rounded-full transition-colors duration-200 whitespace-nowrap shadow-md text-sm"
              >
                Search
              </button>
            </div>
          </div>
        </div>

  {/* Right side - Orange background with notifications */}
  <div className="relative bg-secondary-500 rounded-l-[40px] rounded-r-[40px] flex items-center justify-end overflow-visible">
          {/* Notification Cards positioned in the orange section */}
          <div className="absolute right-8 top-[12%] space-y-15 z-20">
            {/* Notification 1 */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-3.5 w-[240px] animate-slide-in-right overflow-hidden">
              <div className="relative flex items-start gap-2">
                <div className="text-5xl font-bold text-secondary-500/10 leading-none mt-[-4px]">
                  1
                </div>
                <div className="flex-1">
                  <div className="text-[9px] text-black-300 mb-0.5">Maintenant</div>
                  <div className="font-bold text-xs mb-0.5 text-black-500">
                    Nous avons bien reçu votre commande !
                  </div>
                  <div className="text-[10px] text-black-400">
                    En attente de l'acceptation du restaurant
                  </div>
                </div>
              </div>
            </div>

            {/* Notification 2 */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-3.5 w-[240px] animate-slide-in-right animation-delay-200 overflow-hidden">
              <div className="relative flex items-start gap-2">
                <div className="text-5xl font-bold text-secondary-500/10 leading-none mt-[-4px]">
                  2
                </div>
                <div className="flex-1">
                  <div className="text-[9px] text-black-300 mb-0.5">Maintenant</div>
                  <div className="font-bold text-xs mb-0.5 flex items-center gap-1.5 text-black-500">
                    Commande acceptée !
                    <span className="text-success text-sm">✓</span>
                  </div>
                  <div className="text-[10px] text-black-400">
                    Votre commande sera livrée sous peu
                  </div>
                </div>
              </div>
            </div>

            {/* Notification 3 */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-3.5 w-[240px] animate-slide-in-right animation-delay-400 overflow-hidden">
              <div className="relative flex items-start gap-2">
                <div className="text-5xl font-bold text-secondary-500/10 leading-none mt-[-4px]">
                  3
                </div>
                <div className="flex-1">
                  <div className="text-[9px] text-black-300 mb-0.5">Maintenant</div>
                  <div className="font-bold text-xs mb-0.5 flex items-center gap-1.5 text-black-500">
                    Commande acceptée !
                    <span className="text-success text-sm">✓</span>
                  </div>
                  <div className="text-[10px] text-black-400">
                    Votre commande sera livrée sous peu
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background pasta woman image */}
            {/* Pasta woman: positioned inside the orange card, right side, vertically centered relative to notifications */}
            <div className="absolute right-48 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <Image
                src="/images/home/women_eat_pasta.svg"
                alt="Woman eating pasta"
                width={500}
                height={500}
                className="object-contain w-full h-full drop-shadow-2xl"
                priority
              />
            </div>
    </div>

        {/* Woman with pizza - moved to the bottom of the card */}
  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 z-30 pointer-events-none">
          <Image
            src="/images/home/women_eat_pizza.svg"
            alt="Woman eating pizza"
            width={500}
            height={550}
            className="object-contain w-full h-full drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
