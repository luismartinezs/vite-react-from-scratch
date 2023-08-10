import { createElement, render } from "./zeact";
import "./index.css";

const Zeact = {
  createElement,
  render,
};

/** @jsx Zeact.createElement */
const element = <h1 id="foo">Hello world</h1>;

const container = document.getElementById("root");
Zeact.render(element, container);
