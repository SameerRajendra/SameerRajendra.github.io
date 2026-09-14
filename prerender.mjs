// prerender.mjs
//
// Post-build step: renders the React app to static markup and injects it
// into dist/index.html so crawlers (LinkedIn, Google, etc.) and recruiters'
// link previews see real content instead of an empty <div id="root">.
//
// Runs after `vite build` (see package.json "build" script). It loads
// App.tsx through a Vite dev server in middleware mode (ssrLoadModule),
// which transpiles TSX/JSX and resolves the project's own imports the same
// way `vite dev` does, then renders it with react-dom/server. The client
// bundle in dist/ then hydrates over the injected markup (see index.tsx).
//
// SSR safety: renderToString never invokes effects (useEffect /
// useLayoutEffect are no-ops during server rendering), so components that
// only touch window/document/localStorage inside an effect are safe. A
// component that touches any of those during render (module scope or
// render body) will throw here — if that happens, this script reports the
// failure and exits non-zero rather than silently shipping an empty shell.

import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distIndexPath = path.join(__dirname, 'dist', 'index.html');

async function main() {
  if (!fs.existsSync(distIndexPath)) {
    console.error(
      `[prerender] ${distIndexPath} does not exist. Run "vite build" before "node prerender.mjs".`
    );
    process.exit(1);
  }

  const vite = await createServer({
    root: __dirname,
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    logLevel: 'warn',
  });

  let appHtml;
  try {
    const mod = await vite.ssrLoadModule('/App.tsx');
    const App = mod.default;
    if (typeof App !== 'function') {
      throw new Error('App.tsx default export is not a React component/function.');
    }

    try {
      appHtml = renderToString(React.createElement(App));
    } catch (renderErr) {
      console.error(
        '[prerender] renderToString threw while rendering <App />.\n' +
          '  This means a component accessed window/document/localStorage/matchMedia\n' +
          '  (or otherwise threw) during render, outside a useEffect. That component is\n' +
          '  not owned by this build script and must be fixed at its source.\n' +
          '  Original error follows:\n'
      );
      // Let Vite attach real source file/line info to the stack trace.
      vite.ssrFixStacktrace(renderErr);
      console.error(renderErr.stack || renderErr);
      process.exit(1);
    }
  } finally {
    await vite.close();
  }

  let html = fs.readFileSync(distIndexPath, 'utf-8');
  const rootDivPattern = /<div id="root"><\/div>/;
  if (!rootDivPattern.test(html)) {
    console.error(
      `[prerender] Could not find <div id="root"></div> in ${distIndexPath} to inject into.`
    );
    process.exit(1);
  }
  html = html.replace(rootDivPattern, `<div id="root">${appHtml}</div>`);
  fs.writeFileSync(distIndexPath, html);

  console.log(
    `[prerender] Injected ${appHtml.length} chars of static markup into dist/index.html.`
  );
}

main().catch((err) => {
  console.error('[prerender] Unexpected failure:', err);
  process.exit(1);
});
