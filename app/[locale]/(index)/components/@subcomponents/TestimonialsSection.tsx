"use client";
export const TestimonialsSection = () => (
  <div className="testimonials py-20 bg-white text-center">
    <h2 className="text-4xl font-bold mb-10">Ce que disent nos membres</h2>
    <div className="flex justify-around">
      <div className="testimonial-item">
        <p className="italic">
          "Grâce à ce site, j'ai rencontré ma moitié. Nous partageons notre
          passion pour la littérature chaque jour."
        </p>
        <p className="font-bold mt-2">- Marie</p>
      </div>
      <div className="testimonial-item">
        <p className="italic">
          "Les événements littéraires sont fantastiques. J'ai fait de belles
          rencontres et découvert de nouveaux auteurs."
        </p>
        <p className="font-bold mt-2">- Jean</p>
      </div>
    </div>
  </div>
);
