const data = {
  name: 'Alex Morgan',
  title: 'Frontend Developer',
  intro: 'I build clean, responsive, and user-friendly web experiences.',
  about:
    'Frontend developer with a passion for creating intuitive and performant web applications. I enjoy turning complex problems into simple, beautiful interfaces, and I always learn new technologies and best practices.',
  skills: [
    'HTML5',
    'CSS3',
    'JavaScript',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Git & GitHub',
  ],
  projects: [
    {
      name: 'Responsive Landing Page',
      desc: 'A single-page marketing site that works on every screen size.',
      link: '#',
    },
    {
      name: 'Bakery website',
      desc: 'A simple bakery website with a menu and contact information.',
      link: 'front/bakery/',
    },
    {
      name: 'Weather Dashboard',
      desc: 'Shows the current weather and a 5-day forecast for a city.',
      link: '#',
    },
  ],
  education: [
    {
      when: '2020 — 2023',
      degree: 'B.Sc. in Computer Science',
      school: 'Technical University of Berlin',
    },
    {
      when: '2023',
      degree: 'Frontend Development Certificate',
      school: 'Online Bootcamp',
    },
  ],
  experience: [
    {
      when: '2023 — Present',
      role: 'Junior Frontend Developer',
      company: 'Example company name',
      desc: 'Developed responsive web interfaces for client projects using React and Tailwind CSS.',
    },
    {
      when: '2022 — 2023',
      role: 'Frontend Intern',
      company: 'Example 2 company name',
      desc: 'Assisted in building and testing modern web applications.',
    },
  ],
  email: 'name.example@example.com',
  location: 'Berlin, Germany',
};

const nav = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Projects', '#projects'],
  ['Education', '#education'],
  ['Contact', '#contact'],
];

export default function App() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="container topbar__inner">
          <span className="brand">{data.name}</span>
          <nav className="nav">
            {nav.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="container">
        <section id="home" className="hero">
          <img
            src="https://randomuser.me/api/portraits/men/42.jpg"
            alt={data.name}
            className="hero__photo"
          />
          <h1>{data.name}</h1>
          <p className="subtitle">{data.title}</p>
          <p>{data.intro}</p>
        </section>

        <section id="about" className="block">
          <h2>About</h2>
          <p>{data.about}</p>
        </section>

        <section id="skills" className="block">
          <h2>Skills</h2>
          <ul className="chips">
            {data.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section id="projects" className="block">
          <h2>Projects</h2>
          <ul className="cards">
            {data.projects.map((p) => (
              <li key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <a href={p.link}>View project</a>
              </li>
            ))}
          </ul>
        </section>

        <section id="education" className="block">
          <h2>Education &amp; Experience</h2>
          <ul className="timeline">
            {data.education.map((e, i) => (
              <li key={i}>
                <span className="when">{e.when}</span>
                <h3>{e.degree}</h3>
                <p>{e.school}</p>
              </li>
            ))}
            {data.experience.map((e, i) => (
              <li key={i}>
                <span className="when">{e.when}</span>
                <h3>{e.role}</h3>
                <p>
                  {e.company} — {e.desc}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="block">
          <h2>Contact</h2>
          <p>
            Email: <a href={`mailto:${data.email}`}>{data.email}</a>
          </p>
          <p>Location: {data.location}</p>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            &copy; {data.name}
          </p>
        </div>
      </footer>
    </div>
  );
}
