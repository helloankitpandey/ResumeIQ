/**
 * Application Entry Point
 *
 * Mounts the root React component into the DOM.
 * Global styles are imported here so every component inherits them.
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
