import Best_seller from "@/component/bestSeller/Best_seller";
import Footer from "@/component/bestSeller/footer/Footer";
import Collection from "@/component/collection/Collection";
import Gallery from "@/component/gallery/Gallery";
import Gallery2 from "@/component/gallery/Gallery2";
import Navbar from "@/component/header/Navbar";
import Hero from "@/component/hero_section/Hero";
import Review from "@/component/review/Review";
import Service from "@/component/services/Service";


export default function HomePage() {
  return (
    <>
      <Navbar/>
     <Hero/>
     <Collection/>
     <Gallery/> 
     <Gallery2/>
     <Best_seller/>
     <Review/>
     <Service/>
     <Footer/>
    </>
  );
}
