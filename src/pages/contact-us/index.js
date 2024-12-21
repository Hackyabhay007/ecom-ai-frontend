import React from "react";
import ContactBreadCrumb from "@/component/contact-us/ContactBreadCrumb";
import ContactUsForm from "@/component/contact-us/ContactUsForm";
import Navbar from "@/component/header/Navbar";
import Footer from "@/component/footer/Footer";

const ContactUsPage = () => (
  <>
  <Navbar/>
    <ContactBreadCrumb />
    <ContactUsForm />
    <Footer/>
  </>
);

export default ContactUsPage;
