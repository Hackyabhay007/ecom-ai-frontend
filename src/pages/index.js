import { useEffect, useState } from 'react';
import Loader from '@/component/loader/Loader';
import Best_seller from "@/component/bestSeller/Best_seller";
import Footer from "@/component/footer/Footer";
import Collection from "@/component/collection/Collection";
import Gallery from "@/component/gallery/Gallery";
import Gallery2 from "@/component/gallery/Gallery2";
import Navbar from "@/component/header/Navbar";
import Hero from "@/component/hero_section/Hero";
import Review from "@/component/review/Review";
import Service from "@/component/services/Service";
import Category from "@/component/category/Category";


export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.fade-up, .scale-in, .slide-in-left').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="parallax-section" style={{ display: loading ? 'none' : 'block' }}>
        <div className="parallax-layer">
          <Navbar />
          <div className="parallax-background">
            <Hero />
          </div>
          <div className="parallax-content">
            <div className="fade-up">
              <Category />
            </div>
            <div className="slide-in-left">
              <Gallery />
            </div>
            <div className="scale-in">
              <Gallery2 />
            </div>
            <div className="fade-up">
              <Best_seller />
            </div>
            <Review />
            <div className="slide-in-left">
              <Service />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
