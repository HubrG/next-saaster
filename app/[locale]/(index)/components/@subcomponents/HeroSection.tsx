"use client";
import { Button } from "@/src/components/ui/button";

export const HeroSection = () => (
  <div className="hero bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white text-center py-20">
    <h1 className="text-5xl font-bold mb-4">
      Rencontrez des passionnés de littérature
    </h1>
    <p className="text-xl mb-8">
      Découvrez des âmes sœurs à travers les livres
    </p>
    <Button className="bg-white text-purple-500 px-6 py-3 rounded-full">
      Commencez maintenant
    </Button>
  </div>
);
