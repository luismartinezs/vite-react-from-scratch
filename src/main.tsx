import { createElement, render } from "./zeact";
import "./index.css";

const Zeact = {
  createElement,
  render,
};

/** @jsx Zeact.createElement */
function App(props) {
  return <h1>Hi {props.name}</h1>;
}
const element = <App name="foo" />;
const container = document.getElementById("root") as HTMLElement;
Zeact.render(element, container);
