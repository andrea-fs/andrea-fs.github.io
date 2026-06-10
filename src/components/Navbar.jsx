import React, { useState } from "react";
import { useScrollPosition } from "../hooks/useScrollPosition";
import useResizeObserver from "../hooks/useResizeObserver";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import {
  mainBody,
  about,
  education,
  experiences,
  repos,
  skills,
  getInTouch,
} from "../editable-stuff/config.js";
import { NavLink } from "./home/migration";

const Navigation = React.forwardRef((props, ref) => {
  const [isTop, setIsTop] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navbarMenuRef = React.useRef();
  const navbarDimensions = useResizeObserver(navbarMenuRef);
  const navBottom = navbarDimensions ? navbarDimensions.bottom : 0;
  useScrollPosition(
    ({ prevPos, currPos }) => {
      if (!navbarDimensions) return;
      currPos.y + ref.current.offsetTop - navbarDimensions.bottom > 5
        ? setIsTop(true)
        : setIsTop(false);
      setScrollPosition(currPos.y);
    },
    [navBottom]
  );

  React.useEffect(() => {
    if (!navbarDimensions) return;
    navBottom - scrollPosition >= ref.current.offsetTop
      ? setIsTop(false)
      : setIsTop(true);
  }, [navBottom, navbarDimensions, ref, scrollPosition]);

  return (
    <Navbar
      ref={navbarMenuRef}
      className={`px-3 fixed-top navbar-glass ${
        !isTop ? "navbar-glass-scrolled" : ""
      }`}
      expand="lg"
    >
      <Container fluid="lg">
        <Navbar.Brand
          className="brand"
          href={process.env.PUBLIC_URL + "/#home"}
        >
          {`<${mainBody.firstName} />`}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="toggler" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            {about.show && (
              <NavLink href={process.env.PUBLIC_URL + "/#aboutme"}>
                About
              </NavLink>
            )}
            {education.show && (
              <NavLink href={process.env.PUBLIC_URL + "/#education"}>
                Education
              </NavLink>
            )}
            {experiences.show && (
              <NavLink href={process.env.PUBLIC_URL + "/#experience"}>
                Experience
              </NavLink>
            )}
            {repos.show && (
              <NavLink href={process.env.PUBLIC_URL + "/#projects"}>
                Projects
              </NavLink>
            )}
            {skills.show && (
              <NavLink href={process.env.PUBLIC_URL + "/#skills"}>
                Skills
              </NavLink>
            )}
            {getInTouch.show && (
              <NavLink href={process.env.PUBLIC_URL + "/#contact"}>
                Contact
              </NavLink>
            )}
            <Nav.Link
              className="ms-lg-3 mt-2 mt-lg-0"
              href={about.resume}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="btn-pill btn-pill-primary">Resume</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default Navigation;
