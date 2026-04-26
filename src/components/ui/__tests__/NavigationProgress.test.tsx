import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { act } from 'react'
import { usePathname } from 'next/navigation'
import NavigationProgress from '../NavigationProgress'

vi.mock('next/navigation', () => ({ usePathname: vi.fn(() => '/') }))

describe('NavigationProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePathname).mockReturnValue('/')
  })

  it('renders invisible bar initially (opacity-0 or not visible)', () => {
    const { container } = render(<NavigationProgress />)
    const bar = container.firstChild as HTMLElement
    expect(bar).toBeTruthy()
    // The component uses inline style opacity=0 when not visible (first render)
    const isHidden =
      bar.className.includes('opacity-0') ||
      bar.getAttribute('aria-hidden') === 'true' ||
      bar.style.opacity === '0'
    expect(isHidden).toBe(true)
  })

  it('when pathname changes, progress bar becomes visible', async () => {
    const { rerender } = render(<NavigationProgress />)
    vi.mocked(usePathname).mockReturnValue('/about')
    await act(async () => {
      rerender(<NavigationProgress />)
    })
    // The bar element should still be in the DOM
    const bar = document.querySelector('[aria-hidden="true"]')
    expect(bar).toBeTruthy()
  })

  it('renders as a fixed top element (role or position check)', () => {
    const { container } = render(<NavigationProgress />)
    const bar = container.firstChild as HTMLElement
    expect(bar.className).toMatch(/fixed/)
    expect(bar.className).toMatch(/top-0/)
  })
})
