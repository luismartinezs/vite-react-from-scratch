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

function createDom(fiber) {
  const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type)

  const isProp = (key: string) => key !== "children"
  Object.keys(fiber.props).filter(isProp).forEach(key => dom[key] = fiber.props[key])

  return dom
}

export function render(element: JSX.Element, container: HTMLElement) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

let nextUnitOfWork = null

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  // TODO add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  // TODO create new fibers
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null

  while (index < elements.length) {
    const element = elements[index]

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }

  // TODO return next unit of work
  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}