import React from "react";
import Container from "react-bootstrap/Container";
import Reveal from "../Reveal";

const Gallery = ({ heading, message, items }) => {
  return (
    <section id="gallery" className="section">
      <Container fluid="lg">
        <Reveal>
          <span className="section-eyebrow">Off Duty</span>
          <h2 className="section-title">{heading}</h2>
          <p className="section-subtitle mb-4">{message}</p>
        </Reveal>
        <div className="gallery-scroll">
          {items.map((item, index) => (
            <div className="gallery-item" key={index}>
              <img src={item.img} alt={item.label} />
              <div className="gallery-caption">
                <h3 className="h6 mb-1">{item.label}</h3>
                <p className="text-secondary mb-0">{item.paragraph}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Gallery;
