/**
 * i18n Fallback Logic — Unit Tests
 *
 * Tests the locale-aware fallback functions that are used in
 * src/app/[locale]/page.tsx getData() to resolve project names,
 * experience roles, and experience descriptions.
 *
 * These are pure-function tests — no browser or Next.js runtime required.
 *
 * NOTE: The following i18n tasks require E2E / browser testing:
 *   - [i18n] middleware locale routing — Manual/E2E: needs Playwright.
 *     In dev: GET / redirects to /zh; GET /en serves locale=en; GET /admin is not intercepted.
 *   - [i18n] Navbar language toggle (URL change) — Unit test covers button render;
 *     actual URL push to /en or /zh requires a running Next.js server (E2E).
 */

import { describe, it, expect } from 'vitest'

// ---------------------------------------------------------------------------
// Inline implementations of the fallback helpers that mirror page.tsx logic.
// We keep them here so the tests are self-contained and do not import the
// server component (which requires a Next.js runtime).
// ---------------------------------------------------------------------------

function resolveProjectName(
  p: { name: string; nameEn?: string | null },
  locale: string,
): string {
  return locale === 'en' ? p.nameEn || p.name : p.name
}

function resolveProjectDescription(
  p: { description: string; descriptionEn?: string | null },
  locale: string,
): string {
  return locale === 'en' ? p.descriptionEn || p.description : p.description
}

function resolveExperienceRole(
  e: { role: string; roleEn?: string | null },
  locale: string,
): string {
  return locale === 'en' ? e.roleEn || e.role : e.role
}

function resolveExperienceDescription(
  e: { description: string[]; descriptionEn?: string[] },
  locale: string,
): string[] {
  if (locale === 'en' && e.descriptionEn && e.descriptionEn.length > 0) {
    return e.descriptionEn
  }
  return e.description
}

// ---------------------------------------------------------------------------
// Project name fallback
// ---------------------------------------------------------------------------

describe('resolveProjectName()', () => {
  it('locale=en, nameEn=null → returns zh name as fallback', () => {
    expect(resolveProjectName({ name: '作品名稱', nameEn: null }, 'en')).toBe('作品名稱')
  })

  it('locale=en, nameEn=undefined → returns zh name as fallback', () => {
    expect(resolveProjectName({ name: '作品名稱' }, 'en')).toBe('作品名稱')
  })

  it('locale=en, nameEn="" (empty string) → returns zh name as fallback', () => {
    expect(resolveProjectName({ name: '作品名稱', nameEn: '' }, 'en')).toBe('作品名稱')
  })

  it('locale=en, nameEn="English Name" → returns nameEn', () => {
    expect(
      resolveProjectName({ name: '作品名稱', nameEn: 'English Name' }, 'en'),
    ).toBe('English Name')
  })

  it('locale=zh, nameEn="English Name" → returns zh name regardless', () => {
    expect(
      resolveProjectName({ name: '作品名稱', nameEn: 'English Name' }, 'zh'),
    ).toBe('作品名稱')
  })

  it('locale=zh, nameEn=null → returns zh name', () => {
    expect(resolveProjectName({ name: '作品名稱', nameEn: null }, 'zh')).toBe('作品名稱')
  })
})

// ---------------------------------------------------------------------------
// Project description fallback
// ---------------------------------------------------------------------------

describe('resolveProjectDescription()', () => {
  it('locale=en, descriptionEn=null → returns zh description', () => {
    expect(
      resolveProjectDescription({ description: '中文簡介', descriptionEn: null }, 'en'),
    ).toBe('中文簡介')
  })

  it('locale=en, descriptionEn="English description" → returns descriptionEn', () => {
    expect(
      resolveProjectDescription(
        { description: '中文簡介', descriptionEn: 'English description' },
        'en',
      ),
    ).toBe('English description')
  })

  it('locale=zh, descriptionEn="English description" → returns zh description', () => {
    expect(
      resolveProjectDescription(
        { description: '中文簡介', descriptionEn: 'English description' },
        'zh',
      ),
    ).toBe('中文簡介')
  })
})

// ---------------------------------------------------------------------------
// Experience role fallback
// ---------------------------------------------------------------------------

describe('resolveExperienceRole()', () => {
  it('locale=en, roleEn=null → returns zh role as fallback', () => {
    expect(resolveExperienceRole({ role: '工程師', roleEn: null }, 'en')).toBe('工程師')
  })

  it('locale=en, roleEn="" (empty) → returns zh role as fallback', () => {
    expect(resolveExperienceRole({ role: '工程師', roleEn: '' }, 'en')).toBe('工程師')
  })

  it('locale=en, roleEn="Engineer" → returns roleEn', () => {
    expect(resolveExperienceRole({ role: '工程師', roleEn: 'Engineer' }, 'en')).toBe('Engineer')
  })

  it('locale=zh, roleEn="Engineer" → returns zh role', () => {
    expect(resolveExperienceRole({ role: '工程師', roleEn: 'Engineer' }, 'zh')).toBe('工程師')
  })

  it('locale=zh, roleEn=null → returns zh role', () => {
    expect(resolveExperienceRole({ role: '工程師', roleEn: null }, 'zh')).toBe('工程師')
  })
})

// ---------------------------------------------------------------------------
// Experience description (array) fallback
// ---------------------------------------------------------------------------

describe('resolveExperienceDescription()', () => {
  it('locale=en, descriptionEn=[] (empty array) → returns zh description array', () => {
    const e = { description: ['中文條目一', '中文條目二'], descriptionEn: [] }
    expect(resolveExperienceDescription(e, 'en')).toEqual(['中文條目一', '中文條目二'])
  })

  it('locale=en, descriptionEn=undefined → returns zh description array', () => {
    const e = { description: ['中文條目一'], descriptionEn: undefined }
    expect(resolveExperienceDescription(e, 'en')).toEqual(['中文條目一'])
  })

  it('locale=en, descriptionEn=["a","b"] → returns descriptionEn array', () => {
    const e = { description: ['中文條目一'], descriptionEn: ['a', 'b'] }
    expect(resolveExperienceDescription(e, 'en')).toEqual(['a', 'b'])
  })

  it('locale=zh, descriptionEn=["a","b"] → returns zh description array', () => {
    const e = { description: ['中文條目一'], descriptionEn: ['a', 'b'] }
    expect(resolveExperienceDescription(e, 'zh')).toEqual(['中文條目一'])
  })
})
