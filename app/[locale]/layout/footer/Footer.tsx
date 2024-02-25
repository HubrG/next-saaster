"use client";
type FooterProps = {};

export default function Footer() {
  return (
    <footer className="bg-theming-background-200/10 text-white p-6 mt-20 min-h-[20vh]">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-2">About Us</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero.
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <ul className="list-none">
              <li className="mb-2">
                <a href="#" className="text-white hover:text-gray-300">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white hover:text-gray-300">
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white hover:text-gray-300">
                  Services
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white hover:text-gray-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <p>123 Street, City, Country</p>
            <p>Email: info@example.com</p>
            <p>Phone: +1234567890</p>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6">
          <p className="text-center text-sm">
            © 2023 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
