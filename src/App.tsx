import React from 'react'
import { Button, Card, CardBody, Input, Label } from '@windmill/react-ui'

export const App = () => {
  return (
    <div className="p-3">
      <Card className="max-w-sm">
        <CardBody className="bg-teal-500 text-white text-2xl font-extrabold">Hello</CardBody>
        <CardBody>
          <Label className="text-xs">
            <span>What is your name?</span>
            <Input className="mt-1"></Input>
          </Label>
          <div className="my-3 text-right">
            <Button>OK</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
