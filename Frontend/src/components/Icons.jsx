const baseProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
};

export function CapIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M22 10 12 5 2 10l10 5 10-5Z" />
            <path d="M6 12.4V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.6" />
            <path d="M22 10v6" />
        </svg>
    );
}

export function IdIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <rect x="2.5" y="5" width="19" height="14" rx="3" />
            <circle cx="8.5" cy="11" r="2" />
            <path d="M5.4 16c.5-1.4 1.7-2.1 3.1-2.1s2.6.7 3.1 2.1" />
            <path d="M14.5 10h4" />
            <path d="M14.5 13.5h4" />
        </svg>
    );
}

export function UsersIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

export function SeatIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
            <path d="M4 10a2 2 0 0 1 2 2v2h12v-2a2 2 0 0 1 4 0v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" />
            <path d="M6 19v2" />
            <path d="M18 19v2" />
        </svg>
    );
}

export function CheckIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="m4.5 12.5 5 5 10-11" />
        </svg>
    );
}

export function CheckBadgeIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M12 2.5 14.9 4l3.1.3.9 3 .9 3-.9 3-.9 3-3.1.3L12 21.5 9.1 20l-3.1-.3-.9-3-.9-3 .9-3 .9-3 3.1-.3L12 2.5Z" />
            <path d="m8.8 12 2.2 2.2 4.4-4.6" />
        </svg>
    );
}

export function ClockIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5V12l3.1 1.9" />
        </svg>
    );
}

export function XIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M6 6l12 12M18 6 6 18" />
        </svg>
    );
}

export function RefreshIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M20.5 11a8.5 8.5 0 0 0-15-4.5L3.5 9" />
            <path d="M3.5 4.5V9H8" />
            <path d="M3.5 13a8.5 8.5 0 0 0 15 4.5l2-2.5" />
            <path d="M20.5 19.5V15H16" />
        </svg>
    );
}

export function ArrowRightIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M4.5 12h15" />
            <path d="m13.5 6 6 6-6 6" />
        </svg>
    );
}

export function ShieldIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M12 2.8 20 6v5.8c0 4.6-3.2 8.1-8 9.4-4.8-1.3-8-4.8-8-9.4V6l8-3.2Z" />
            <path d="m8.8 12 2.2 2.2 4.4-4.6" />
        </svg>
    );
}

export function ClipboardIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <rect x="5" y="4" width="14" height="17" rx="2.5" />
            <path d="M9 4.5V3h6v1.5" />
            <path d="M9 9.5h6" />
            <path d="M9 13h6" />
            <path d="M9 16.5h4" />
        </svg>
    );
}

export function BuildingIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M4 21V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v15" />
            <path d="M16 10h3a1 1 0 0 1 1 1v10" />
            <path d="M2.5 21h19" />
            <path d="M8 8h4" />
            <path d="M8 12h4" />
            <path d="M8 16h4" />
        </svg>
    );
}

export function SparkIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M12 3v4" />
            <path d="M12 17v4" />
            <path d="M5.6 5.6l2.8 2.8" />
            <path d="m15.6 15.6 2.8 2.8" />
            <path d="M3 12h4" />
            <path d="M17 12h4" />
            <path d="m5.6 18.4 2.8-2.8" />
            <path d="m15.6 8.4 2.8-2.8" />
        </svg>
    );
}

export function AlertIcon(props) {
    return (
        <svg {...baseProps} {...props}>
            <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
            <path d="M12 9v4.5" />
            <path d="M12 17h.01" />
        </svg>
    );
}

export function SpinnerIcon(props) {
    return (
        <svg {...baseProps} {...props} className={`animate-spin ${props.className ?? ""}`}>
            <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
    );
}
