interface SectionLabelProps {
    children: string;
}

/** Pill label above section titles, with an SVG sparkle instead of an emoji. */
export default function SectionLabel({ children }: SectionLabelProps) {
    return (
        <span className="section-label">
            <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
            </svg>
            {children}
        </span>
    );
}
