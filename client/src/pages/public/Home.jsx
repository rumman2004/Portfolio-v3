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

const Home = () => {
  return (
    <div>
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
