import React from 'react';
import { Palette, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className=" text-white py-12" style={{backgroundColor: '#7F55B1'}}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
               <img
      src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755159745/ARTGRAM_LOGO_zdhftc.png"
      alt="ArtGram Logo"
      className="h-20 w-auto pt-3"
    />
              <span className="text-xl font-bold">Artgram</span>
            </div>
            <p className="text-white-400">
              Inspiring creativity through hands-on crafting experiences and premium supplies.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-white-400">
              <li><a href="#" className="hover:text-white-700 transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-white-700 transition-colors">Shop DIY kits</a></li>
              <li><a href="#" className="hover:text-white-700 transition-colors">Events</a></li>
              <li><a href="#" className="hover:text--700 transition-colors">Contact us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-white-400">
                <li><Link to="/privacy-policy" className="hover:text-white-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:text-white-500 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/shipping-policy" className="hover:text-white-500 transition-colors">Shipping Policy</Link></li>
                <li><Link to="/refund-policy" className="hover:text-white-500 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-white-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 96868 46100</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>artgram.yourhobbylobby@gmail.com</span>
              </div>
              
            </div>
          </div>
          
           
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-white-400">
          <p>&copy; 2025 Artgram. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;