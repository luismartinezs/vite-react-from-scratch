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
  return (
    <div>
      <h1>React from scratch</h1>
      <button className="button" onClick={() => setState((c: number) => c + 1)}>
        Count: {state}
      </button>
    </div>
  );
}

const element = <Counter />;
const container = document.getElementById("root");
Zeact.render(element, container);
