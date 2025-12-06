import Link from 'next/link';
import { categories } from '@/data/products';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary via-primary to-primary/95 text-light mt-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
              Trendy Fashion Zone
            </h3>
            <p className="text-light/90 font-body mb-4 leading-relaxed">
              Walk the Talk — Style that Speaks.
            </p>
            <p className="text-light/70 font-body text-sm mb-6 leading-relaxed">
              5+ years of trust and style in Kenya&apos;s fashion industry. Quality original shoes, best sellers, and trending footwear.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://www.facebook.com/franklabels254"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary transition-all duration-300 flex items-center justify-center text-light/80 hover:text-white hover:scale-110"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/franklabels.store"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary transition-all duration-300 flex items-center justify-center text-light/80 hover:text-white hover:scale-110"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com/frank_labels"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary transition-all duration-300 flex items-center justify-center text-light/80 hover:text-white hover:scale-110"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@franklabels254"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary transition-all duration-300 flex items-center justify-center text-light/80 hover:text-white hover:scale-110"
                aria-label="TikTok"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
              <a
                href="https://wa.me/254743869564"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary transition-all duration-300 flex items-center justify-center text-light/80 hover:text-white hover:scale-110"
                aria-label="WhatsApp"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-5 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-light/80 hover:text-secondary transition-colors font-body inline-flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-0 group-hover:opacity-100 mr-2 transition-opacity" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-light/80 hover:text-secondary transition-colors font-body inline-flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-0 group-hover:opacity-100 mr-2 transition-opacity" />
                  All Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/officials"
                  className="text-light/80 hover:text-secondary transition-colors font-body inline-flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-0 group-hover:opacity-100 mr-2 transition-opacity" />
                  Officials
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/sneakers"
                  className="text-light/80 hover:text-secondary transition-colors font-body inline-flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-0 group-hover:opacity-100 mr-2 transition-opacity" />
                  Sneakers
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/casuals"
                  className="text-light/80 hover:text-secondary transition-colors font-body inline-flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-0 group-hover:opacity-100 mr-2 transition-opacity" />
                  Casuals
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-light/80 hover:text-secondary transition-colors font-body inline-flex items-center group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-0 group-hover:opacity-100 mr-2 transition-opacity" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-5 uppercase tracking-wide">
              Services
            </h4>
            <ul className="space-y-3">
              <li className="text-light/80 font-body flex items-start">
                <span className="text-secondary mr-2 mt-1">✓</span>
                <span>Quality Original Shoes</span>
              </li>
              <li className="text-light/80 font-body flex items-start">
                <span className="text-secondary mr-2 mt-1">✓</span>
                <span>Free Delivery in Nairobi</span>
              </li>
              <li className="text-light/80 font-body flex items-start">
                <span className="text-secondary mr-2 mt-1">✓</span>
                <span>Custom Designs Available</span>
              </li>
              <li className="text-light/80 font-body flex items-start">
                <span className="text-secondary mr-2 mt-1">✓</span>
                <span>Authentic Brands Only</span>
              </li>
              <li className="text-light/80 font-body flex items-start">
                <span className="text-secondary mr-2 mt-1">✓</span>
                <span>5+ Years Trusted Service</span>
              </li>
              <li className="text-light/80 font-body flex items-start">
                <span className="text-secondary mr-2 mt-1">✓</span>
                <span>Best Sellers & Trending Styles</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-heading font-semibold text-white mb-5 uppercase tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-4 text-light/80 font-body">
              <li className="flex items-start group">
                <svg
                  className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="group-hover:text-white transition-colors">
                  Nairobi CBD, Moi Avenue
                </span>
              </li>
              <li>
                <a
                  href="https://wa.me/254743869564?text=Hello, I'm interested in your products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-secondary transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-secondary mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="group-hover:text-white transition-colors">+254 743 869 564</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/254792264228?text=Hello, I'm interested in your products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-secondary transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-secondary mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="group-hover:text-white transition-colors">+254 792 264 228</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:nelsonochieng516@gmail.com"
                  className="flex items-start hover:text-secondary transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="break-words group-hover:text-white transition-colors">
                    nelsonochieng516@gmail.com
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-light/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-light/70 font-body text-sm text-center md:text-left">
              Copyright © {currentYear} Trendy Fashion Zone. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-light/70 font-body">
              <Link href="/contact" className="hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:text-secondary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

