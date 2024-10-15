// Navigation Bar SECTION
const navBar = {
  show: true,
};

// Main Body SECTION
const mainBody = {
  gradientColors: "#4484ce, #1ad7c0, #ff9b11, #9b59b6, #ff7f7f, #ecf0f1",
  firstName: "Andrea",
  middleName: "",
  lastName: "Fossà",
  message: " Student in Artificial Intelligence ",
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
      url: "https://www.linkedin.com/in/andreafossa1801/",
    },
  ],
};

// ABOUT SECTION
// If you want the About Section to show a profile picture you can fill the profilePictureLink either with:
//a) your Instagram username
//      i.e:profilePictureLink:"johnDoe123",
//b) a link to an hosted image
//      i.e:profilePictureLink:"www.picturesonline.com/johnDoeFancyAvatar.jpg",
//c) image in "editable-stuff" directory and use require("") to import here,
//      i.e: profilePictureLink: require("../editable-stuff/hashirshoaeb.png"),
//d) If you do not want any picture to be displayed, just leave it empty :)
//      i.e: profilePictureLink: "",
// For Resume either provide link to your resume or import from "editable-stuff" directory
//     i.e resume: require("../editable-stuff/resume.pdf"),
//         resume: "https://docs.google.com/document/d/13_PWdhThMr6roxb-UFiJj4YAFOj8e_bv3Vx9UHQdyBQ/edit?usp=sharing",

const about = {
  show: true,
  heading: "About Me",
  imageLink: require("../editable-stuff/profilepng.png"),
  imageSize: 305,
  message:
    "My name is Andrea Fossà. I will be a graduate in 2025 from University of Bologna in Italy with a masters degree in Artificial Intelligence.",
  resume: process.env.PUBLIC_URL + "/resume.pdf",
  secondResume: process.env.PUBLIC_URL + "/secondResume.pdf",
};

// PROJECTS SECTION
// Setting up project length will automatically fetch your that number of recently updated projects, or you can set this field 0 to show none.
//      i.e: reposLength: 0,
// If you want to display specfic projects, add the repository names,
//      i.e ["repository-1", "repo-2"]
const repos = {
  show: true,
  heading: "Recent Projects",
  gitHubUsername: "andrea-fs", //i.e."johnDoe12Gh"
  reposLength: 4,
  specificRepos: [],
};

// Leadership SECTION
const leadership = {
  show: true,
  heading: "Frequently Asked Questions",
  message:
  `What are you looking for?
A: I am actively seeking internship opportunities in the field of
Artificial Intelligence to gain practical experience and enhance my skills. 
_____________________________________________________________
Where are you located, and are you willing to relocate?
A: I am currently based in Italy, but I am open to relocating for the right
opportunities, including internships and job offers
_____________________________________________________________
What is your educational background?
A: I am pursuing a master’s degree in Artificial Intelligence at the University of Bologna,
 expected to graduate in 2025. I also hold a bachelor’s degree in Bioinformatics from the University of Verona,
 where I developed a passive brain-computer interface (BCI) system for cognitive workload assessment.
_____________________________________________________________
What are your main areas of expertise?
A: I have worked on several AI projects, including semantic segmentation of satellite images,
 object detection, and optimizing courier planning problems with combinatorial decision-making techniques.
 My bioinformatics projects include developing a passive BCI system to assess cognitive workload.
_____________________________________________________________
How do you stay up-to-date in the field? A:
I stay current by regularly reading scientific papers, actively working on coding projects,
 and engaging in discussions with peers and also professors.
 This helps me maintain a broad and deep understanding of both cutting-edge research and practical applications.
`,
  images: [
    { 
      img: require("../editable-stuff/museum.png"), 
      label: "Hobby", 
      paragraph: "I love to visit mueum, like this one: ... " 
    },
    { 
      img: require("../editable-stuff/lib.png"), 
      label: "Studing", 
      paragraph: "A really cool library 😊" 
    },
    { 
      img: require("../editable-stuff/calcio.png"), 
      label: "Football", 
      paragraph: "I was full immersed 🙈 " 
    },
  ],
  imageSize: {
    width:"115",
    height:"750"
  }
};

// SKILLS SECTION
const skills = {
  show: true,
  heading: "Skills",
  hardSkills: [
    { name: "English", value: 'B2' },
    { name: "Italian", value: 'Native' },
    { name: "Coding", value: "Python, C, MatLab, Constraint Programming, PyTorch, TensorFlow" },
    { name: "Bioinformatics", value: "EEGLab, Bioinformatics Tools and Databases (UniProt, Protparam, PDB, Clustal Omega, BLAST), AlphaFold" },
    { name: "Promote communication between people with different cultural backgrounds", value: "rk8OF-XJS3WniWiuwgf_Cg"},
    { name: "Objective: Sustainable Development", value: "IlLBMjcoSB2IVUTx-A7lJg"},
    { name: "Strategic problem solving patterns for better creativity", value: "fP1eQwjnTru_mZ_QFhOJ5Q"},
  ],
};

// GET IN TOUCH SECTION
const getInTouch = {
  show: true,
  heading: "Get In Touch",
  message:
    "I'm currently looking for full-time Artificial Intelligence opportunities! If you know of any positions available, if you have any questions, or if you just want to say hi, please feel free to email me at",
  email: "andrea.fossa1801@gmail.com",
};

const experiences = {
  show: true,
  heading: "Experiences",
  data: [
    {
      role: 'BCI Research Intern',
      companylogo: require('../assets/img/bnl.png'),
      date: 'March 2023 – July 2023',
    },
    {
      role: 'Bachelor students at University of Verona',
      companylogo: require('../assets/img/univr.png'),
      date: 'September 2020 – July 2023',
    },
    {
      role: 'Stage at Fabbrica Italaina Sintetici F.I.S.',
      companylogo: require('../assets/img/fis.png'),
      date: 'May 2018 – June 2018',
    },
    {
      role: 'Labourer at Collis Wine Group',
      companylogo: require('../assets/img/collis.png'),
      date: 'August 2022 – October 2022',
    },
    {
      role: 'Labourer at Albiero SRL',
      companylogo: require('../assets/img/albiero.png'),
      date: 'August 2020 – October 2020',
    },
    {
      role: 'Football Player in First Team',
      companylogo: require('../assets/img/real.png'),
      date: 'Since elementary school :) – June 2022',
    },
  ]
}

// Blog SECTION
const blog = {
  show: false,
  heading: "Blog",
};


export { navBar, mainBody, about, repos, skills, leadership, getInTouch, experiences, blog };
