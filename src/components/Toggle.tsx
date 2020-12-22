import React from 'react'

export const Toggle: React.FC<ToggleProps> = ({ on, disabled = false, onClick }: ToggleProps) => {
  const opacity = disabled ? 'opacity-25' : 'opacity-100'
  const background = on ? 'bg-green-600 ' : 'bg-gray-600 '
  const translate = on ? 'translate-x-3' : 'translate-x-0'
  const noOp = () => {}
  return (
    <span
      role="checkbox"
      aria-checked={on}
      aria-disabled={disabled}
      className={`${opacity} group relative inline-flex items-center justify-center 
        flex-shrink-0 h-4 w-6 cursor-pointer focus:outline-none`}
      onClick={disabled ? noOp : onClick}
    >
      <span
        aria-hidden="true"
        className={`${background} rounded-full 
          absolute h-2 w-full mx-auto 
          transition-colors ease-in-out duration-200`}
      ></span>
      <span
        aria-hidden="true"
        className={`${translate} transform 
          absolute left-0 inline-block h-3 w-3 
          border border-gray-200 rounded-full bg-white shadow
          group-focus:shadow-outline group-focus:border-blue-300
          transition-transform ease-in-out duration-200`}
      ></span>
    </span>
  )
}
interface ToggleProps {
  on: boolean
  disabled?: boolean
  onClick?: () => void
}
