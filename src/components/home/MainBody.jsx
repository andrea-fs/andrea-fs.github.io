import React, { useRef } from "react";
import Container from "react-bootstrap/Container";
import { motion, useScroll, useTransform } from "framer-motion";

const MainBody = React.forwardRef(
  ({ name, tagline, backgroundImage, icons, resume }, ref) => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
      target: heroRef,
      offset: ["start start", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    return (
      <section id="home" ref={heroRef} className="hero">
        <motion.div
          className="hero-bg"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            y,
          }}
        />
        <div className="hero-overlay" />
        <Container className="hero-content">
          <motion.h1
            ref={ref}
            className="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {name}
          </motion.h1>
          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            {tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <a href="#contact" className="btn-pill btn-pill-primary me-3">
              Get in touch
            </a>
            <a
              href={resume}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-pill btn-pill-outline"
            >
              Download CV
            </a>
            <div className="mt-4">
              {icons.map((icon, index) => (
                <a
                  key={`social-icon-${index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={icon.url}
                  aria-label={`My ${icon.image.split("-")[1]}`}
                >
                  <i className={`fab ${icon.image} fa-2x socialicons`} />
                </a>
              ))}
            </div>
          </motion.div>
        </Container>
        <motion.a
          href="#aboutme"
          className="hero-scroll-cue"
          aria-label="Scroll to next section"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <i className="fas fa-chevron-down" />
        </motion.a>
      </section>
    );
  }
);

export default MainBody;
