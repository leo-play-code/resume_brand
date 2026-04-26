import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SkillPicker from '../SkillPicker'

// Mock the addSkill server action
vi.mock('@/lib/actions/skills', () => ({
  addSkill: vi.fn(),
}))

import { addSkill } from '@/lib/actions/skills'

const mockSkillsResponse = {
  data: [
    { id: '1', nameZh: 'Python', nameEn: 'Python', category: '程式語言', isCustom: false },
    { id: '2', nameZh: 'JavaScript', nameEn: 'JavaScript', category: '程式語言', isCustom: false },
    { id: '3', nameZh: 'React', nameEn: 'React', category: '前端框架', isCustom: false },
    { id: '4', nameZh: 'Docker', nameEn: 'Docker', category: '工具', isCustom: false },
  ],
}

describe('SkillPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: fetch returns all skills
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockSkillsResponse),
    } as Response)
  })

  it('renders empty state with search box', () => {
    render(<SkillPicker name="skills" />)
    const input = screen.getByRole('combobox')
    expect(input).toBeDefined()
    expect((input as HTMLInputElement).placeholder).toContain('搜尋')
  })

  it('mock GET /api/skills → displays results grouped by category', async () => {
    render(<SkillPicker name="skills" />)
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await waitFor(() => {
      expect(screen.getByText('程式語言')).toBeDefined()
      expect(screen.getByText('前端框架')).toBeDefined()
      expect(screen.getByText('工具')).toBeDefined()
    })
    // Skills appear within their category groups
    expect(screen.getAllByText('Python').length).toBeGreaterThan(0)
    expect(screen.getAllByText('React').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Docker').length).toBeGreaterThan(0)
  })

  it('selecting a skill adds a tag', async () => {
    render(<SkillPicker name="skills" />)
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await waitFor(() => expect(screen.getAllByText('Python').length).toBeGreaterThan(0))
    // Click the Python option (role="option")
    const pythonOptions = screen.getAllByRole('option', { name: /Python/i })
    fireEvent.mouseDown(pythonOptions[0])
    // Remove button with aria-label should appear
    expect(screen.getByLabelText('移除 Python')).toBeDefined()
  })

  it('clicking X on a tag removes it', async () => {
    render(<SkillPicker name="skills" defaultValue={['Python']} />)
    const removeBtn = screen.getByLabelText('移除 Python')
    await userEvent.click(removeBtn)
    expect(screen.queryByLabelText('移除 Python')).toBeNull()
  })

  it('hidden input value equals comma-joined selected skills', async () => {
    const { container } = render(
      <SkillPicker name="skills" defaultValue={['Python', 'React']} />
    )
    const hidden = container.querySelector('input[type="hidden"][name="skills"]') as HTMLInputElement
    expect(hidden).toBeDefined()
    expect(hidden.value).toBe('Python,React')
  })

  it('"新增自訂技能" button shown when search has no results', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    } as Response)

    render(<SkillPicker name="skills" />)
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'xyz_no_match')
    await waitFor(() => {
      expect(screen.getAllByText(/新增自訂技能/).length).toBeGreaterThan(0)
    })
  })

  it('adding custom skill calls addSkill action with correct data', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    } as Response)
    vi.mocked(addSkill).mockResolvedValue({
      success: true,
      skill: { id: 'new', nameZh: 'CustomSkill', nameEn: 'CustomSkill', category: '其他工具', isCustom: true },
    } as any)

    render(<SkillPicker name="skills" />)
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'CustomSkill')
    await waitFor(() => expect(screen.getAllByText(/新增自訂技能/).length).toBeGreaterThan(0))
    fireEvent.mouseDown(screen.getAllByText(/新增自訂技能/)[0])
    await waitFor(() => {
      expect(addSkill).toHaveBeenCalledTimes(1)
    })
    const calledFd = vi.mocked(addSkill).mock.calls[0][0] as FormData
    expect(calledFd.get('nameZh')).toBe('CustomSkill')
    expect(calledFd.get('category')).toBe('其他工具')
  })

  it('debounce: API not called on every keystroke immediately', async () => {
    render(<SkillPicker name="skills" />)
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'abc')
    // fetch is called at minimum once on mount; the debounce should batch rapid keystrokes
    // Just verify fetch was called (not called 4 times in sync for 3 chars + mount)
    expect(global.fetch).toHaveBeenCalled()
    const callCount = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length
    // Should be at most 2 calls (1 mount + 1 debounced), not 4
    expect(callCount).toBeLessThanOrEqual(2)
  })
})
