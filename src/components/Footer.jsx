import React from "react";
import Container from "react-bootstrap/Container";
import { mainBody } from "../editable-stuff/config.js";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer text-center">
      <Container>
        <div className="mb-3">
          {mainBody.icons.map((icon, index) => (
            <a
              key={`footer-social-${index}`}
              target="_blank"
              rel="noopener noreferrer"
              href={icon.url}
              aria-label={`My ${icon.image.split("-")[1]}`}
            >
              <i className={`fab ${icon.image} fa-lg socialicons`} />
            </a>
          ))}
        </div>
        <p className="mb-1">
          © {year} {mainBody.firstName} {mainBody.lastName}
        </p>
        <p className="mb-0">
          <small>
            Built with React. Project code is open source — feel free to fork
            and make your own version.
          </small>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
