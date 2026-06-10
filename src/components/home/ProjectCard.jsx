import React, { useState, useEffect, useCallback } from "react";
import Col from "react-bootstrap/Col";
import Skeleton from "react-loading-skeleton";
import axios from "axios";

const ProjectCard = ({ value }) => {
  const {
    name,
    description,
    svn_url,
    stargazers_count,
    languages_url,
    pushed_at,
  } = value;
  return (
    <Col md={6} lg={4}>
      <div className="project-card project-card-body h-100 d-flex flex-column">
        <h3 className="h5 mb-2">{name || <Skeleton />}</h3>
        <p className="text-secondary flex-grow-1">
          {!description ? "" : description || <Skeleton count={3} />}
        </p>
        {svn_url ? <CardButtons svn_url={svn_url} /> : <Skeleton count={2} />}
        <hr />
        {languages_url ? (
          <Language languages_url={languages_url} repo_url={svn_url} />
        ) : (
          <Skeleton count={3} />
        )}
        {value ? (
          <CardFooter
            star_count={stargazers_count}
            repo_url={svn_url}
            pushed_at={pushed_at}
          />
        ) : (
          <Skeleton />
        )}
      </div>
    </Col>
  );
};

const CardButtons = ({ svn_url }) => {
  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      <a
        href={`${svn_url}/archive/master.zip`}
        className="btn-pill btn-pill-light"
      >
        <i className="fab fa-github" /> Clone
      </a>
      <a
        href={svn_url}
        target="_blank"
        rel="noreferrer noopener"
        className="btn-pill btn-pill-outline-dark"
      >
        Repo
      </a>
    </div>
  );
};

const Language = ({ languages_url, repo_url }) => {
  const [data, setData] = useState([]);

  const handleRequest = useCallback(async () => {
    try {
      const response = await axios.get(languages_url);
      return setData(response.data);
    } catch (error) {
      console.error(error.message);
    }
  }, [languages_url]);

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

  const array = [];
  let total_count = 0;
  for (let index in data) {
    array.push(index);
    total_count += data[index];
  }

  return (
    <div className="pb-3">
      {array.length
        ? array.map((language) => (
            <a
              key={language}
              href={repo_url + `/search?l=${language}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <span className="tag-pill">
                {language}{" "}
                {Math.trunc((data[language] / total_count) * 1000) / 10}%
              </span>
            </a>
          ))
        : "Code yet to be deployed."}
    </div>
  );
};

const CardFooter = ({ star_count, repo_url, pushed_at }) => {
  const [updated_at, setUpdated_at] = useState("0 mins");

  const handleUpdatetime = useCallback(() => {
    const date = new Date(pushed_at);
    const nowdate = new Date();
    const diff = nowdate.getTime() - date.getTime();
    const hours = Math.trunc(diff / 1000 / 60 / 60);

    if (hours < 24) {
      if (hours < 1) return setUpdated_at("just now");
      let measurement = hours === 1 ? "hour" : "hours";
      return setUpdated_at(`${hours.toString()} ${measurement} ago`);
    } else {
      const options = { day: "numeric", month: "long", year: "numeric" };
      const time = new Intl.DateTimeFormat("en-US", options).format(date);
      return setUpdated_at(`on ${time}`);
    }
  }, [pushed_at]);

  useEffect(() => {
    handleUpdatetime();
  }, [handleUpdatetime]);

  return (
    <div className="d-flex justify-content-between align-items-center mt-2">
      <a
        href={repo_url + "/stargazers"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-reset text-decoration-none"
      >
        <i className="fab fa-github" /> <strong>{star_count}</strong> stars
      </a>
      <small className="text-secondary">Updated {updated_at}</small>
    </div>
  );
};

export default ProjectCard;
