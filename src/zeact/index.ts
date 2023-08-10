type VDOMNode = {
  type: string;
  props: VDOMProps
};

type VDOMProps = {
  children?: (VDOMNode | string)[];
  nodeValue?: string;
  [key: string]: unknown; // This allows for future expansion of props
};


export function createElement(type: string, props: VDOMProps, ...children: (VDOMNode | string)[]): VDOMNode {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text: string): VDOMNode {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    },
  };
}

export function render(vdom: VDOMNode, container: HTMLElement | null): void {
  const dom = vdom.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(vdom.type);

  const isProperty = (key: string): boolean => key !== "children";

  Object.keys(vdom.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = vdom.props[name];
    });

  vdom.props.children?.forEach(child => {
    if (typeof child === "string") {
      container?.appendChild(document.createTextNode(child));
    } else {
      render(child, dom);
    }
  });


  container?.appendChild(dom);
}
