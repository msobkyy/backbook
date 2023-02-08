function Info({ color = "#0096ff" }) {
  return (
    <svg
      height="24px"
      name="icon"
      role="presentation"
      viewBox="0 0 36 36"
      width="24px"
      fill={color}
    >
      <g transform="translate(18,18)scale(1.2)translate(-18,-18)">
        <path
          d="M18,10 C16.6195,10 15.5,11.119 15.5,12.5 C15.5,13.881 16.6195,15 18,15 C19.381,15 20.5,13.881 20.5,12.5 C20.5,11.119 19.381,10 18,10 Z M16,25 C16,25.552 16.448,26 17,26 L19,26 C19.552,26 20,25.552 20,25 L20,18 C20,17.448 19.552,17 19,17 L17,17 C16.448,17 16,17.448 16,18 L16,25 Z M18,30 C11.3725,30 6,24.6275 6,18 C6,11.3725 11.3725,6 18,6 C24.6275,6 30,11.3725 30,18 C30,24.6275 24.6275,30 18,30 Z"
          fill={color}
          stroke={color}
        ></path>
      </g>
    </svg>
  );
}

export default Info;
