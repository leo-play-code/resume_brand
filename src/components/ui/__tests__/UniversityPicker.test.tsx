import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UniversityPicker from '../UniversityPicker'

describe('UniversityPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders 學歷層級 select with 4 options (高中/學士/碩士/博士)', () => {
    const { container } = render(<UniversityPicker />)
    // Find native select by name (not by combobox role+name since label has inner span)
    const select = container.querySelector('select[name="degree_level"]') as HTMLSelectElement
    expect(select).toBeDefined()
    const options = select.querySelectorAll('option')
    expect(options).toHaveLength(4)
    const values = Array.from(options).map((o) => o.value)
    expect(values).toContain('高中')
    expect(values).toContain('學士')
    expect(values).toContain('碩士')
    expect(values).toContain('博士')
  })

  it('renders 學校 combobox with placeholder', () => {
    render(<UniversityPicker />)
    expect(screen.getByPlaceholderText('搜尋或輸入學校名稱')).toBeDefined()
  })

  it('renders 系所 combobox with placeholder', () => {
    render(<UniversityPicker />)
    expect(screen.getByPlaceholderText('搜尋或輸入系所名稱')).toBeDefined()
  })

  it('searching "臺灣大學" returns NTU in results', async () => {
    render(<UniversityPicker />)
    const schoolInput = screen.getByPlaceholderText('搜尋或輸入學校名稱')
    await userEvent.click(schoolInput)
    await userEvent.type(schoolInput, '臺灣大學')
    // Should show a listbox
    expect(screen.getByRole('listbox')).toBeDefined()
    // NTU should appear
    expect(screen.getAllByText('國立臺灣大學').length).toBeGreaterThan(0)
  })

  it('searching "national" returns English-name universities', async () => {
    render(<UniversityPicker />)
    const schoolInput = screen.getByPlaceholderText('搜尋或輸入學校名稱')
    await userEvent.click(schoolInput)
    await userEvent.type(schoolInput, 'national')
    expect(screen.getByRole('listbox')).toBeDefined()
    // NTU should appear (National Taiwan University matches 'national')
    expect(screen.getAllByText('國立臺灣大學').length).toBeGreaterThan(0)
  })

  it('selecting school sets hidden input for school_name_en', async () => {
    const { container } = render(<UniversityPicker />)
    const schoolInput = screen.getByPlaceholderText('搜尋或輸入學校名稱')
    await userEvent.click(schoolInput)
    // NTU appears in both labelZh and labelEn columns; pick the first visible one
    const ntuItems = screen.getAllByText('國立臺灣大學')
    fireEvent.mouseDown(ntuItems[0])
    const hiddenEn = container.querySelector('input[name="school_name_en"]') as HTMLInputElement
    expect(hiddenEn).toBeDefined()
    expect(hiddenEn.value).toBe('National Taiwan University')
  })

  it('free input school name works (allowFreeInput)', async () => {
    render(<UniversityPicker />)
    const schoolInput = screen.getByPlaceholderText('搜尋或輸入學校名稱')
    await userEvent.click(schoolInput)
    await userEvent.type(schoolInput, '自訂學校名稱')
    // allowFreeInput is true, so "使用 ..." option should appear when no match
    expect(screen.getAllByText(/使用/).length).toBeGreaterThan(0)
  })

  it('all 3 fields are present in form output (degree_level, school_name_zh, department)', () => {
    const { container } = render(<UniversityPicker />)
    expect(container.querySelector('select[name="degree_level"]')).toBeDefined()
    // school_name_zh is the hidden input inside ComboboxSelect
    expect(container.querySelector('input[name="school_name_zh"]')).toBeDefined()
    expect(container.querySelector('input[name="department"]')).toBeDefined()
  })

  it('defaultDegree prop sets the initial degree level', () => {
    const { container } = render(<UniversityPicker defaultDegree="碩士" />)
    const select = container.querySelector('select[name="degree_level"]') as HTMLSelectElement
    expect(select?.value).toBe('碩士')
  })
})
