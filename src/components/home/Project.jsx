import React, { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Reveal from "../Reveal";
import ProjectCard from "./ProjectCard";

const dummyProject = {
  name: null,
  description: null,
  svn_url: null,
  stargazers_count: null,
  languages_url: null,
  pushed_at: null,
};
const API = "https://api.github.com";

const Project = ({ heading, username, length, specfic, featured }) => {
  const allReposAPI = `${API}/users/${username}/repos?sort=updated&direction=desc`;
  const specficReposAPI = `${API}/repos/${username}`;
  const dummyProjectsArr = new Array(length + specfic.length).fill(
    dummyProject
  );

  const [projectsArray, setProjectsArray] = useState([]);

  const fetchRepos = useCallback(async () => {
    let repoList = [];
    try {
      const response = await axios.get(allReposAPI);
      repoList = [...response.data.slice(0, length)];
      try {
        for (let repoName of specfic) {
          const response = await axios.get(`${specficReposAPI}/${repoName}`);
          repoList.push(response.data);
        }
      } catch (error) {
        console.error(error.message);
      }
      setProjectsArray(repoList);
    } catch (error) {
      console.error(error.message);
    }
  }, [allReposAPI, length, specfic, specficReposAPI]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return (
    <section id="projects" className="section-alt">
      <Container>
        <Reveal>
          <span className="section-eyebrow">Work</span>
          <h2 className="section-title">{heading}</h2>
          <p className="section-subtitle mb-5">
            A selection of research projects spanning AI, neuroscience and
            bioinformatics.
          </p>
        </Reveal>
        <Row className="g-4 mb-5">
          {featured.map((project, index) => (
            <Col md={6} lg={4} key={`featured-${index}`}>
              <Reveal delay={(index % 3) * 0.1}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="project-card d-block text-decoration-none text-reset"
                >
                  <img
                    className="project-card-img"
                    src={project.image}
                    alt={project.title}
                  />
                  <div className="project-card-body">
                    <h3 className="h5 mb-2">{project.title}</h3>
                    <p className="text-secondary">{project.description}</p>
                    <div>
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </Reveal>
            </Col>
          ))}
        </Row>

        <Reveal>
          <h3 className="mb-4" style={{ fontWeight: 700 }}>
            Latest from GitHub
          </h3>
        </Reveal>
        <Row className="g-4">
          {projectsArray.length
            ? projectsArray.map((project, index) => (
                <ProjectCard
                  key={`project-card-${index}`}
                  id={`project-card-${index}`}
                  value={project}
                />
              ))
            : dummyProjectsArr.map((project, index) => (
                <ProjectCard
                  key={`dummy-${index}`}
                  id={`dummy-${index}`}
                  value={project}
                />
              ))}
        </Row>
      </Container>
    </section>
  );
};

export default Project;
