// Navigation Bar SECTION
const navBar = {
  show: true,
};

// Main Body / Hero SECTION
const mainBody = {
  firstName: "Andrea",
  middleName: "",
  lastName: "Fossà",
  tagline:
    "MS Student in Artificial Intelligence at the University of Bologna — building intelligent systems at the intersection of AI, neuroscience and bioinformatics.",
  backgroundImage:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2000&q=80",
  icons: [
    {
      image: "fa-github",
      url: "https://github.com/andrea-fs",
    },
    {
      image: "fa-instagram",
      url: "https://www.instagram.com/andrea.xerf/",
    },
    {
      image: "fa-linkedin",
      url: "https://www.linkedin.com/in/andreafossa1801",
    },
  ],
};

// ABOUT SECTION
const about = {
  show: true,
  heading: "About Me",
  imageLink: require("../editable-stuff/profile.png"),
  imageSize: 375,
  message:
    "I'm an MS student in Artificial Intelligence at the University of Bologna, with a background in Bioinformatics from the University of Verona. My work sits at the intersection of deep learning, neuroscience and biological data — from EEG-based brain-computer interfaces to genomics and medical imaging. I'm currently working as a Consultant at Reply, after research internships at Fondazione Bruno Kessler (E3DA Lab) and BraiNavLab. Based in Roncà, Italy, I'm always curious about how AI can be applied responsibly to real-world, human-centered problems.",
  resume: require("../editable-stuff/resume.pdf"),
};

// EDUCATION SECTION
const education = {
  show: true,
  heading: "Education",
  data: [
    {
      degree: "MS in Artificial Intelligence",
      institution: "University of Bologna",
      location: "Bologna, Italy",
      date: "Sept 2023 – Mar 2026",
      description:
        "Coursework in AI for Medicine (NER, Gene Ontology, Clinical Data), Natural Language Processing (LLMs, Transformers), Deep Learning, Computer Vision, and Knowledge Representation & Reasoning (Ontologies, Semantic Web). Thesis on applying deep learning models to biological data integration and analysis. GPA: 106/110.",
    },
    {
      degree: "BS in Bioinformatics",
      institution: "University of Verona",
      location: "Verona, Italy",
      date: "Sept 2020 – Jul 2023",
      description:
        "Computer Science track (L-31) with a focus on bioinformatics methods, tools and biological data analysis. GPA: 107/110.",
    },
  ],
};

// PROJECTS SECTION
// "featured" are curated projects from the CV, shown as cards with imagery.
// The live GitHub grid below fetches the most recently updated repos automatically.
const repos = {
  show: true,
  heading: "Recent Projects",
  gitHubUsername: "andrea-fs",
  reposLength: 4,
  specificRepos: [],
  featured: [
    {
      title: "Explicit Modelling of Subject Dependency in BCI Decoding",
      description:
        "Deep learning models for EEG signal processing in PyTorch, explicitly modelling subject-to-subject variability in brain-computer interface decoding. Published on ArXiv.",
      tags: ["PyTorch", "EEG", "BCI", "Deep Learning"],
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
      link: "https://github.com/andrea-fs", // TODO: replace with the ArXiv / repo link
    },
    {
      title: "Advanced NLP Pipeline for Unstructured Text Analysis",
      description:
        "End-to-end NLP pipeline using Transformers (BERT/RoBERTa) and LLMs for semantic analysis and classification of noisy, unstructured text — including data cleaning, tokenization, preprocessing and fine-tuning for information extraction.",
      tags: ["NLP", "Transformers", "BERT", "LLMs"],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      link: "https://github.com/andrea-fs", // TODO: replace with the repo link
    },
    {
      title: "AI for Medicine: Diagnostic & Genomics Analysis",
      description:
        "Machine learning algorithms for medical imaging and genomic sequence analysis, integrating heterogeneous biological datasets.",
      tags: ["Medical Imaging", "Genomics", "Machine Learning"],
      image:
        "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80",
      link: "https://github.com/andrea-fs", // TODO: replace with the repo link
    },
    {
      title: "Multi-Modal Walkable Population Prediction",
      description:
        "Predicting walkable population density by fusing satellite imagery with OpenStreetMap data in a multi-modal deep learning model.",
      tags: ["Satellite Imagery", "OSM", "Deep Learning"],
      image:
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      link: "https://github.com/andrea-fs", // TODO: replace with the repo link
    },
    {
      title: "Semantic Segmentation of OOD Objects for AV Navigation",
      description:
        "Semantic segmentation pipeline focused on detecting out-of-distribution objects to improve safety in autonomous vehicle navigation.",
      tags: ["Computer Vision", "Segmentation", "Autonomous Vehicles"],
      image:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
      link: "https://github.com/andrea-fs", // TODO: replace with the repo link
    },
    {
      title: "Satellite Image Semantic Segmentation",
      description:
        "Semantic segmentation of satellite imagery to classify land cover and urban features at scale.",
      tags: ["Satellite Imagery", "Segmentation", "Computer Vision"],
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
      link: "https://github.com/andrea-fs", // TODO: replace with the repo link
    },
    {
      title: "From Scratch AI — Detecting Objects: Classic & NN",
      description:
        "Object detection implemented from scratch, comparing classical computer vision approaches against neural-network-based methods.",
      tags: ["Computer Vision", "From Scratch", "Object Detection"],
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      link: "https://github.com/andrea-fs", // TODO: replace with the repo link
    },
    {
      title: "Multi-Courier Planning — Combinatorial Optimization",
      description:
        "Combinatorial decision making and optimization models for the multiple courier planning problem.",
      tags: ["Optimization", "Combinatorial Decision Making"],
      image:
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
      link: "https://github.com/andrea-fs", // TODO: replace with the repo link
    },
  ],
};

