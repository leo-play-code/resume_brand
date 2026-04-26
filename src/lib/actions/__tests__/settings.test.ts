import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/cache before importing actions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock next-auth session
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

// Mock auth options (only needs to exist)
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    siteSettings: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}))

import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSiteSettings, updateSiteSettings } from '../settings'

const mockSession = { user: { name: 'Admin', email: 'admin@test.com' } }

describe('getSiteSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns record from DB when one exists', async () => {
    const dbRecord = {
      id: 'singleton',
      backgroundDark: '#123456',
      backgroundLight: '#abcdef',
    }
    vi.mocked(prisma.siteSettings.findUnique).mockResolvedValue(dbRecord as any)

    const result = await getSiteSettings()

    expect(result).toEqual(dbRecord)
    expect(prisma.siteSettings.findUnique).toHaveBeenCalledWith({
      where: { id: 'singleton' },
    })
  })

  it('returns default values when DB record is null', async () => {
    vi.mocked(prisma.siteSettings.findUnique).mockResolvedValue(null)

    const result = await getSiteSettings()

    expect(result).toEqual({
      id: 'singleton',
      backgroundDark: '#050510',
      backgroundLight: '#f4f1ff',
    })
  })
})

describe('updateSiteSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getServerSession).mockResolvedValue(mockSession as any)
  })

  it('upserts and returns { success: true } with valid hex + admin session', async () => {
    vi.mocked(prisma.siteSettings.upsert).mockResolvedValue({
      id: 'singleton',
      backgroundDark: '#050510',
      backgroundLight: '#f4f1ff',
    } as any)

    const fd = new FormData()
    fd.append('backgroundDark', '#050510')
    fd.append('backgroundLight', '#f4f1ff')

    const result = await updateSiteSettings(fd)

    expect(result).toEqual({ success: true })
    expect(prisma.siteSettings.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'singleton' },
        update: { backgroundDark: '#050510', backgroundLight: '#f4f1ff' },
        create: { id: 'singleton', backgroundDark: '#050510', backgroundLight: '#f4f1ff' },
      })
    )
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(revalidatePath).toHaveBeenCalledWith('/admin/settings')
  })

  it('returns { error: "Invalid hex color format" } for invalid dark color "red"', async () => {
    const fd = new FormData()
    fd.append('backgroundDark', 'red')
    fd.append('backgroundLight', '#f4f1ff')

    const result = await updateSiteSettings(fd)

    expect(result).toEqual({ error: 'Invalid hex color format' })
    expect(prisma.siteSettings.upsert).not.toHaveBeenCalled()
  })

  it('returns { error: "Invalid hex color format" } for malformed hex "#xyz"', async () => {
    const fd = new FormData()
    fd.append('backgroundDark', '#050510')
    fd.append('backgroundLight', '#xyz')

    const result = await updateSiteSettings(fd)

    expect(result).toEqual({ error: 'Invalid hex color format' })
    expect(prisma.siteSettings.upsert).not.toHaveBeenCalled()
  })

  it('throws Error("Unauthorized") when session is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    const fd = new FormData()
    fd.append('backgroundDark', '#050510')
    fd.append('backgroundLight', '#f4f1ff')

    await expect(updateSiteSettings(fd)).rejects.toThrow('Unauthorized')
    expect(prisma.siteSettings.upsert).not.toHaveBeenCalled()
  })
})
