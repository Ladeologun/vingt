import React from 'react';

export const Icon = ({ name, size = 20, ...props }) => {
    const paths = {
        moon: <path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" />,
        sun: (
            <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
            </>
        ),
        book: (
            <>
                <path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z" />
                <path d="M12 5v15" />
            </>
        ),
        grid: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),
        chart: (
            <>
                <path d="M4 3v17h17M9 15v-4M14 15V7M19 15V4" />
            </>
        ),
        sound: (
            <>
                <path d="m11 4-6 5H2v6h3l6 5ZM15 8c3 2 3 6 0 8M18 4c6 5 6 11 0 16" />
            </>
        ),
        arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
        check: <path d="m5 12 4 4L19 6" />,
        star: (
            <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z" />
        ),
        search: (
            <>
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
            </>
        ),
        close: <path d="m6 6 12 12M18 6 6 18" />,
        spark: (
            <>
                <path d="m12 3 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" />
            </>
        ),
        chevron: <path d="m9 5 7 7-7 7" />,
        eye: (
            <>
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),
        leaf: (
            <>
                <path d="M20 3C4 2 1 12 8 17S22 14 20 3Z" />
                <path d="M5 21 16 9" />
            </>
        ),
    };
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {paths[name]}
        </svg>
    );
};
