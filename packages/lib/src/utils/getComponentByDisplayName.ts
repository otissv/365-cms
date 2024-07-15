import React from "react"

export function getComponentByDisplayName({
  children,
  displayName,
  props,
}: {
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
  displayName: string
  props?: Record<string, any>
}) {
  const node = Array.isArray(children) ? children : [children]

  const element = node.find((c) => c.type.displayName === displayName)

  if (displayName === "TwoColumnLayoutImage" && element) {
    return React.cloneElement(
      element,
      { ...props, ...element?.props },
      element?.children
    )
  }
  return element
}
