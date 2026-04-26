/**
 * Builds a self-contained HTML page that renders a React component
 * from user-supplied ESM JavaScript code.
 *
 * The code is loaded via a Blob URL so that:
 * 1. The importmap can resolve bare specifiers (react, framer-motion, …).
 * 2. The inline module script can dynamic-import the blob and obtain the
 *    default export without needing a server round-trip.
 *
 * CSP note: the iframe sandbox in ProjectCard must allow `blob:` URLs.
 * Since we control the iframe src (`/api/demo/[id]`) and do not set a
 * restrictive Content-Security-Policy header there, this works by default
 * in all modern browsers.
 */
export function buildDemoHtml(jsCode: string): string {
  // Escape backtick, backslash, and ${} to safely embed jsCode inside a
  // template-literal string that lives inside the HTML <script> tag.
  const safeCode = jsCode
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script type="importmap">
  {
    "imports": {
      "react":             "https://esm.sh/react@18",
      "react/jsx-runtime": "https://esm.sh/react@18/jsx-runtime",
      "react-dom/client":  "https://esm.sh/react-dom@18/client",
      "framer-motion":     "https://esm.sh/framer-motion@11",
      "lucide-react":      "https://esm.sh/lucide-react@0.462.0"
    }
  }
  <\/script>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; overflow: hidden; width: 100%; height: 100%; }
    #root {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'react';
    import { createRoot } from 'react-dom/client';

    // Load the user component via Blob URL so the importmap resolves
    // bare specifiers inside the component code.
    const src = \`${safeCode}\`;
    const blob = new Blob([src], { type: 'text/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    try {
      const mod = await import(blobUrl);
      const Component = mod.default;

      if (typeof Component !== 'function') {
        throw new Error(
          'Component code must have a default export that is a React component (function or class).'
        );
      }

      createRoot(document.getElementById('root')).render(
        React.createElement(Component)
      );
    } catch (err) {
      // Render a visible error so the developer knows what went wrong.
      document.getElementById('root').innerHTML =
        '<pre style="color:red;padding:1rem;white-space:pre-wrap">' +
        String(err) +
        '</pre>';
      console.error('[demo-template] render error:', err);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  <\/script>
</body>
</html>`;
}
