"use client";

import Link from "next/link";
import { Icons } from "@/components/icons";
import {
  FaSnapchatGhost,
  FaInstagram,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa";
import { Apple, Play } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Subscribe:", email);
  };

  return (
    <footer className="bg-gray-100 mt-16">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Logo and App Downloads */}
          <div>
            <Link href="/home" className="inline-block mb-6">
              <Icons.logo className="w-24 h-20" />
            </Link>

            {/* App Store Badges */}
            <div className="flex flex-col gap-3 mb-6">
              <Link
                href="#"
                className="bg-black-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black-400 transition-colors w-fit"
              >
                <Apple className="text-2xl" />
                <div className="text-left">
                  <p className="text-[10px]">Download on the</p>
                  <p className="text-sm font-bold">App Store</p>
                </div>
              </Link>

              <Link
                href="#"
                className="bg-black-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black-400 transition-colors w-fit"
              >
                <Play className="text-2xl" />
                <div className="text-left">
                  <p className="text-[10px]">GET IT ON</p>
                  <p className="text-sm font-bold">Google Play</p>
                </div>
              </Link>
            </div>

            <p className="text-xs text-black-400">
              Société n°490039-445, enregistrée auprès de la Chambre des
              sociétés.
            </p>
          </div>

          {/* Column 2 - Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-black-500 mb-4">
              Recevez des offres exclusives dans votre boîte mail
            </h3>

            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white border border-black-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-secondary-500 hover:bg-secondary-400 text-white font-bold rounded-full transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>

            <p className="text-xs text-black-400 mb-4">
              Nous n'envoyons pas de spam, lisez notre{" "}
              <Link href="/email-policy" className="underline">
                politique de confidentialité
              </Link>
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              <Link
                href="#"
                className="w-10 h-10 bg-black-500 rounded-full flex items-center justify-center hover:bg-black-400 transition-colors"
              >
                <FaFacebook className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-black-500 rounded-full flex items-center justify-center hover:bg-black-400 transition-colors"
              >
                <FaInstagram className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-black-500 rounded-full flex items-center justify-center hover:bg-black-400 transition-colors"
              >
                <FaTiktok className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 bg-black-500 rounded-full flex items-center justify-center hover:bg-black-400 transition-colors"
              >
                <FaSnapchatGhost className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Column 3 - Legal Pages */}
          <div>
            <h3 className="text-lg font-bold text-black-500 mb-4">
              Pages légales
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-black-400 hover:text-secondary-500 transition-colors"
                >
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-black-400 hover:text-secondary-500 transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-black-400 hover:text-secondary-500 transition-colors"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/modern-slavery"
                  className="text-sm text-black-400 hover:text-secondary-500 transition-colors"
                >
                  Éthique et conformité
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Useful Links */}
          <div>
            <h3 className="text-lg font-bold text-black-500 mb-4">
              Liens utiles
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-black-400 hover:text-secondary-500 transition-colors"
                >
                  Obtenir de l'aide
                </Link>
              </li>
              <li>
                <Link
                  href="/partner/signup"
                  className="text-sm text-black-400 hover:text-secondary-500 transition-colors"
                >
                  Ajouter votre restaurant
                </Link>
              </li>
              <li>
                <Link
                  href="/rider/signup"
                  className="text-sm text-black-400 hover:text-secondary-500 transition-colors"
                >
                  Inscrivez-vous pour livrer
                </Link>
              </li>
              <li>
                <Link
                  href="/business"
                  className="text-sm text-black-400 hover:text-secondary-500 transition-colors"
                >
                  Créer un compte professionnel
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black-500 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>GoodFood.fr Copyright 2025, tous droits réservés.</p>

            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-primary-400">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="hover:text-primary-400">
                Conditions générales
              </Link>
              <Link href="/pricing" className="hover:text-primary-400">
                Tarification
              </Link>
              <Link
                href="/do-not-sell"
                className="hover:text-primary-400 whitespace-nowrap"
              >
                Ne pas vendre ou partager mes informations personnelles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
