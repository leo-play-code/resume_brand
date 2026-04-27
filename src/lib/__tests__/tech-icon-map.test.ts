import { describe, it, expect } from 'vitest'
import { getTechIcon, TECH_ICON_MAP } from '@/lib/tech-icon-map'

describe('TECH_ICON_MAP coverage', () => {
  it('contains React with slug "react" and correct color', () => {
    expect(TECH_ICON_MAP['React']).toEqual({ slug: 'react', color: '#61DAFB' })
  })

  it('contains Next.js with slug "nextdotjs"', () => {
    expect(TECH_ICON_MAP['Next.js']).toMatchObject({ slug: 'nextdotjs' })
  })

  it('contains TypeScript with slug "typescript" and color "#3178C6"', () => {
    expect(TECH_ICON_MAP['TypeScript']).toEqual({ slug: 'typescript', color: '#3178C6' })
  })

  it('contains Python with a slug', () => {
    expect(TECH_ICON_MAP['Python']).toMatchObject({ slug: 'python' })
  })

  it('contains PostgreSQL with a slug', () => {
    expect(TECH_ICON_MAP['PostgreSQL']).toMatchObject({ slug: 'postgresql' })
  })

  it('contains Docker with a slug', () => {
    expect(TECH_ICON_MAP['Docker']).toMatchObject({ slug: 'docker' })
  })
})

describe('getTechIcon()', () => {
  it('returns { slug: "react", color: "#61DAFB" } for "React"', () => {
    expect(getTechIcon('React')).toEqual({ slug: 'react', color: '#61DAFB' })
  })

  it('returns slug "nextdotjs" for "Next.js"', () => {
    const entry = getTechIcon('Next.js')
    expect(entry).not.toBeNull()
    expect(entry?.slug).toBe('nextdotjs')
  })

  it('returns { slug: "typescript", color: "#3178C6" } for "TypeScript"', () => {
    expect(getTechIcon('TypeScript')).toEqual({ slug: 'typescript', color: '#3178C6' })
  })

  it('returns correct slug for "Python"', () => {
    const entry = getTechIcon('Python')
    expect(entry).not.toBeNull()
    expect(entry?.slug).toBe('python')
  })

  it('returns correct slug for "PostgreSQL"', () => {
    const entry = getTechIcon('PostgreSQL')
    expect(entry).not.toBeNull()
    expect(entry?.slug).toBe('postgresql')
  })

  it('returns correct slug for "Docker"', () => {
    const entry = getTechIcon('Docker')
    expect(entry).not.toBeNull()
    expect(entry?.slug).toBe('docker')
  })

  it('is case-insensitive — "react" (lowercase) returns the React entry', () => {
    const entry = getTechIcon('react')
    expect(entry).not.toBeNull()
    expect(entry?.slug).toBe('react')
    expect(entry?.color).toBe('#61DAFB')
  })

  it('is case-insensitive — "TYPESCRIPT" (uppercase) returns the TypeScript entry', () => {
    const entry = getTechIcon('TYPESCRIPT')
    expect(entry).not.toBeNull()
    expect(entry?.slug).toBe('typescript')
  })

  it('returns null for an unknown tech name "UnknownTech999"', () => {
    expect(getTechIcon('UnknownTech999')).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(getTechIcon('')).toBeNull()
  })
})
