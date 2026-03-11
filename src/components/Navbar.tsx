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

    // สร้างฟังก์ชันจัดการการคลิกลิงก์
    const handleLinkClick = (e: any, href: any) => {
        // ถ้าลิงก์ที่กดคือ Home
        if (href === '#home') {
            e.preventDefault(); // ปิดการทำงานปกติของแท็ก <a> ที่จะกระโดดไปที่ id ทันที
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // เลื่อนขึ้นแบบนุ่มนวล
            });
        }

        // ปิดเมนูมือถือทุกครั้งที่กดเลือกลิงก์
        setMobileOpen(false);
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-inner">
                    {/* แนะนำให้เพิ่ม onClick ตรง Logo ด้วย เผื่อผู้ใช้กดโลโก้แล้วอยากให้กลับขึ้นบนสุด */}
                    <a
                        href="#home"
                        className="navbar-logo"
                        onClick={(e) => handleLinkClick(e, '#home')}
                    >
                        ✦ Portfolio
                    </a>
                    <ul className="navbar-links">
                        {links.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    // เรียกใช้ฟังก์ชัน handleLinkClick เมื่อกดลิงก์
                                    onClick={(e) => handleLinkClick(e, l.href)}
                                >
                                    {l.label}
                                </a>
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
                    <a
                        key={l.href}
                        href={l.href}
                        // เรียกใช้ฟังก์ชันเดียวกันสำหรับเมนูมือถือ
                        onClick={(e) => handleLinkClick(e, l.href)}
                    >
                        {l.label}
                    </a>
                ))}
            </div>
        </>
    );
}