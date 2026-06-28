import React from "react";
import ContactSection from "../../components/sections/ContactSection.jsx";

const Contact = () => {
  return (
    <div className="pt-24 min-h-screen flex flex-col">
      <div className="flex-grow">
        <ContactSection />
      </div>
    </div>
  );
};

export default Contact;