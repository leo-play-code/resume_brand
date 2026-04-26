import { describe, it, expect } from 'vitest'
import { isLightColor, buildCssVars } from '@/lib/utils/color'

describe('isLightColor', () => {
  it('returns true for pure white (#ffffff)', () => {
    expect(isLightColor('#ffffff')).toBe(true)
  })

  it('returns true for light lavender white (#f4f1ff)', () => {
    expect(isLightColor('#f4f1ff')).toBe(true)
  })

  it('returns false for near-black (#050510)', () => {
    expect(isLightColor('#050510')).toBe(false)
  })

  it('returns false for deep blue-black (#13122a)', () => {
    expect(isLightColor('#13122a')).toBe(false)
  })

  it('boundary value #808080 — does not throw, returns boolean', () => {
    const result = isLightColor('#808080')
    expect(typeof result).toBe('boolean')
  })
})

describe('buildCssVars', () => {
  describe('dark background (isLight=false)', () => {
    const bg = '#050510'
    const vars = buildCssVars(bg, false)

    it('contains --foreground: #ffffff for dark bg', () => {
      expect(vars).toContain('--foreground: #ffffff')
    })

    it('contains --background: with the provided bg value', () => {
      expect(vars).toContain(`--background: ${bg}`)
    })

    it('contains --surface', () => {
      expect(vars).toContain('--surface')
    })

    it('contains --border', () => {
      expect(vars).toContain('--border')
    })

    it('contains --fg-60', () => {
      expect(vars).toContain('--fg-60')
    })
  })

  describe('light background (isLight=true)', () => {
    const bg = '#f4f1ff'
    const vars = buildCssVars(bg, true)

    it('contains --foreground: #13122a for light bg', () => {
      expect(vars).toContain('--foreground: #13122a')
    })

    it('contains --background: with the provided bg value', () => {
      expect(vars).toContain(`--background: ${bg}`)
    })

    it('contains --surface', () => {
      expect(vars).toContain('--surface')
    })

    it('contains --border', () => {
      expect(vars).toContain('--border')
    })

    it('contains --fg-60', () => {
      expect(vars).toContain('--fg-60')
    })
  })
})

describe('Layout CSS var injection integration', () => {
  it('light bg: isLightColor true → buildCssVars foreground is dark (#13122a)', () => {
    const bg = '#f4f1ff'
    const isLight = isLightColor(bg)
    expect(isLight).toBe(true)
    const vars = buildCssVars(bg, isLight)
    expect(vars).toContain('--foreground: #13122a')
  })

  it('dark bg: isLightColor false → buildCssVars foreground is white (#ffffff)', () => {
    const bg = '#050510'
    const isLight = isLightColor(bg)
    expect(isLight).toBe(false)
    const vars = buildCssVars(bg, isLight)
    expect(vars).toContain('--foreground: #ffffff')
  })
})
