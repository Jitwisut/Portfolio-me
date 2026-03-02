'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Skills', href: '#skills' },
        { label: 'Projects', href: '#projects' },
        { label: 'Contact', href: '#contact' },
    ];

    const handleClick = () => setMobileOpen(false);

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-inner">
                    <a href="#home" className="navbar-logo">
                        ✦ Portfolio
                    </a>
                    <ul className="navbar-links">
                        {links.map((l) => (
                            <li key={l.href}>
                                <a href={l.href}>{l.label}</a>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="menu-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
            </nav>
            <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
                {links.map((l) => (
                    <a key={l.href} href={l.href} onClick={handleClick}>
                        {l.label}
                    </a>
                ))}
            </div>
        </>
    );
}
