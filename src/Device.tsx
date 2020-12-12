import { Card, CardBody, Label, Input, Button } from '@windmill/react-ui'

export const Device = () => (
  <Card className="max-w-sm">
    <CardBody className="bg-teal-500 text-white text-2xl font-extrabold">Hello</CardBody>
    <CardBody>
      <Label className="text-xs">
        <span>What is your name?</span>
        <Input className="mt-1"></Input>
      </Label>
      <div className="my-3 text-right">
        <Button className="min-w-24">OK</Button>
      </div>
    </CardBody>
  </Card>
)
