import React from "react";
import Container from "react-bootstrap/Container";
import Reveal from "../Reveal";

const GetInTouch = ({ heading, message, email }) => {
  return (
    <section id="contact" className="section">
      <Container>
        <Reveal>
          <div className="cta-card">
            <h2 className="section-title">{heading}</h2>
            <p className="section-subtitle mx-auto mb-4">{message}</p>
            <a className="btn-pill btn-pill-primary" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};

export default GetInTouch;
