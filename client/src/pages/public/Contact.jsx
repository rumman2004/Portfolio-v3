import React, { useEffect } from "react";
import { useMascot } from "../../context/MascotContext";
import ContactSection from "../../components/sections/ContactSection.jsx";
import SEO from "../../components/common/SEO.jsx";

const Contact = () => {
  const { notifyMascot } = useMascot();

  useEffect(() => {
    notifyMascot("Got a cool idea? Fill out the form and let's build something awesome together!", "hmm");
  }, [notifyMascot]);

  return (
    <div className="pt-24 min-h-screen flex flex-col">
      <SEO
        description="Get in touch with Rumman Ahmed for collaboration, freelance work, or any inquiries."
      />
      <div className="flex-grow">
        <ContactSection />
      </div>
    </div>
  );
};

export default Contact;