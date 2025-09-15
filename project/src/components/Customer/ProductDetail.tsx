import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useData();
  const { addItem } = useCart();
  const product = products.find(p => p.id === id);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!product) return <div className="p-8 text-center">Product not found</div>;

  const media = product.media && product.media.length > 0 ? product.media : (product.images || []).map(url => ({ url, type: 'image' as const }));
  
  // Check if description is long (more than 200 characters or 3 lines)
  const isLongDescription = (product.description || '').length > 200;
  const truncatedDescription = isLongDescription ? (product.description || '').substring(0, 200) + '...' : (product.description || '');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-gray-600">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column - Image and Description */}
        <div>
          <div className="rounded-2xl overflow-hidden shadow-lg bg-white mb-4">
            <div className="w-full h-72 bg-gray-100 flex items-center justify-center">
              {media[selectedIndex].type === 'video' ? (
                <video controls className="w-full h-full object-cover">
                  <source src={media[selectedIndex].url} />
                </video>
              ) : (
                <img src={media[selectedIndex].url} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3 overflow-x-auto">
            {media.map((m, i) => (
              <button key={i} onClick={() => setSelectedIndex(i)} className={`flex-shrink-0 w-16 h-10 rounded-md overflow-hidden border ${i===selectedIndex ? 'ring-2 ring-orange-400' : 'border-gray-200'}`}>
                {m.type === 'video' ? (
                  <video className="w-full h-full object-cover">
                    <source src={m.url} />
                  </video>
                ) : (
                  <img src={m.url} alt={`${product.name}-${i}`} className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>

          {/* Description moved here */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3">Description</h3>
            <div className="text-gray-700 leading-relaxed">
              {/* Show truncated or full description based on state */}
              {(showFullDescription ? (product.description || '') : truncatedDescription).split(/\n\s*\n/).map((para, pIdx) => (
                <p key={pIdx} className="mb-3">
                  {para.split('\n').map((line, lIdx) => (
                    <React.Fragment key={lIdx}>{lIdx > 0 && <br />}{line}</React.Fragment>
                  ))}
                </p>
              ))}
              
              {/* Show expand/collapse button for long descriptions */}
              {isLongDescription && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm mt-2"
                >
                  {showFullDescription ? (
                    <>Show Less <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>View More <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div>
          <h1 className="text-2xl font-extrabold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-2xl font-bold text-orange-600">₹{product.price}</div>
          </div>

          {/* Common Product Details - Hardcoded for all products */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3">Product Features</h3>
            <ul className="text-gray-700 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                Premium quality materials and craftsmanship
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                Perfect for beginners and craft lovers alike
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                Complete kit with all necessary components
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                Step-by-step instruction guide included
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                Safe and non-toxic materials used
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-2">Materials Included</h4>
            <div className="flex flex-wrap gap-2">
              {(product.materials || []).map((m, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{m}</span>
              ))}
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center bg-white rounded-full border overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-4 py-2">-</button>
              <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-16 text-center border-l border-r px-2 py-2" />
              <button onClick={() => setQty(q => q+1)} className="px-4 py-2">+</button>
            </div>

            <button
              onClick={() => addItem({ id: product.id, title: product.name, price: product.price, image: product.images?.[0] }, qty)}
              className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-3 py-1.5 rounded-md flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
            >
              <ShoppingCart className="h-4 w-4" /> Add {qty} to Cart
            </button>
          </div>

          <div className="text-sm text-gray-500">Free returns within 7 days · Secure payment · Fast delivery</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
