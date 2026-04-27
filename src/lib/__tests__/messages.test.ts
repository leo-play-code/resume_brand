/**
 * Translation file integrity — Unit Tests
 *
 * Verifies that zh.json and en.json contain the expected top-level keys
 * and specific nav / hero keys required by the Navbar and HeroSection components.
 */

import { describe, it, expect } from 'vitest'
import zh from '../../../messages/zh.json'
import en from '../../../messages/en.json'

const TOP_LEVEL_KEYS = ['nav', 'hero', 'projects', 'experience', 'contact'] as const
const NAV_KEYS = ['about', 'projects', 'experience', 'contact'] as const

describe('zh.json integrity', () => {
  it('contains all required top-level keys', () => {
    for (const key of TOP_LEVEL_KEYS) {
      expect(zh).toHaveProperty(key)
    }
  })

  it('nav contains about, projects, experience, contact', () => {
    for (const key of NAV_KEYS) {
      expect(zh.nav).toHaveProperty(key)
      expect(typeof (zh.nav as Record<string, string>)[key]).toBe('string')
    }
  })

  it('hero.greeting is "你好，我是"', () => {
    expect(zh.hero.greeting).toBe('你好，我是')
  })

  it('hero.roles is a non-empty array', () => {
    expect(Array.isArray(zh.hero.roles)).toBe(true)
    expect(zh.hero.roles.length).toBeGreaterThan(0)
  })
})

describe('en.json integrity', () => {
  it('contains all required top-level keys', () => {
    for (const key of TOP_LEVEL_KEYS) {
      expect(en).toHaveProperty(key)
    }
  })

  it('nav contains about, projects, experience, contact', () => {
    for (const key of NAV_KEYS) {
      expect(en.nav).toHaveProperty(key)
      expect(typeof (en.nav as Record<string, string>)[key]).toBe('string')
    }
  })

  it('hero.greeting is "Hello, I\'m"', () => {
    expect(en.hero.greeting).toBe("Hello, I'm")
  })

  it('hero.roles is a non-empty array', () => {
    expect(Array.isArray(en.hero.roles)).toBe(true)
    expect(en.hero.roles.length).toBeGreaterThan(0)
  })
})

describe('zh.json and en.json key parity', () => {
  it('both files have exactly the same top-level keys', () => {
    const zhKeys = Object.keys(zh).sort()
    const enKeys = Object.keys(en).sort()
    expect(zhKeys).toEqual(enKeys)
  })

  it('both files have the same nav keys', () => {
    const zhNavKeys = Object.keys(zh.nav).sort()
    const enNavKeys = Object.keys(en.nav).sort()
    expect(zhNavKeys).toEqual(enNavKeys)
  })

  it('both files have the same hero keys', () => {
    const zhHeroKeys = Object.keys(zh.hero).sort()
    const enHeroKeys = Object.keys(en.hero).sort()
    expect(zhHeroKeys).toEqual(enHeroKeys)
  })
})
