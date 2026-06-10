import React from "react";
import Container from "react-bootstrap/Container";
import Reveal from "../Reveal";

const Experience = ({ heading, data }) => {
  return (
    <section id="experience" className="section">
      <Container>
        <Reveal>
          <span className="section-eyebrow">Career</span>
          <h2 className="section-title">{heading}</h2>
        </Reveal>
        <div className="timeline mt-5">
          {data.map((item, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="timeline-item">
                <span className="timeline-date">{item.date}</span>
                <h3 className="timeline-title">{item.role}</h3>
                <p className="timeline-subtitle">
                  {item.company}, {item.location}
                </p>
                <p className="text-secondary mb-0">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Experience;
