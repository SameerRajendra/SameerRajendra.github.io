import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// The build pipeline prerenders static markup into #root (see prerender.mjs)
// so recruiters' link previews and crawlers see real content without running
// JS. We deliberately render rather than hydrate: this page is static content
// with only a nav observer and a menu toggle, so adopting the server markup
// buys nothing measurable, and a plain render avoids hydration-mismatch
// churn entirely. The prerendered HTML still does its job for crawlers.
ReactDOM.createRoot(rootElement).render(app);
