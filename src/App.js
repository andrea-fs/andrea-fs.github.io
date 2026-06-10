import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  navBar,
  mainBody,
  about,
  education,
  repos,
  skills,
  languagesAndSoft,
  gallery,
  getInTouch,
  experiences,
} from "./editable-stuff/config.js";
import MainBody from "./components/home/MainBody";
import AboutMe from "./components/home/AboutMe";
import Education from "./components/home/Education";
import Experience from "./components/home/Experience";
import Project from "./components/home/Project";
import Skills from "./components/home/Skills";
import Gallery from "./components/home/Gallery";
import GetInTouch from "./components/home/GetInTouch.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const Home = React.forwardRef((props, ref) => {
  return (
    <>
      <MainBody
        name={`${mainBody.firstName} ${mainBody.middleName} ${mainBody.lastName}`}
        tagline={mainBody.tagline}
        backgroundImage={mainBody.backgroundImage}
        icons={mainBody.icons}
        resume={about.resume}
        ref={ref}
      />
      {about.show && (
        <AboutMe
          heading={about.heading}
          message={about.message}
          image={about.imageLink}
          resume={about.resume}
        />
      )}
      {education.show && (
        <Education heading={education.heading} data={education.data} />
      )}
      {experiences.show && (
        <Experience heading={experiences.heading} data={experiences.data} />
      )}
      {repos.show && (
        <Project
          heading={repos.heading}
          username={repos.gitHubUsername}
          length={repos.reposLength}
          specfic={repos.specificRepos}
          featured={repos.featured}
        />
      )}
      {skills.show && (
        <Skills
          heading={skills.heading}
          categories={skills.categories}
          languagesAndSoft={languagesAndSoft.show ? languagesAndSoft : null}
        />
      )}
      {gallery.show && (
        <Gallery
          heading={gallery.heading}
          message={gallery.message}
          items={gallery.items}
        />
      )}
      {getInTouch.show && (
        <GetInTouch
          heading={getInTouch.heading}
          message={getInTouch.message}
          email={getInTouch.email}
        />
      )}
    </>
  );
});

const App = () => {
  const titleRef = React.useRef();

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL + "/"}>
      {navBar.show && <Navbar ref={titleRef} />}
      <Routes>
        <Route path="/" exact element={<Home ref={titleRef} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
