import React from "react";

const ContactUsForm = () => (
  <div className="flex flex-col lg:flex-row justify-center items-start gap-12 w-full container mx-auto px-4 lg:px-6 py-12">
    {/* Left Side: Form */}
    <div className="w-full lg:w-2/3 space-y-4">
      <h3 className="text-3xl pb-2 font-bold">Drop Us a Line</h3>
      <p className="text-sm text-sub-color mb-4">
        Use the form below to get in touch with the sales team.
      </p>

      {/* Input Rows */}
      <div className="flex flex-col lg:flex-row gap-4">
        <input
          type="text"
          placeholder="Your Name*"
          className="w-full lg:w-1/2 py-3 px-4 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Your Email*"
          className="w-full lg:w-1/2 py-3 px-4 border rounded-lg"
        />
      </div>
      <textarea
        placeholder="Your Message*"
        rows={5}
        className="w-full py-3 px-4 border rounded-lg"
      ></textarea>

      {/* Submit Button */}
      <button className="px-6 py-3 bg-theme-blue text-white rounded-lg hover:bg-discount-color hover:text-black transition-all">
        Send Message
      </button>
    </div>

    {/* Right Side: Store Info */}
    <div className="w-full lg:w-1/3 space-y-8">
      {/* Our Store */}
      <div>
        <h3 className="text-lg font-bold">Our Store</h3>
        <div className="mt-2 text-sm text-sub-color">
          <p className="py-2">
            <strong>Address:</strong> 1234 Main Street, <br /> Your City, Your State
          </p>
          <p className="py-2">
            <strong>Phone:</strong> +1 (123) 456-7890
          </p>
          <p className="py-2">
            <strong>Email:</strong> info@yourstore.com
          </p>
        </div>
      </div>

      {/* Open Hours */}
      <div>
        <h3 className="text-lg font-bold">Open Hours</h3>
        <div className="mt-2 text-sm text-sub-color">
          <p className="py-2">
            <strong>Mon-Fri:</strong> 7:30am - 8:00pm PST
          </p>
          <p className="py-2">
            <strong>Saturday:</strong> 8:00am - 6:00pm PST
          </p>
          <p className="py-2">
            <strong>Sunday:</strong> 9:00am - 5:00pm PST
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactUsForm;
