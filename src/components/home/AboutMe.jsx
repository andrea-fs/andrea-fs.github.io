import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Reveal from "../Reveal";

const AboutMe = ({ heading, message, image, resume }) => {
  return (
    <section id="aboutme" className="section">
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={5} className="text-center">
            <Reveal>
              <img
                className="rounded-circle"
                src={image}
                alt="Andrea Fossà"
                style={{
                  width: "100%",
                  maxWidth: "320px",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                }}
              />
            </Reveal>
          </Col>
          <Col lg={7}>
            <Reveal delay={0.1}>
              <span className="section-eyebrow">{heading}</span>
              <h2 className="section-title">Hi, I'm Andrea.</h2>
              <p className="lead text-secondary mb-4">{message}</p>
              {resume && (
                <a
                  className="btn-pill btn-pill-primary"
                  href={resume}
                  target="_blank"
                  rel="noreferrer noopener"
                  role="button"
                  aria-label="Download Resume"
                >
                  Download Resume
                </a>
              )}
            </Reveal>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutMe;
