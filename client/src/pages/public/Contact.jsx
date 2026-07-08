import React from "react";
import ContactSection from "../../components/sections/ContactSection.jsx";
import SEO from "../../components/common/SEO.jsx";

const Contact = () => {
  return (
    <div className="pt-24 min-h-screen flex flex-col">
      <SEO 
        title="Contact | Rumman Ahmed" 
        description="Get in touch with Rumman Ahmed for collaboration, freelance work, or any inquiries." 
      />
      <div className="flex-grow">
        <ContactSection />
      </div>
    </div>
  );
};

export default Contact;