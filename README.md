# React from scratch

Amazing guide to build the basic features of React from scratch https://pomb.us/build-your-own-react/

## Step by step

- Review
  - We render a simple h1 with react as jsx
  - Replace the jsx expression with JS DOM
    - an object of type: `{ type, props: { children, ...otherProps }}`
  - Replace ReactDOM.render with JS DOM
    - Create a node from element with `document.createElement`
    - The text node is created with `document.createTextNode`
- createElement fn
  - let's start with div#foo>a{bar}+b
  - A function createElement takes in args: (type, props, ...children) and returns and element object
  - Define the function createElement to that effect
    - the type is just the type
    - the props spread inside the props object
    - the children need a conditional
      - if child is object, then child
      - else that means child is text, so run createTextElement
  - Define function createTextElement
    - Take text as arg
    - return an object with type: TEXT_ELEMENT and props: { nodeValue: text }
  - Replace the createElement call by jsx and add this annotation /** @jsx Zeact.createElement */ so that babel transpiles the jsx
- Render fn
  - Declare a render fn that takes in element and container and returns DOM nodes
    - create the node (dom) from the element
      - if is a text element, create a text node, else, create an element node
    - for each property that is not children, set the property on the node
    - for each child, render it on the dom recursively calling render
    - append dom node to container
- Concurrent mode
  - To avoid the render of the element tree to block the client, we split the work into chunks
  - declare a fn workLoop that takes in a "deadline"
    - the fn will be called like this `requestIdleCallback(workLoop)`
      - requestIdleCallback is a browser API that runs callback during idle periods
      - it passes a 'IdleDeadline' to the callback with a `timeRemaining` method that returns number of ms remaining in current idle period
    - the fn calls another fn performUnitOfWork that takes in a nextUnitOfWork and returns a nextUnitOfWork
    - performUnitOfWork should be called recursively for as long as:
      - there is a nextUnitOfWork
      - timeRemaining() >= 1
    - if we exit the recursion, then we call again requestIdleCallback(workLoop) to continue with the work when the client is idle
- Fibers
  - Fiber is a data structure to organize the units of work
  - render fn creates root fiber and sets first unit of work
  - a "unit of work" is:
    - add el to dom
    - create fibers for children
    - select next unit of work
  - a fiber makes it easy to determine the next unit of work in the order: child -> sibling -> parent
  - update render fn
    - put code that creates dom node in separate fn createDom, remove the rest
    - render fn will set the first fiber from args
      - the fiber will have dom (container) and props with children array (element)
  - the performUnitOfWork fn will
    - add dom node
      - if fiber does not have dom, we call createDom fn
      - if fiber has parent, we append fiber dom to parent dom
    - create new fibers
      - for each fiber child
        - we create a new fiber with type, props, parent and dom values
        - we assign the first child to be the fiber child
        - we assign the rest of children to be the sibling of the previous child
    - return next unit of work
      - return next fiber in the order child, sibling, parent