// SKILLS SECTION
const skills = {
  show: true,
  heading: "Skills",
  categories: [
    {
      name: "Languages",
      items: ["Python", "C", "Java", "Matlab", "R"],
    },
    {
      name: "AI / ML & Data",
      items: [
        "PyTorch",
        "TensorFlow",
        "Scikit-learn",
        "OpenCV",
        "HuggingFace",
        "Spacy",
        "Z3Py",
      ],
    },
    {
      name: "Platforms & Tools",
      items: ["Docker", "AWS", "Azure", "CUDA", "SQL", "Git", "Linux"],
    },
    {
      name: "Bioinformatics",
      items: [
        "UniProt",
        "PDB",
        "BLAST",
        "ClustalOmega",
        "ITK-SNAP",
        "ChEMBL/PubChem",
        "Biomedical Ontologies",
      ],
    },
  ],
};

// LANGUAGES & SOFT SKILLS SECTION
const languagesAndSoft = {
  show: true,
  heading: "Languages & Soft Skills",
  languages: [
    { name: "Italian", level: "Native" },
    { name: "English", level: "Fluent" },
  ],
  softSkills: [
    "Cross-cultural communication",
    "Sustainable development mindset",
    "Strategic problem solving & creativity",
  ],
};

// GALLERY SECTION ("Beyond the code")
const gallery = {
  show: true,
  heading: "Beyond the Code",
  message: "A few glimpses of life outside research and code.",
  items: [
    {
      img: require("../editable-stuff/algo.png"),
      label: "Focus mode",
      paragraph:
        "Working through algorithms outdoors — laptop, headphones and a good book nearby.",
    },
    {
      img: require("../editable-stuff/calcio.png"),
      label: "On the pitch",
      paragraph:
        "Playing football — teamwork and strategy off the screen too.",
    },
    {
      img: require("../editable-stuff/museum.png"),
      label: "Curiosity beyond tech",
      paragraph:
        "Exploring art and museums — a different kind of pattern recognition.",
    },
  ],
};

// GET IN TOUCH SECTION
const getInTouch = {
  show: true,
  heading: "Get In Touch",
  message:
    "I'm currently looking for full-time AI Engineering or Machine Learning opportunities! If you know of any positions available, if you have any questions, or if you just want to say hi, please feel free to email me at",
  email: "andrea.fossa1801@gmail.com",
};

// EXPERIENCE SECTION
const experiences = {
  show: true,
  heading: "Experience",
  data: [
    {
      role: "Consultant",
      company: "Reply SPA",
      location: "Padova, Italy",
      date: "Apr 2026 – Present",
      description:
        "Working as a technology consultant, contributing to AI-driven projects and software engineering solutions for enterprise clients.",
    },
    {
      role: "AI Research Intern",
      company: "Fondazione Bruno Kessler — E3DA Lab",
      location: "Trento, Italy",
      date: "Mar 2025 – Sep 2025",
      description:
        "Worked on processing biosignals (EEG) with deep learning techniques on edge devices, within the Energy Efficient Embedded Digital Architectures (E3DA) research unit.",
    },
    {
      role: "BCI Research Intern",
      company: "BraiNavLab",
      location: "Verona, Italy",
      date: "Mar 2023 – Jul 2023",
      description:
        "Developed a passive Brain-Computer Interface for assessing mental workload.",
    },
    {
      role: "Stage",
      company: "Fabbrica Italiana Sintetici",
      location: "Lonigo, Italy",
      date: "May 2018 – Jun 2018",
      description:
        "School-to-work internship in an industrial pharmaceutical manufacturing environment.",
    },
  ],
};

export {
  navBar,
  mainBody,
  about,
  education,
  repos,
  skills,
  languagesAndSoft,
  gallery,
  getInTouch,
  experiences,
};
