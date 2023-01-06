import React from 'react';

function Return({ color }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill={color}>
            <g fillRule="nonzero">
                <path
                    d="M455.249 355.499a1 1 0 00-1.415-1.415l-5.208 5.209a1 1 0 000 1.414l5.208 5.209a1.001 1.001 0 001.416-1.416l-4.501-4.501 4.5-4.501z"
                    transform="translate(-446 -350)"
                ></path>
                <path
                    d="M462.666 359h-12.811a1 1 0 100 2h12.813a1 1 0 100-2z"
                    transform="translate(-446 -350)"
                ></path>
            </g>
        </svg>
    );
}

export default Return;
