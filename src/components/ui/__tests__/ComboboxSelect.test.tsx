import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ComboboxSelect from '../ComboboxSelect'

const mockOptions = [
  { value: 'ntu', labelZh: '國立臺灣大學', labelEn: 'National Taiwan University' },
  { value: 'nthu', labelZh: '國立清華大學', labelEn: 'National Tsing Hua University' },
  { value: 'python', labelZh: 'Python', labelEn: 'Python' },
  { value: 'react', labelZh: 'React', labelEn: 'React Framework' },
]

describe('ComboboxSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with label and placeholder', () => {
    render(
      <ComboboxSelect
        label="學校"
        name="school"
        options={mockOptions}
        placeholder="請輸入學校名稱"
      />
    )
    expect(screen.getByText('學校')).toBeDefined()
    expect(screen.getByPlaceholderText('請輸入學校名稱')).toBeDefined()
  })

  it('clicking input opens dropdown with all options', async () => {
    render(
      <ComboboxSelect
        label="學校"
        name="school"
        options={mockOptions}
      />
    )
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    expect(screen.getByRole('listbox')).toBeDefined()
    // Use getAllByText since Python appears as both labelZh and labelEn
    expect(screen.getAllByText('國立臺灣大學').length).toBeGreaterThan(0)
    expect(screen.getAllByText('React').length).toBeGreaterThan(0)
  })

  it('typing filters options by Chinese label', async () => {
    render(
      <ComboboxSelect
        label="學校"
        name="school"
        options={mockOptions}
      />
    )
    const input = screen.getByRole('combobox')
    await userEvent.type(input, '清華')
    expect(screen.getByRole('listbox')).toBeDefined()
    expect(screen.getAllByText('國立清華大學').length).toBeGreaterThan(0)
    // NTU should not appear
    expect(screen.queryByText('國立臺灣大學')).toBeNull()
  })

  it('typing filters options by English label', async () => {
    render(
      <ComboboxSelect
        label="學校"
        name="school"
        options={mockOptions}
      />
    )
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'Framework')
    // React Framework should match
    expect(screen.getAllByText('React').length).toBeGreaterThan(0)
    // NTU should not be visible
    expect(screen.queryByText('國立臺灣大學')).toBeNull()
  })

  it('selecting an option closes dropdown and updates displayed value', async () => {
    render(
      <ComboboxSelect
        label="學校"
        name="school"
        options={mockOptions}
      />
    )
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    // React option: labelZh is 'React', click it
    const optionEl = screen.getAllByText('React')[0]
    fireEvent.mouseDown(optionEl)
    // Input should now show 'React'
    expect((input as HTMLInputElement).value).toBe('React')
    // Dropdown should be closed
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('pressing Escape closes dropdown', async () => {
    render(
      <ComboboxSelect
        label="學校"
        name="school"
        options={mockOptions}
      />
    )
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    expect(screen.getByRole('listbox')).toBeDefined()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('allowFreeInput=true: shows "使用 [inputText]" option when no match', async () => {
    render(
      <ComboboxSelect
        label="學校"
        name="school"
        options={mockOptions}
        allowFreeInput={true}
      />
    )
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'xyz_no_match')
    expect(screen.getAllByText(/使用/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/xyz_no_match/).length).toBeGreaterThan(0)
  })

  it('allowFreeInput=true: selecting "使用 [value]" sets the value correctly', async () => {
    render(
      <ComboboxSelect
        label="學校"
        name="school"
        options={mockOptions}
        allowFreeInput={true}
      />
    )
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'CustomSchool')
    const freeOption = screen.getAllByText(/使用/)[0]
    fireEvent.mouseDown(freeOption)
    expect((input as HTMLInputElement).value).toBe('CustomSchool')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('name input has correct form value after selection', async () => {
    const { container } = render(
      <ComboboxSelect
        label="學校"
        name="school"
        options={mockOptions}
      />
    )
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    // Click Python (labelZh)
    const allPython = screen.getAllByText('Python')
    // First one is the labelZh div inside <li role="option">
    fireEvent.mouseDown(allPython[0])
    const hiddenInput = container.querySelector('input[type="hidden"][name="school"]') as HTMLInputElement
    expect(hiddenInput).toBeDefined()
    expect(hiddenInput.value).toBe('python')
  })

  it('onValueChange callback is called when option is selected', async () => {
    const onValueChange = vi.fn()
    render(
      <ComboboxSelect
        label="學校"
        name="school"
        options={mockOptions}
        onValueChange={onValueChange}
      />
    )
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    const reactOptions = screen.getAllByText('React')
    fireEvent.mouseDown(reactOptions[0])
    expect(onValueChange).toHaveBeenCalledWith('react')
  })

  it('required marker (*) is shown when required=true', () => {
    render(
      <ComboboxSelect
        label="必填欄位"
        name="required_field"
        options={mockOptions}
        required={true}
      />
    )
    expect(screen.getByText('*')).toBeDefined()
  })

  it('clicking outside closes dropdown', async () => {
    render(
      <div>
        <ComboboxSelect
          label="學校"
          name="school"
          options={mockOptions}
        />
        <div data-testid="outside">outside</div>
      </div>
    )
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    expect(screen.getByRole('listbox')).toBeDefined()
    fireEvent.mouseDown(screen.getByTestId('outside'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })
})
