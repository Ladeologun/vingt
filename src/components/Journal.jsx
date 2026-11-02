import React from 'react';

export const Journal = () => {
    return (
        <svg className="journal" viewBox="0 0 310 230" aria-hidden="true">
            <ellipse cx="169" cy="206" rx="101" ry="10" fill="#dce4d7" />
            <g transform="translate(66 32) rotate(-12 90 80)">
                <rect x="0" y="9" width="158" height="166" rx="7" fill="#b8cab4" />
                <rect
                    x="9"
                    y="0"
                    width="154"
                    height="168"
                    rx="6"
                    fill="#fcfaf0"
                    stroke="#506d52"
                    strokeWidth="1.5"
                />
                <path d="M28 0v168" stroke="#506d52" />
                <path d="M37 30h103M37 37h103M37 113h103M37 123h83M37 133h95" stroke="#cfd6c6" />
                <text
                    x="46"
                    y="72"
                    fill="#2f503c"
                    fontSize="29"
                    fontFamily="Georgia"
                    fontStyle="italic"
                >
                    bonjour.
                </text>
                <text x="48" y="95" fill="#7a8771" fontSize="9" letterSpacing="2">
                    A LITTLE, EVERY DAY
                </text>
                <path d="m130 0 0 32 9-5 9 5V0" fill="#ba694d" />
            </g>
            <g transform="translate(217 110) rotate(20)">
                <rect width="8" height="96" rx="3" fill="#c59650" />
                <path d="m0 96 4 14 4-14" fill="#ddc5a0" />
                <path d="m2.5 105 1.5 5 1.5-5" fill="#405541" />
                <path d="M4 10v76" stroke="#f4d38e" />
            </g>
            <path d="M254 56v24m-12-12h24M42 130v12m-6-6h12" stroke="#76916c" strokeWidth="1.5" />
            <path
                d="M245 174c24-18 31-6 12 4 27-6 27 10-2 10"
                fill="none"
                stroke="#8a9e7c"
                strokeWidth="2"
            />
        </svg>
    );
};
