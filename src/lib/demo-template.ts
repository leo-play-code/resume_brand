export function buildDemoHtml(jsCode: string): string {
  // Escape backtick, backslash, and ${} to safely embed jsCode inside a
  // template-literal string inside the HTML <script> tag.
  const safeCode = jsCode
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.26.4/babel.min.js"><\/script>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; }
    body { background: #faf9f6; overflow: hidden; }
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
    import React from 'https://esm.sh/react@18';
    import { createRoot } from 'https://esm.sh/react-dom@18/client';

    // Map bare specifiers to absolute CDN URLs.
    // We inject transpiled code as a <script type="module"> (not a Blob URL)
    // because Blob URLs cannot resolve bare specifiers even with an importmap.
    const CDN = {
      'react':             'https://esm.sh/react@18',
      'react/jsx-runtime': 'https://esm.sh/react@18/jsx-runtime',
      'react-dom/client':  'https://esm.sh/react-dom@18/client',
      'framer-motion':     'https://esm.sh/framer-motion@11?external=react,react-dom',
      'lucide-react':      'https://esm.sh/lucide-react@0.462.0?external=react',
    };

    const rawSrc = \`${safeCode}\`;

    // Transpile JSX → plain ESM via Babel standalone (loaded globally above).
    let transpiledSrc;
    try {
      transpiledSrc = Babel.transform(rawSrc, {
        presets: [['react', { runtime: 'automatic' }]],
        filename: 'component.jsx',
      }).code;
    } catch (err) {
      document.getElementById('root').innerHTML =
        '<pre style="color:red;padding:1rem;white-space:pre-wrap">JSX syntax error:\\n' + String(err) + '</pre>';
      throw err;
    }

    // Rewrite bare import specifiers to absolute CDN URLs.
    let esmSrc = transpiledSrc.replace(
      /from\\s+["']([^"']+)["']/g,
      (match, spec) => (CDN[spec] ? \`from '\${CDN[spec]}'\` : match)
    );

    // Replace "export default" with a global assignment so we can render
    // the component after the injected module script finishes executing.
    esmSrc = esmSrc.replace(/export\\s+default\\s+/, 'window.__DEMO_COMPONENT__ = ');
    esmSrc += '\\ndispatchEvent(new CustomEvent("__demo_ready__"));';

    // Scale the component's outermost element to fill the iframe viewport.
    // Uses scrollWidth/scrollHeight so it measures the full natural size even when
    // the element overflows a clipped container.
    function scaleToFit() {
      const child = document.querySelector('#root > *');
      if (!child) return;
      child.style.transform = 'none';
      const w = child.scrollWidth || child.offsetWidth;
      const h = child.scrollHeight || child.offsetHeight;
      if (!w || !h) return;
      const scale = Math.min(window.innerWidth / w, window.innerHeight / h, 1);
      child.style.transformOrigin = 'center center';
      child.style.transform = scale < 0.99 ? 'scale(' + scale + ')' : 'none';
    }
    window.addEventListener('resize', scaleToFit);

    // Show unhandled runtime errors that React/the component might swallow silently.
    window.onerror = (_msg, _src, _line, _col, err) => {
      const root = document.getElementById('root');
      if (root && !root.querySelector('pre')) {
        root.innerHTML = '<pre style="color:red;padding:1rem;white-space:pre-wrap">Runtime error:\\n' + String(err || _msg) + '</pre>';
      }
      return true;
    };
    window.addEventListener('unhandledrejection', function(e) {
      const root = document.getElementById('root');
      if (root && !root.querySelector('pre')) {
        root.innerHTML = '<pre style="color:red;padding:1rem;white-space:pre-wrap">Unhandled rejection:\\n' + String(e.reason) + '</pre>';
      }
    });

    // Listen for the component to register itself, with a timeout fallback.
    let timeout;
    const onReady = () => {
      clearTimeout(timeout);
      const Component = window.__DEMO_COMPONENT__;
      if (typeof Component !== 'function') {
        document.getElementById('root').innerHTML =
          '<pre style="color:red;padding:1rem;white-space:pre-wrap">Error: default export is not a React component (got: ' + typeof Component + ')</pre>';
        return;
      }
      try {
        createRoot(document.getElementById('root')).render(React.createElement(Component));
      } catch (err) {
        document.getElementById('root').innerHTML =
          '<pre style="color:red;padding:1rem;white-space:pre-wrap">Render error:\\n' + String(err) + '</pre>';
        return;
      }
      // MutationObserver fires exactly when React commits the first child to #root,
      // which is more reliable than a fixed requestAnimationFrame count.
      const mo = new MutationObserver(function() {
        const child = document.querySelector('#root > *');
        if (!child) return;
        mo.disconnect();
        // One rAF lets the browser complete layout before we measure.
        requestAnimationFrame(function() {
          scaleToFit();
          // ResizeObserver re-scales whenever the component changes size
          // (e.g. Framer Motion animating from scale:0, images loading).
          new ResizeObserver(scaleToFit).observe(child);
        });
      });
      mo.observe(document.getElementById('root'), { childList: true });
    };

    window.addEventListener('__demo_ready__', onReady, { once: true });
    timeout = setTimeout(() => {
      window.removeEventListener('__demo_ready__', onReady);
      if (!window.__DEMO_COMPONENT__) {
        document.getElementById('root').innerHTML =
          '<pre style="color:red;padding:1rem;white-space:pre-wrap">Error: component load timed out</pre>';
      }
    }, 10000);

    // Inject the component code as a proper module script.
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = esmSrc;
    document.head.appendChild(script);
  <\/script>
</body>
</html>`;
}
