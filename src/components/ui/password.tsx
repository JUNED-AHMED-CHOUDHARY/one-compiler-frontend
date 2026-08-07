import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

type PasswordProps = React.ComponentProps<typeof InputGroupInput> & {
  groupClassName?: string
}

export function Password({ className, groupClassName, ...props }: PasswordProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  return (
    <InputGroup className={groupClassName}>
      <InputGroupInput
        placeholder="password"
        type={isVisible ? 'text' : 'password'}
        className={className}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={toggleVisibility}>
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
