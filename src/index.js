import React from "react";
import * as ReactDOMClient from "react-dom/client";
import "./index.css";
import "./styles/dark.css";
import "react-loading-skeleton/dist/skeleton.css";

import "./styles/icons/icons.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";

const root = ReactDOMClient.createRoot(document.getElementById("backbook"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
