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
  - a fiber makes it easy to determine the next unit of work in the order: child -> sibling -> uncle
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
      - return next fiber in the order child, sibling, uncle
- render and commit
  - since the work is chunked, we can't render until the whole tree is created
  - we need to remove from performUnitOfWork the part where children are appended to the dom
  - in the render fn, define a wipRoot and assign it to nextUnitOfWork
  - in the workLoop, if there is no nextUnitOfWork and there is wipRoot, we call commitRoot
  - define commitRoot fn and commitWork fn
    - commitWork
      - takes in a fiber
      - if falsy, return
      - appends dom to parent dom
      - calls recursively on the child and the sibling
    - commitRoot
      - calls commitWork with wipRoot child
      - sets wipRoot to null
- reconciliation: remove and update nodes
  - we compare the elements we receive in the render fn to the last committed fiber tree
  - in commitRoot fn, save reference to last root in currentRoot
  - in initialized fiber (wipRoot), add alternate prop with currentRoot as value
  - init currentRoot as null
  - define reconcileChildren fn that takes a wipFiber and elements
    - inside, put all code from performUnitOfWork that takes care of creating new fibers
    - to reconcile old and new fibers, we iterate at the same time over elements (new fibers) and old fibers (wipFiber.alternate)
      - there is some boilerplate code associated to iterate over element and oldFiber
        - element = should already be in place
        - oldFiber = get it from wipFiber.alternate.child, then in each loop we reassign it to oldFiber.sibling
      - we compare the element (the thing we want to render) and the oldFiber (the thing we rendered last time)
        - we compare by type
          - same type = keep dom node and update with new props
            - we keep same fiber but update props, add alternate and effectTag: "UPDATE"
          - different type
            - there is a new element = create new DOM node
              - effectTag: "PLACEMENT"
            - there is an old fiber = remove old node
              - here we don't set newFiber because there is none, we set oldFiber effectTag to "DELETION" and push oldFiber to deletions array
  - the deletions array is to keep track of the nodes we need to delete
    - in the render fn we set deletions array to [] and we init it in outer scope
    - in the commitRoot fn we run commitRoot for each fiber in deletions
  - update commitWork to handle effectTags
    - placement: we do same as before (append dom to parent dom)
    - deletion: remove child from dom
    - update: call updateDom fn
  - declare updateDom
    - takes dom, prevProps and nextProps
    - remove old props: set each prop that existed but got removed to ""
    - set new or changed props: set each prop that is new or changed to the new value
    - event listeners (props starting with "on") need to be updated in a special way
      - if event handler changes, we remove it from the dom calling dom.removeEventListener and we add the new one with dom.addEventListener
    - note: isProperty, isNew, isGone and isEvent helpers might... help
- Function components
  - Update rendered element with a fn that returns `<h1>Hi {props.name}</h1>`
    - fiber from fn component has no dom node, and children come from running the fn
  - Update fn performUnitOfWork first part
    - if it's fn component, run updateFunctionComponent else updateHostComponent
      - fn updateHostComponent has the logic that was in performUnitOfWork first part
      - fn updateFunctionComponent
        - gets children by running fn and calls reconcileChildren
  - Update commitWork fn
    - to get the parent dom node, we go up the fiber tree until finding a fiber with a dom node
    - declare a commitDeletion fn and put the code that commits deletions in it
    - in commitDeletion, to find child to remove, keep going down until finding a child with a dom node (call commitDeletion recursively on the child until finding dom)
- Hooks
  - update rendered component to be a Counter fn with a useState hook that increments by one on click
  - define a wipFiber and a hookIndex in the outer scope
  - in updateFunctionComponent, assign the fiber to the wipFiber add a hooks empty array to the wipFiber and assign hookIndex to 0
  - declare useState fn that takes a initial value
    - handle state
      - it gets the oldHook from the previous (alternate) fiber tree (wipFiber) hookIndex-th hook
      - defines a hook with a state whose value is the oldHook state or initial
      - push hook to wipFiber hooks
      - increase the hookIndex
      - return an array with the state
    - handle setState
      - add a queue empty array to the hook
      - inside the useState fn declare setState, which takes action arg
        - push action to queue
        - we set up things so that the work loop can start a new render phase:
          - set a new wipRoot with dom, props and alternate (currentRoot)
          - this wipRoot is the nextUnitOfWork
          - reset deletions array
      - run the actions: for each action in the oldHook queue, assign the hook state to the result of running the action
      - return the setState from useState as second element