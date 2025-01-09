import React from "react";

const CustomerComment = () => (
  <div className="pt-8 bg-[#F7F7F7] p-6 rounded-lg">
    <h2 className="md:text-4xl text-2xl  font-bold">Leave a Comment</h2>
    <form className="py-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Your Name"
          className="border p-2 rounded-lg flex-1"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="border p-2 rounded-lg flex-1"
        />
      </div>
      <textarea
        placeholder="Your Message"
        className="border p-2 rounded-xl w-full mt-4"
      />
      <div className="flex items-center mt-4">
        <input type="checkbox" className="ml-3 mr-2 w-4 h-4" />
        <label>Save my name and email for next time</label>
      </div>
      <button className="border-black border py-2 px-4 rounded-lg mt-4 w-full sm:w-auto">
        Submit Review
      </button>
    </form>
  </div>
);

export default CustomerComment;
