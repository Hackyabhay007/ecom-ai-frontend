import React, { useState, useEffect } from "react";
import Navbar from "@/component/header/Navbar";
import ContactBreadCrumb from "@/component/contact-us/ContactBreadCrumb";
import ContactUsForm from "@/component/contact-us/ContactUsForm";
import Footer from "@/component/footer/Footer";
import Loader from "@/component/loader/Loader";
const ContactUsPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); // You can adjust the time (e.g., 1 second)

    return () => clearTimeout(timer); // Clean up the timeout on unmount
  }, []);

  return (
    <>
      {isLoading ? (
        <>
         <Navbar />
        <Loader /> // Show loader while the page is loading
        <Footer /> 
        </>
      ) : (
        <>
          <Navbar />
          <ContactBreadCrumb />
          <ContactUsForm />
          <Footer />
        </>
      )}
    </>
  );
};

export default ContactUsPage;
