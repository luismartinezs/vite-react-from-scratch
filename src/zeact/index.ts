export function createElement(type: string, props?: unknown, ...children: (Element | string)[]) {
  return {
    type,
    props: {
      ...(props ? props : {}),
      children: children ? children.map(child => typeof child === 'object' ? child : createTextElement(child)) : []
    }
  }
}

function createTextElement(text: string) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

export function render(element: JSX.Element, container: HTMLElement) {
  const node = element.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)

  const isProp = (key: string) => key !== "children"
  Object.keys(element.props).filter(isProp).forEach(key => node[key] = element.props[key])

  element.props.children?.forEach(child => render(child, node))

  container.appendChild(node)

}