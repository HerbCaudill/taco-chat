import { Button, Card, CardBody, Select } from '@windmill/react-ui'

export const Chooser = ({ onSelect }: ChooserProps) => {
  return (
    <div className="px-3">
      <div className="flex">
        <Select className="w-full flex-grow my-3 mr-3 h-10 font-normal text-lg">
          <option>👩🏾 Alice</option>
          <option>👨🏻‍🦲 Bob</option>
          <option>👳🏽‍♂️ Charlie</option>
          <option>👴 Dwight</option>
        </Select>
        <Select className="w-full flex-1 min-w-24 my-3 h-10 text-lg">
          <option>💻</option>
          <option>📱</option>
        </Select>
      </div>
      <Button className="w-full block text-lg h-10">Add</Button>
    </div>
  )
}

interface ChooserProps {
  onSelect: () => {}
}
