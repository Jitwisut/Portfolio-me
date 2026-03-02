'use client';

import ScrollReveal from './ScrollReveal';

const skills = [
    { name: 'JavaScript', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
    { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
    { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
    { name: 'Next.js', icon: 'https://cdn.simpleicons.org/nextdotjs/FFFFFF' },
    { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/5FA04E' },
    { name: 'Python', icon: 'https://cdn.simpleicons.org/python/3776AB' },
    { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb/47A248' },
    { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
    { name: 'Prisma', icon: 'https://cdn.simpleicons.org/prisma/FFFFFF' },
    { name: 'Express.js', icon: 'https://cdn.simpleicons.org/express/FFFFFF' },
    { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
    { name: 'GSAP', icon: 'https://cdn.simpleicons.org/greensock/88CE02' },
    { name: 'Framer Motion', icon: 'https://cdn.simpleicons.org/framer/0055FF' },
    { name: 'Three.js', icon: 'https://cdn.simpleicons.org/threedotjs/FFFFFF' },
    { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/2496ED' },
    { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/FFFFFF' },
    { name: 'Git', icon: 'https://cdn.simpleicons.org/git/F05032' },
    { name: 'Firebase', icon: 'https://cdn.simpleicons.org/firebase/DD2C00' },
    { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma/F24E1E' },
    { name: 'Bun', icon: 'https://cdn.simpleicons.org/bun/FBF0DF' },
    { name: 'Elysia', icon: 'https://elysiajs.com/assets/elysia.svg' },
];

export default function Skills() {
    return (
        <section
            id="skills"
            style={{
                position: 'relative',
                padding: '6rem 0',
                overflow: 'hidden',
            }}
        >
            <div
                className="floating-orb"
                style={{
                    width: 300,
                    height: 300,
                    background: 'rgba(59,130,246,0.06)',
                    bottom: '10%',
                    right: '-8%',
                    animationDelay: '3s',
                }}
            />

            <div className="container">
                <ScrollReveal>
                    <span className="section-label">✦ Skills & Technologies</span>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                    <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
                        Technologies I work with
                    </h2>
                </ScrollReveal>

                <ScrollReveal delay={150}>
                    <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
                        A collection of tools, languages, and frameworks I use to bring ideas to life.
                    </p>
                </ScrollReveal>

                <div
                    className="stagger-children"
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                    }}
                >
                    {skills.map((skill, i) => (
                        <ScrollReveal key={skill.name} delay={i * 60}>
                            <div className="skill-badge">
                                <img
                                    src={skill.icon}
                                    alt={skill.name}
                                    width={18}
                                    height={18}
                                    style={{ flexShrink: 0 }}
                                />
                                <span>{skill.name}</span>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
