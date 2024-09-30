import React, { ReactNode } from 'react'

interface IIf {
  children?: ReactNode | (() => ReactNode)
  render?: () => ReactNode
  otherwise?: () => ReactNode
  condition?: boolean | (() => boolean)
}

const displayName = 'If'

const isEmptyChildren = (children: ReactNode) =>
  React.Children.count(children) === 0

const If = ({
  children,
  condition,
  otherwise = () => undefined,
  render,
}: IIf) => {
  const evaluatedCondition =
    typeof condition === 'function' ? condition() : condition

  if (evaluatedCondition) {
    if (render) {
      return render()
    }

    if (children) {
      if (typeof children === 'function') {
        return children()
      }

      return isEmptyChildren(children) ? null : React.Children.only(children)
    }

    return null
  }

  return otherwise()
}

If.displayName = displayName

export default If
