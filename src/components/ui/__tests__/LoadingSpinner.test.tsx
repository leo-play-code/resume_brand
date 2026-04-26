import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders without props (default md size)', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.firstChild as HTMLElement
    expect(spinner).toBeTruthy()
  })

  it('renders sm size — has appropriate small dimensions class', () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    const spinner = container.firstChild as HTMLElement
    expect(spinner.className).toMatch(/w-4|h-4|size-4/)
  })

  it('renders lg size — has appropriate large dimensions class', () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    const spinner = container.firstChild as HTMLElement
    expect(spinner.className).toMatch(/w-8|h-8|w-10|h-10|size-8|size-10/)
  })

  it('has animate-spin class', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.firstChild as HTMLElement
    expect(spinner.className).toContain('animate-spin')
  })

  it('has purple border-t color class', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.firstChild as HTMLElement
    expect(spinner.className).toMatch(/border-t.*purple|border-purple/)
  })
})
