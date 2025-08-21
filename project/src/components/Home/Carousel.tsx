import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel: React.FC = () => {
  const { cmsContent } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselContent = cmsContent.filter(c => c.type === 'carousel' && c.isActive);

  useEffect(() => {
    if (carouselContent.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [carouselContent.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselContent.length) % carouselContent.length);
  };

  if (carouselContent.length === 0) {
    return null;
  }

  return (
    <section className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
      {carouselContent.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="relative h-full">
            {slide.images && slide.images[0] && (
              <img
                src={slide.images[0]}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {carouselContent.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {carouselContent.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Carousel;