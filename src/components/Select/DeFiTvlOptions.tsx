import { extraTvlOptions } from 'components/SettingsModal'
import { useGetExtraTvlEnabled, useTvlToggles } from 'contexts/LocalStorage'
import styled from 'styled-components'
import {
  Select as AriaSelect,
  SelectItem,
  SelectLabel,
  SelectPopover,
  useSelectState,
  SelectArrow,
  SelectItemCheck,
} from 'ariakit/select'

export const WrapperWithLabel = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
`

export const Label = styled(SelectLabel)`
  color: ${({ theme }) => theme.text1};
  font-weight: 400;
  font-size: 0.75rem;
  opacity: 0.8;
  white-space: nowrap;
`

export const SelectMenu = styled(AriaSelect)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: ${({ theme }) => theme.bg6};
  color: ${({ theme }) => theme.text1};
  padding: 12px;
  border-radius: 12px;
  border: none;
  box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 0px 1px rgba(0, 0, 0, 0.04);
  margin: 0;
  width: 200px;

  & > *:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :focus-visible,
  &[data-focus-visible] {
    outline: ${({ theme }) => '1px solid ' + theme.text4};
  }
`
export const Popover = styled(SelectPopover)`
  background: ${({ theme }) => theme.bg6};
  color: ${({ theme }) => theme.text1};
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 0px 1px rgba(0, 0, 0, 0.04);
  margin: 0;
  z-index: 100;

  :focus-visible,
  &[data-focus-visible] {
    outline: ${({ theme }) => '1px solid ' + theme.text4};
  }
`
export const Item = styled(SelectItem)`
  padding: 12px 4px;
  display: flex;
  align-items: center;
  gap: 4px;

  :hover,
  &[data-focus-visible] {
    outline: none;
    background: ${({ theme }) => theme.bg3};
  }
`

const extraTvls = extraTvlOptions.map((g) => ({ label: g.name, value: g.key }))

function renderValue(value: string[]) {
  if (value.length === 0) return 'No option selected'
  if (value.length === 1) return extraTvls.find((e) => e.value === value[0])?.label ?? value[0]
  return `${value.length} options selected`
}

export function DeFiTvlOptions(props) {
  const tvlToggles = useTvlToggles()

  const extraTvlsEnabled = useGetExtraTvlEnabled()

  const fitlers = { ...extraTvlsEnabled }

  const options = extraTvls.map((e) => e.value)

  const selectedOptions = Object.keys(fitlers).filter((key) => fitlers[key])

  const onChange = (values) => {
    if (values.length < selectedOptions.length) {
      const off = selectedOptions.find((o) => !values.includes(o))
      tvlToggles(off)()
    } else {
      const on = values.find((o) => !selectedOptions.includes(o))
      tvlToggles(on)()
    }
  }

  const select = useSelectState({
    value: selectedOptions,
    setValue: onChange,
    defaultValue: selectedOptions,
    sameWidth: true,
    gutter: 8,
  })

  return (
    <WrapperWithLabel {...props}>
      <Label state={select}>INCLUDE IN TVL</Label>
      <SelectMenu state={select}>
        <span>{renderValue(select.value)}</span>
        <SelectArrow />
      </SelectMenu>
      {select.mounted && (
        <Popover state={select}>
          {options.map((value) => (
            <Item key={value} value={value}>
              <SelectItemCheck />
              {renderValue([value])}
            </Item>
          ))}
        </Popover>
      )}
    </WrapperWithLabel>
  )
}