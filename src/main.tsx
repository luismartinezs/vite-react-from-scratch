import { createElement, render } from "./zeact";
import "./index.css";

const Zeact = {
  createElement,
  render,
};

/** @jsx Zeact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

console.log(element);

const container = document.getElementById("root") as HTMLElement;

Zeact.render(element, container);
