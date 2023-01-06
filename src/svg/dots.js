function Dots({ color }) {
    return (
        <svg width="20" height="20" fill={color} viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M458 360a2 2 0 11-4 0 2 2 0 014 0m6 0a2 2 0 11-4 0 2 2 0 014 0m-12 0a2 2 0 11-4 0 2 2 0 014 0"
                transform="translate(-446 -350)"
            ></path>
        </svg>
    );
}

export default Dots;
