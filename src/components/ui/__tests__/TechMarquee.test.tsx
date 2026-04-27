import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TechMarquee from '../TechMarquee'
import type { TechItem } from '@/lib/data/tech-stack'

describe('TechMarquee', () => {
  describe('when TechItem has an icon slug', () => {
    const itemsWithIcon: TechItem[] = [
      { name: 'React', color: '#61DAFB', icon: 'react' },
    ]

    it('renders an <img> element', () => {
      const { container } = render(
        <TechMarquee items={itemsWithIcon} direction="left" />
      )
      const imgs = container.querySelectorAll('img')
      expect(imgs.length).toBeGreaterThan(0)
    })

    it('the <img> src contains "simpleicons.org"', () => {
      const { container } = render(
        <TechMarquee items={itemsWithIcon} direction="left" />
      )
      const img = container.querySelector('img')
      expect(img).not.toBeNull()
      expect(img?.src).toContain('simpleicons.org')
    })

    it('the <img> src contains the icon slug', () => {
      const { container } = render(
        <TechMarquee items={itemsWithIcon} direction="left" />
      )
      const img = container.querySelector('img')
      expect(img?.src).toContain('react')
    })

    it('does not render a color dot <span> when icon is present', () => {
      const { container } = render(
        <TechMarquee items={itemsWithIcon} direction="left" />
      )
      // The color-dot span has specific inline backgroundColor style
      const spans = Array.from(container.querySelectorAll('span')).filter(
        (el) => el.style.backgroundColor !== ''
      )
      expect(spans.length).toBe(0)
    })

    it('displays the technology name text', () => {
      render(<TechMarquee items={itemsWithIcon} direction="left" />)
      // name is duplicated for the marquee track, so getAllByText
      const names = screen.getAllByText('React')
      expect(names.length).toBeGreaterThan(0)
    })
  })

  describe('when TechItem has no icon (undefined)', () => {
    const itemsNoIcon: TechItem[] = [
      { name: 'MyTech', color: '#ff0000' },
    ]

    it('does not render any <img> element', () => {
      const { container } = render(
        <TechMarquee items={itemsNoIcon} direction="right" />
      )
      const imgs = container.querySelectorAll('img')
      expect(imgs.length).toBe(0)
    })

    it('renders a color-dot <span> with the tech color as backgroundColor', () => {
      const { container } = render(
        <TechMarquee items={itemsNoIcon} direction="right" />
      )
      const colorDots = Array.from(container.querySelectorAll('span')).filter(
        (el) => el.style.backgroundColor !== ''
      )
      expect(colorDots.length).toBeGreaterThan(0)
    })

    it('displays the technology name text', () => {
      render(<TechMarquee items={itemsNoIcon} direction="right" />)
      const names = screen.getAllByText('MyTech')
      expect(names.length).toBeGreaterThan(0)
    })
  })

  describe('mixed items', () => {
    const mixedItems: TechItem[] = [
      { name: 'React', color: '#61DAFB', icon: 'react' },
      { name: 'Custom', color: '#aabbcc' },
    ]

    it('renders img for the item with icon and color-dot for item without icon', () => {
      const { container } = render(
        <TechMarquee items={mixedItems} direction="left" />
      )
      const imgs = container.querySelectorAll('img')
      const colorDots = Array.from(container.querySelectorAll('span')).filter(
        (el) => el.style.backgroundColor !== ''
      )
      expect(imgs.length).toBeGreaterThan(0)
      expect(colorDots.length).toBeGreaterThan(0)
    })

    it('shows both technology names', () => {
      render(<TechMarquee items={mixedItems} direction="left" />)
      expect(screen.getAllByText('React').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Custom').length).toBeGreaterThan(0)
    })
  })
})
