/**
 * Project exhibits. Each project hangs in one bay of the colonnade.
 *
 * `draft: true` marks copy (role / challenge / solution) that was written
 * from the short project description and still needs the owner's review.
 * Links are only rendered when present — never invent a URL.
 */
export type Project = {
  slug: string;
  name: string;
  year?: string;
  summary: string;
  description: string;
  role: string;
  stack: string[];
  challenge: string;
  solution: string;
  /** Full-size screenshot for the detail view. */
  image?: string;
  /** Downscaled JPG used as a WebGL texture in the colonnade. */
  texture?: string;
  github?: string;
  live?: string;
  draft?: boolean;
};

export const projects: Project[] = [
  {
    slug: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    summary: "Real-time multiplayer with live spectating and a Minimax opponent.",
    description:
      "Real-time multiplayer Tic-Tac-Toe platform featuring live spectating, robust concurrency control, and a Minimax-powered AI opponent.",
    role: "Full-stack developer — game server, realtime layer, AI opponent and UI.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Minimax"],
    challenge:
      "Two players and any number of spectators act on the same board at once; moves had to stay consistent even when requests raced each other.",
    solution:
      "Moves are validated and applied server-side against a versioned game state, then broadcast to every client, while an unbeatable Minimax search powers single-player mode.",
    image: "/images/projects/tic-tac-toe.png",
    texture: "/images/projects/tex/tic-tac-toe.jpg",
    live: "https://frontend-tic-tac-toe-pi.vercel.app/",
    draft: true,
  },
  {
    slug: "money-tracker",
    name: "Money Tracker",
    summary: "Expense platform that reads bank slips with AI.",
    description:
      "Full-stack expense platform with AI-powered slip scanning for automated logging, interactive dashboard summaries, and dynamic data filtering.",
    role: "Full-stack developer — API, data model, slip-scanning pipeline and dashboard.",
    stack: ["Next.js", "ElysiaJS", "PostgreSQL", "AI OCR"],
    challenge:
      "Manual expense entry is the reason people abandon trackers; slips come in inconsistent formats from many different banks.",
    solution:
      "An AI step extracts amount, date and payee from uploaded slips so a transaction is logged in one action, with filters and summaries built on top.",
    image: "/images/projects/money-tracker.png",
    texture: "/images/projects/tex/money-tracker.jpg",
    live: "https://money-tracker-omega-ten.vercel.app",
    draft: true,
  },
  {
    slug: "restaurant-os",
    name: "Real-time Food Order",
    summary: "Point-of-sale with live tables, menus and checkout.",
    description:
      "Interactive point-of-sale and ordering platform managing real-time table assignments, menu item tracking, and transaction finalization.",
    role: "Full-stack developer — realtime order flow, POS interface and backend.",
    stack: ["Next.js", "ElysiaJS", "WebSocket", "PostgreSQL"],
    challenge:
      "Kitchen, floor staff and cashier all need the same live picture of every table without refreshing.",
    solution:
      "A WebSocket channel pushes table and order state to every screen, while PostgreSQL remains the single source of truth for finalized transactions.",
    image: "/images/projects/restaurant-os.png",
    texture: "/images/projects/tex/restaurant-os.jpg",
    live: "https://frontend-restaurant-six.vercel.app",
    draft: true,
  },
  {
    slug: "tinza",
    name: "Tinza Random Voice Call",
    summary: "Anonymous peer-to-peer voice chat with live matchmaking.",
    description:
      "P2P anonymous voice chat platform featuring real-time WebRTC communication, WebSocket signaling, and a dynamic matchmaking algorithm.",
    role: "Full-stack developer — signaling server, matchmaking and WebRTC client.",
    stack: ["Next.js", "WebRTC", "WebSocket", "ElysiaJS", "PostgreSQL"],
    challenge:
      "Pairing strangers quickly and reliably while keeping audio peer-to-peer, across networks that disagree about NAT.",
    solution:
      "A WebSocket signaling service runs the matchmaking queue and relays offers and ICE candidates, then steps aside so audio flows directly between peers.",
    image: "/images/projects/random-voice.png",
    texture: "/images/projects/tex/random-voice.jpg",
    live: "https://tinza-demo.vercel.app",
    draft: true,
  },
  {
    slug: "baccarat",
    name: "Baccarat Royale",
    summary: "Windows casino simulator with live betting rounds.",
    description:
      "A dynamic Windows desktop casino simulator featuring Baccarat and Tiger-Dragon, complete with virtual betting, live countdowns, and automated payouts.",
    role: "Desktop developer — game rules, round timer and payout engine.",
    stack: ["C#", "Windows", "Desktop UI"],
    challenge:
      "Two different card games share one betting table, timer and wallet, each with its own drawing and payout rules.",
    solution:
      "Game rules are isolated behind a common round lifecycle, so countdown, bet locking and payout run the same way for both games.",
    image: "/images/projects/bacarat.png",
    texture: "/images/projects/tex/bacarat.jpg",
    github: "https://github.com/Jitwisut/Baccarat-windows-app",
    draft: true,
  },
  {
    slug: "aegisface",
    name: "AegisFace AI",
    summary: "Healthcare biometrics with 15-angle face recognition.",
    description:
      "High-security healthcare biometric system using DeepFace for 15-angle facial recognition.",
    role: "ML & backend developer — enrolment flow, recognition pipeline.",
    stack: ["Python", "DeepFace", "TensorFlow / Keras", "OpenCV"],
    challenge:
      "A single frontal photo is easy to fool and fails when patients turn their heads.",
    solution:
      "Enrolment captures fifteen angles per person, and matching runs DeepFace embeddings against the whole set for higher confidence.",
    image: "/images/projects/deepface.png",
    texture: "/images/projects/tex/deepface.jpg",
    github: "https://github.com/Jitwisut/web-deepface",
    draft: true,
  },
  {
    slug: "priya",
    name: "Priya Thai Massage",
    summary: "A quiet, motion-led site and booking flow for a spa in Slovenia.",
    description:
      "Luxury Thai massage sanctuary website with online booking, Resend email notifications, ICS calendar attachments, and immersive motion-driven storytelling — serving a premium spa in Domžale, Slovenia.",
    role: "Designer & developer — art direction, motion, booking flow, email.",
    stack: ["Next.js", "Motion", "Resend", "ICS"],
    challenge:
      "A real business needed a site that feels as calm as the spa itself while still turning visitors into bookings.",
    solution:
      "Slow, restrained motion carries the story; bookings send a Resend confirmation with an ICS attachment so the appointment lands in the client's calendar.",
    image: "/images/projects/priya-thai-massage.png",
    texture: "/images/projects/tex/priya-thai-massage.jpg",
    live: "https://priyathaimassage.com",
    draft: true,
  },
  {
    slug: "askyourdb",
    name: "AskYourDB",
    summary: "Ask a database questions in plain language.",
    description: "AI-powered SQL assistant built with LangChain, FastAPI, and GPT-4o.",
    role: "Backend & AI developer — agent design, API.",
    stack: ["Python", "FastAPI", "LangChain", "OpenAI API"],
    challenge:
      "Non-technical people need answers from data, but generated SQL must stay correct and safe to run.",
    solution:
      "A LangChain agent inspects the schema, drafts SQL with GPT-4o and executes it through a FastAPI service that returns both the query and the answer.",
    image: "/images/projects/askyoudb.png",
    texture: "/images/projects/tex/askyoudb.jpg",
    github: "https://github.com/Jitwisut/AI-Driven-Data-Analytics",
    draft: true,
  },
  {
    slug: "wakaclock",
    name: "Wakaclock",
    summary: "Self-hosted WakaTime replacement that knows AI lines from human ones.",
    description:
      "Self-hosted WakaTime replacement written in Rust. Ditches file-extension guessing for tree-sitter AST detection, streams heartbeats through ClickHouse Materialized Views for zero app-level aggregation, and tracks AI-generated lines vs human keystrokes.",
    role: "Systems developer — Rust agent, ingestion, storage design, desktop app.",
    stack: ["Rust", "ClickHouse", "Axum", "tree-sitter", "Tauri"],
    challenge:
      "Coding-time trackers guess languages from file extensions and can't tell who actually wrote the code anymore.",
    solution:
      "tree-sitter parses the real syntax, heartbeats stream straight into ClickHouse materialized views, and edits are classified as AI-generated or typed by hand.",
    github: "https://github.com/Jitwisut/wakaclock",
    draft: true,
  },
  {
    slug: "payment-detection",
    name: "Notification Payment Detection",
    summary: "PromptPay confirmation without any bank API.",
    description:
      "MVP PromptPay payment gateway that detects payment without bank API access: a Windows agent reads toast notifications and a LINE PC OCR watcher reads bank slip cards, both posting to a Node.js backend that matches pending payment intents and fires an HMAC-signed webhook back to the merchant.",
    role: "Full-stack & systems developer — agents, matching engine, webhooks.",
    stack: ["Node.js", "C# / WPF", "OCR", "PromptPay", "HMAC Webhooks"],
    challenge:
      "Small merchants can't get bank API access, yet still need to know automatically that a transfer has arrived.",
    solution:
      "Desktop agents read bank notifications and slip cards, and the backend matches them to pending intents by exact amount, OCR time order or provider reference before signing a webhook.",
    image: "/images/projects/notification-payment-detection.png",
    texture: "/images/projects/tex/notification-payment-detection.jpg",
    draft: true,
  },
];
