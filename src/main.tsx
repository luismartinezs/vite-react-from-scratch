import { createElement, render, useState } from "./zeact";
import "./index.css";

const Zeact = {
  createElement,
  render,
  useState,
};

/** @jsx Zeact.createElement */
function Counter() {
  const [state, setState] = Zeact.useState(1);
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
}
const element = <Counter />;
const container = document.getElementById("root");
Zeact.render(element, container);
