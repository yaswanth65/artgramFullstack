import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery: React.FC = () => {
  const { cmsContent } = useData();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Get gallery images from CMS, fallback to default images
  const galleryContent = cmsContent.find(c => c.type === 'gallery' && c.isActive);
  const cmsGalleryImages = galleryContent?.images || [];
  
  const defaultGalleryImages = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg',
      alt: 'Craft Workshop Session',
      category: 'Workshops'
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/6941924/pexels-photo-6941924.jpeg',
      alt: 'Slime Making Class',
      category: 'Slime Classes'
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg',
      alt: 'Art Supplies',
      category: 'Materials'
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
      alt: 'Creative Workshop',
      category: 'Workshops'
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg',
      alt: 'Kids Crafting',
      category: 'Kids Classes'
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
      alt: 'Art Creation',
      category: 'Art Classes'
    }
  ];

  // Combine CMS images with default structure
  const galleryImages = cmsGalleryImages.length > 0 
    ? cmsGalleryImages.map((src, index) => ({
        id: index + 1,
        src,
        alt: `Gallery Image ${index + 1}`,
        category: 'Gallery'
      }))
    : defaultGalleryImages;

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Gallery</h2>
            <p className="text-xl text-gray-600">Explore our creative workshops and happy moments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <p className="font-semibold">{image.alt}</p>
                    <p className="text-sm">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            
            <img
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <p className="font-semibold">{galleryImages[selectedImage].alt}</p>
              <p className="text-sm opacity-75">{galleryImages[selectedImage].category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;