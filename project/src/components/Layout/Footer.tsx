import React from 'react';
import { Palette, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold">Craft Factory</span>
            </div>
            <p className="text-gray-400">
              Inspiring creativity through hands-on crafting experiences and premium supplies.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Classes</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Store</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">About</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Branches</h3>
            <div className="space-y-4 text-gray-400">
              <div>
                <h4 className="font-medium text-white">Pune</h4>
                <p className="text-sm">123 MG Road, Pune</p>
              </div>
              <div>
                <h4 className="font-medium text-white">Mumbai</h4>
                <p className="text-sm">456 Marine Drive, Mumbai</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@craftfactory.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Multiple locations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Craft Factory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;