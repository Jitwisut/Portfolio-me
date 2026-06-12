'use client';

import { useState, useEffect, MouseEvent } from 'react';

const links = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
        // Home ให้เลื่อนกลับขึ้นบนสุดแบบนุ่มนวลแทนการกระโดดทันที
        if (href === '#home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setMobileOpen(false);
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-inner">
                    <a
                        href="#home"
                        className="navbar-logo"
                        onClick={(e) => handleLinkClick(e, '#home')}
                    >
                        Jitwisut<span className="navbar-logo-dot">.</span>
                    </a>
                    <ul className="navbar-links">
                        {links.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    onClick={(e) => handleLinkClick(e, l.href)}
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button
                        className={`menu-btn ${mobileOpen ? 'open' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                    >
                        <span className="menu-btn-line" />
                        <span className="menu-btn-line" />
                    </button>
                </div>
            </nav>
            <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
                {links.map((l) => (
                    <a
                        key={l.href}
                        href={l.href}
                        onClick={(e) => handleLinkClick(e, l.href)}
                    >
                        {l.label}
                    </a>
                ))}
            </div>
        </>
    );
}
