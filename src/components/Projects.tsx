'use client';

import ScrollReveal from './ScrollReveal';

const projects = [
    {
        name: 'Tic-Tac-Toe',
        desc: 'Real-time multiplayer Tic-Tac-Toe platform featuring live spectating, robust concurrency control, and a Minimax-powered AI opponent.',
        tags: ['Next.js', 'MiniMax', 'PostgreSQL', 'Nodejs'],
        url: 'https://frontend-tic-tac-toe-pi.vercel.app/',
        color: '#ef4444',
        emoji: '❌⭕',
    },
    {
        name: 'Money-Tracker',
        desc: 'Full-stack expense tracking platform featuring interactive dashboard summaries, dynamic categorization, and advanced date filtering.',
        tags: ['Next.js', 'ElysiaJS', 'PostgreSQL'],
        url: 'https://money-tracker-omega-ten.vercel.app',
        color: '#22c55e',
        emoji: '🌿',
    },
    {
        name: 'Real-time-food-order',
        desc: 'Interactive point-of-sale and ordering platform managing real-time table assignments, menu item tracking, and transaction finalization.',
        tags: ['Next.js', 'ElysiaJS', 'Websocket', 'PostgreSQL'],
        url: 'https://frontend-restaurant-six.vercel.app',
        color: '#8b5cf6',
        emoji: '🧩',
    },
    {
        name: 'Tinza-Ramdon-VoiceCall',
        desc: 'P2P anonymous voice chat platform featuring real-time WebRTC communication, WebSocket signaling, and a dynamic matchmaking algorithm.',
        tags: ['Next.js', 'WebRTC', 'WebSocket', 'ElysiaJS', 'PostgreSQL'],
        url: 'https://tinza-demo.vercel.app',
        color: '#f59e0b',
        emoji: '💬',
    },
    {
        name: 'OPBento',
        desc: 'Create beautiful GitHub profile READMEs with lots of stats and customization options.',
        tags: ['GitHub', 'Profile', 'Developer Tools'],
        url: 'https://opbento.vercel.app/',
        color: '#06b6d4',
        emoji: '🍱',
    },
    {
        name: 'Healthio',
        desc: 'Healthcare platform that won StatusCode Hackathon at IIIT Kalyani. Comprehensive health management.',
        tags: ['Healthcare', 'Hackathon Winner', 'Next.js'],
        url: 'https://healthio.vercel.app/',
        color: '#ec4899',
        emoji: '🏥',
    },
    {
        name: 'Groq Chat',
        desc: 'Blazingly fast AI chatbot powered by Groq and Meta Llama3 70b with Vercel AI SDK.',
        tags: ['AI', 'Chatbot', 'Groq', 'Llama3'],
        url: 'https://groq-ai.vercel.app',
        color: '#3b82f6',
        emoji: '⚡',
    },
    {
        name: 'Roasty',
        desc: "A fun project that roasts your GitHub, LinkedIn and Leetcode profiles hard!",
        tags: ['AI', 'Fun', 'Profile Analysis'],
        url: 'https://roastyy.vercel.app',
        color: '#f97316',
        emoji: '🔥',
    },
];

export default function Projects() {
    return (
        <section
            id="projects"
            style={{
                position: 'relative',
                padding: '6rem 0',
                overflow: 'hidden',
            }}
        >
            <div
                className="floating-orb"
                style={{
                    width: 350,
                    height: 350,
                    background: 'rgba(59,130,246,0.05)',
                    top: '30%',
                    left: '-10%',
                    animationDelay: '1s',
                }}
            />

            <div className="container">
                <ScrollReveal>
                    <span className="section-label">✦ Featured Projects</span>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                    <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
                        Things I&apos;ve built
                    </h2>
                </ScrollReveal>

                <ScrollReveal delay={150}>
                    <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
                        A selection of projects that showcase my skills in full-stack development,
                        AI integration, and creative problem-solving.
                    </p>
                </ScrollReveal>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {projects.map((project, i) => (
                        <ScrollReveal key={project.name} delay={i * 100}>
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                            >
                                <div className="project-card" style={{ height: '100%' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            marginBottom: '1rem',
                                        }}
                                    >
                                        <span style={{ fontSize: '1.5rem' }}>{project.emoji}</span>
                                        <h3
                                            style={{
                                                fontFamily: "'Outfit', sans-serif",
                                                fontSize: '1.2rem',
                                                fontWeight: 600,
                                                color: 'var(--text-primary)',
                                            }}
                                        >
                                            {project.name}
                                        </h3>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="var(--text-muted)"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ marginLeft: 'auto' }}
                                        >
                                            <path d="M7 17L17 7" />
                                            <path d="M7 7h10v10" />
                                        </svg>
                                    </div>

                                    <p
                                        style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.6,
                                            marginBottom: '1.25rem',
                                        }}
                                    >
                                        {project.desc}
                                    </p>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="tech-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Color accent line */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '1.5rem',
                                            right: '1.5rem',
                                            height: 2,
                                            background: `linear-gradient(90deg, ${project.color}, transparent)`,
                                            borderRadius: 2,
                                            opacity: 0.6,
                                        }}
                                    />
                                </div>
                            </a>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
