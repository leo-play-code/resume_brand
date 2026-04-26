import { describe, it, expect } from 'vitest'
import { buildDemoHtml } from '@/lib/demo-template'

const SIMPLE_CODE = `
import React from 'react';
export default function App() {
  return <div>Hello</div>;
}
`

describe('buildDemoHtml()', () => {
  it('returns a string starting with <!DOCTYPE html>', () => {
    const html = buildDemoHtml(SIMPLE_CODE)
    expect(html.trimStart().startsWith('<!DOCTYPE html>')).toBe(true)
  })

  it('contains react CDN URL from esm.sh', () => {
    const html = buildDemoHtml(SIMPLE_CODE)
    expect(html).toContain('react')
    expect(html).toContain('esm.sh')
  })

  it('contains framer-motion in the importmap', () => {
    const html = buildDemoHtml(SIMPLE_CODE)
    expect(html).toContain('framer-motion')
  })

  it('contains lucide-react in the importmap', () => {
    const html = buildDemoHtml(SIMPLE_CODE)
    expect(html).toContain('lucide-react')
  })

  it('contains <div id="root">', () => {
    const html = buildDemoHtml(SIMPLE_CODE)
    expect(html).toContain('<div id="root">')
  })

  it('embeds the supplied jsCode (key parts visible in output)', () => {
    const jsCode = 'export default function MyComponent() { return null; }'
    const html = buildDemoHtml(jsCode)
    // The code is embedded inside a template literal inside a <script> tag.
    // After sanitization the text should still be present.
    expect(html).toContain('MyComponent')
  })

  it('does not crash when jsCode contains backticks', () => {
    const codeWithBacktick = 'const msg = `hello world`; export default () => null;'
    expect(() => buildDemoHtml(codeWithBacktick)).not.toThrow()
  })

  it('escapes backticks so they do not break the surrounding template literal', () => {
    const codeWithBacktick = 'const msg = `hello`; export default () => null;'
    const html = buildDemoHtml(codeWithBacktick)
    // The raw ` should have been replaced with \` inside the HTML
    expect(html).toContain('\\`')
    // And the overall string is still valid HTML
    expect(html).toContain('<!DOCTYPE html>')
  })

  it('does not crash when jsCode contains ${} template expressions', () => {
    const codeWithExpr = 'const x = `${1 + 1}`; export default () => null;'
    expect(() => buildDemoHtml(codeWithExpr)).not.toThrow()
  })

  it('escapes ${} so it does not interpolate into the surrounding template literal', () => {
    const codeWithExpr = 'const x = `${value}`; export default () => null;'
    const html = buildDemoHtml(codeWithExpr)
    expect(html).toContain('\\${')
  })
})
