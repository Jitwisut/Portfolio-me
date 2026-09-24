/**
 * Everything personal lives here so copy can be edited without touching
 * layout code. Entries flagged `draft: true` were written from what the
 * old site said and still need the owner's review (dates, company names).
 */
export const profile = {
  name: "Jitwisut Thobut",
  first: "Jitwisut",
  last: "Thobut",
  role: "Full-stack developer",
  roleDetail: "& interface designer",
  statement:
    "I build calm, precise software — from the database schema to the last pixel of motion.",
  location: "Rangsit, Pathum Thani",
  coords: "13.96° N — 100.60° E",
  timezone: "Asia/Bangkok",
  email: "tanzajitwisut@gmail.com",
};

export const socials = [
  { label: "GitHub", handle: "@Jitwisut", href: "https://github.com/Jitwisut" },
  {
    label: "LinkedIn",
    handle: "Jitwisut Thobut",
    href: "https://www.linkedin.com/in/jitwisut-thobut-0a0994357/",
  },
  { label: "Instagram", handle: "@txxjit_tb", href: "https://www.instagram.com/txxjit_tb/" },
];

export const about = {
  /** Read by the light band word by word. */
  lead:
    "I'm a Computer Engineering student in Thailand who treats software like architecture: a strong structure, honest materials, and light where people need it.",
  body: [
    "I work across the whole stack with fast, modern tools — Bun, Elysia and Node.js on the server; Next.js, React and Three.js in the browser — and I back what I ship with real test cases.",
    "Outside the editor I practise ethical hacking and competed in Cyber Top Talent. Security is part of how I think about every system I build.",
  ],
  facts: [
    { label: "Based in", value: "Rangsit, Pathum Thani" },
    { label: "Studying", value: "Computer Engineering, Rangsit University" },
    { label: "Focus", value: "Full-stack systems & interface design" },
    { label: "Also", value: "Ethical hacking, realtime systems, AI tooling" },
  ],
};

export type Milestone = {
  when: string;
  title: string;
  place: string;
  text: string;
  draft?: boolean;
};

export const milestones: Milestone[] = [
  {
    when: "Now",
    title: "Computer Engineering",
    place: "Rangsit University",
    text: "Studying systems, networks and software engineering while shipping independent products on the side.",
    draft: true,
  },
  {
    when: "Internship",
    title: "Full-stack developer intern",
    place: "Company — to confirm",
    text: "Building production features end-to-end and learning how real teams review, test and deploy.",
    draft: true,
  },
  {
    when: "Client work",
    title: "Designer & developer",
    place: "Priya Thai Massage, Slovenia",
    text: "Art direction, motion and a booking flow with email and calendar confirmations for a real spa.",
    draft: true,
  },
  {
    when: "Competition",
    title: "Cyber Top Talent",
    place: "National cybersecurity competition",
    text: "Competed in ethical hacking challenges: web exploitation, forensics and reverse engineering under time pressure.",
    draft: true,
  },
  {
    when: "Independent",
    title: "Systems & tools",
    place: "Open source on GitHub",
    text: "Realtime games, WebRTC voice chat, a Rust time tracker and a PromptPay detector — each one built to learn something hard.",
    draft: true,
  },
];

/** Skills written as an architect's schedule of materials. */
export const materials = [
  {
    group: "Structure",
    note: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Rust", "C#"],
  },
  {
    group: "Frame",
    note: "Frameworks & runtimes",
    items: ["Next.js", "React", "Node.js", "Bun", "ElysiaJS", "Express.js", "FastAPI"],
  },
  {
    group: "Foundations",
    note: "Data & infrastructure",
    items: ["PostgreSQL", "MongoDB", "ClickHouse", "Prisma", "Docker", "Firebase", "Vercel", "Git"],
  },
  {
    group: "Finish",
    note: "Interface & motion",
    items: ["Tailwind CSS", "Three.js", "GSAP", "Motion", "Figma", "WebRTC", "WebSocket"],
  },
];
