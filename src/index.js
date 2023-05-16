import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import { BrowserRouter} from "react-router-dom";
import ContentLoader from "react-content-loader";
import "./index.scss";
import "macro-css";
import App from "./App";
  const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>,
 
);
