"use client";
export const FeaturesSection = () => (
  <div className="features py-20 bg-gray-100 text-center">
    <h2 className="text-4xl font-bold mb-10">Pourquoi nous choisir ?</h2>
    <div className="flex justify-around">
      <div className="feature-item">
        <h3 className="text-2xl font-semibold mb-2">
          Matchs basés sur vos goûts littéraires
        </h3>
        <p>
          Nous vous mettons en relation avec des personnes partageant vos
          passions.
        </p>
      </div>
      <div className="feature-item">
        <h3 className="text-2xl font-semibold mb-2">
          Événements littéraires exclusifs
        </h3>
        <p>
          Participez à des rencontres et discussions autour de vos livres
          préférés.
        </p>
      </div>
      <div className="feature-item">
        <h3 className="text-2xl font-semibold mb-2">
          Communauté bienveillante
        </h3>
        <p>Rejoignez une communauté de passionnés de littérature.</p>
      </div>
    </div>
  </div>
);
