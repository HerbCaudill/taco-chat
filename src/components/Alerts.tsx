﻿import { Button, CardBody } from '@windmill/react-ui'
import React, { useState } from 'react'

export const Alerts: React.FC<AlertsProps> = ({ alerts, clearAlert }) => {
  return alerts.length ? (
    <div className="p-2">
      {alerts.map(a => (
        <div key={a.id} className="relative rounded-md bg-gray-100 p-3 pr-12 ">
          <button
            className="
              absolute top-0 right-0 p-1 m-2 leading-none opacity-25 rounded-full 
              text-xs
              hover:opacity-75 
              focus:opacity-100 focus:outline-none focus:shadow-outline-neutral "
            onClick={() => clearAlert(a.id)}
            children="🗙"
          />
          <div className="flex gap-3 align-top">
            <div className="text-xl">💥</div>
            <div className="text-sm font-bold">{a.message}</div>
          </div>
        </div>
      ))}
    </div>
  ) : null
}

export interface AlertInfo {
  id: string
  message: string
  type: 'error' | 'warning' | 'info'
}

interface AlertsProps {
  alerts: AlertInfo[]
  clearAlert: (id: string) => void
}
