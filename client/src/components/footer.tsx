import { Link } from 'wouter';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-hoverBg pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-secondary text-2xl font-bold">Movie<span className="text-white">Hub</span></span>
            </Link>
            <p className="text-textSecondary mb-4">Your ultimate destination for movies and TV shows.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary transition-colors duration-200">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors duration-200">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors duration-200">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-textSecondary hover:text-secondary transition-colors duration-200">Home</Link></li>
              <li><Link href="/movies" className="text-textSecondary hover:text-secondary transition-colors duration-200">Movies</Link></li>
              <li><Link href="/tv" className="text-textSecondary hover:text-secondary transition-colors duration-200">TV Shows</Link></li>
              <li><Link href="/movies?sort=trending" className="text-textSecondary hover:text-secondary transition-colors duration-200">Trending</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/movies?genre=28" className="text-textSecondary hover:text-secondary transition-colors duration-200">Action</Link></li>
              <li><Link href="/movies?genre=35" className="text-textSecondary hover:text-secondary transition-colors duration-200">Comedy</Link></li>
              <li><Link href="/movies?genre=18" className="text-textSecondary hover:text-secondary transition-colors duration-200">Drama</Link></li>
              <li><Link href="/movies?genre=27" className="text-textSecondary hover:text-secondary transition-colors duration-200">Horror</Link></li>
              <li><Link href="/movies?genre=878" className="text-textSecondary hover:text-secondary transition-colors duration-200">Sci-Fi</Link></li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-textSecondary hover:text-secondary transition-colors duration-200">FAQ</a></li>
              <li><a href="#" className="text-textSecondary hover:text-secondary transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-textSecondary hover:text-secondary transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-textSecondary hover:text-secondary transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-textSecondary hover:text-secondary transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-textSecondary text-sm mb-4 md:mb-0">© {new Date().getFullYear()} MovieHub. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-textSecondary hover:text-secondary transition-colors duration-200 text-sm">Terms</a>
              <a href="#" className="text-textSecondary hover:text-secondary transition-colors duration-200 text-sm">Privacy</a>
              <a href="#" className="text-textSecondary hover:text-secondary transition-colors duration-200 text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
