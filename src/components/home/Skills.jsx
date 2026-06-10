import React from "react";
import Container from "react-bootstrap/Container";
import Reveal from "../Reveal";

const Skills = ({ heading, categories, languagesAndSoft }) => {
  return (
    <section id="skills" className="section-alt">
      <Container>
        <Reveal>
          <span className="section-eyebrow">Toolbox</span>
          <h2 className="section-title">{heading}</h2>
        </Reveal>
        <div className="mt-5">
          {categories.map((category, index) => (
            <Reveal key={category.name} delay={index * 0.05} className="mb-4">
              <h3 className="h6 text-uppercase text-secondary mb-3">
                {category.name}
              </h3>
              <div>
                {category.items.map((item) => (
                  <span key={item} className="tag-pill">
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}

          {languagesAndSoft && (
            <Reveal delay={categories.length * 0.05} className="mb-4">
              <h3 className="h6 text-uppercase text-secondary mb-3">
                Languages
              </h3>
              <div>
                {languagesAndSoft.languages.map((lang) => (
                  <span key={lang.name} className="tag-pill">
                    {lang.name} · {lang.level}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          {languagesAndSoft && (
            <Reveal delay={(categories.length + 1) * 0.05}>
              <h3 className="h6 text-uppercase text-secondary mb-3">
                Soft Skills
              </h3>
              <div>
                {languagesAndSoft.softSkills.map((item) => (
                  <span key={item} className="tag-pill">
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Skills;
