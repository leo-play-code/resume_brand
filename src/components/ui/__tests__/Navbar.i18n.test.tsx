/**
 * Navbar i18n — Language Toggle Button Render Tests
 *
 * Covers:
 *   - [i18n] Navbar language toggle (render):
 *       locale=zh → button shows "EN"
 *       locale=en → button shows "中文"
 *
 * NOTE: The URL-change behaviour (router.push to /en or /zh) is NOT tested
 * here because it requires a running Next.js server.
 * → Manual/E2E: after clicking EN the URL should change to /en; clicking 中文 back to /zh.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useLocale } from 'next-intl'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: vi.fn(() => 'zh'),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/zh',
}))

// GSAP / ScrollTrigger are not available in jsdom — stub them out.
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    to: vi.fn(),
  },
}))
vi.mock('gsap/ScrollTrigger', () => ({
  default: {
    create: vi.fn(() => ({ kill: vi.fn() })),
    getAll: vi.fn(() => []),
  },
}))

// next-auth session — return no session so UserMenu renders "Sign in"
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// ThemeProvider — return stable dark theme
vi.mock('@/components/providers/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'dark', toggle: vi.fn() }),
}))

// siteConfig
vi.mock('@/lib/config', () => ({
  siteConfig: { ownerInitials: 'L' },
}))

// ---------------------------------------------------------------------------
// Import after mocks are in place
// ---------------------------------------------------------------------------
import Navbar from '../../layout/Navbar'

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Navbar — language toggle button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('locale=zh → language toggle button shows "EN"', () => {
    vi.mocked(useLocale).mockReturnValue('zh')
    render(<Navbar />)
    expect(screen.getByText('EN')).toBeTruthy()
  })

  it('locale=en → language toggle button shows "中文"', () => {
    vi.mocked(useLocale).mockReturnValue('en')
    render(<Navbar />)
    expect(screen.getByText('中文')).toBeTruthy()
  })
})
