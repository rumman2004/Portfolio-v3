import React, { useEffect } from "react";
import { useMascot } from "../../context/MascotContext";
import HeroSection from "../../components/sections/HeroSection.jsx";
import AboutSection from "../../components/sections/AboutSection.jsx";
import SkillSection from "../../components/sections/SkillSection.jsx";
import EducationSection from "../../components/sections/EducationSection.jsx";
import ExperienceSection from "../../components/sections/ExperienceSection.jsx";
import CertificateSection from "../../components/sections/CertificateSection.jsx";
import ProjectSection from "../../components/sections/ProjectSection.jsx";
import HackathonSection from "../../components/sections/HackathonSection.jsx";
import ContactSection from "../../components/sections/ContactSection.jsx";
import GithubActivity from "../../components/sections/GithubActivity.jsx";
import SEO from "../../components/common/SEO.jsx";

const Home = () => {
  const { notifyMascot } = useMascot();

  useEffect(() => {
    notifyMascot("Welcome to my digital space! Scroll down to see what I've been up to!", "happy");
  }, [notifyMascot]);

  return (
    <div>
      <SEO
        title="Home | Rumman Ahmed"
        description="Portfolio of Rumman Ahmed, showcasing web development projects and skills."
      />
      <HeroSection />
      <AboutSection />
      <SkillSection />
      <GithubActivity />
      <ExperienceSection />
      <EducationSection />
      <CertificateSection />
      <HackathonSection />
      <ProjectSection />
      <ContactSection />
    </div>
  );
};

export default Home;
