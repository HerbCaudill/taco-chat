import { Button, Card, CardBody, Select } from '@windmill/react-ui'

export const Chooser = () => {
  return (
    <Card className="max-w-xs">
      <CardBody>
        <Select className="w-full my-3 h-10 text-lg">
          <option>👩🏾 Alice</option>
          <option>👨🏻‍🦲 Bob</option>
          <option>👳🏽‍♂️ Charlie</option>
          <option>👴 Dwight</option>
        </Select>
        <Select className="w-full my-3 h-10 text-lg">
          <option>💻 Laptop</option>
          <option>📱 Phone</option>
        </Select>
        <Button className="w-full block text-lg h-10">Add</Button>
      </CardBody>
    </Card>
  )
}
