import { createPortal } from "react-dom";

function Portal({ children, id }) {
  const portalDom = id ? document.getElementById(id) : document.body;

  return createPortal(children, portalDom);
}

export default Portal;
