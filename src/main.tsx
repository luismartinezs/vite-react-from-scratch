import { createElement, render, useState } from "./zeact";
import "./index.css";

const Zeact = {
  createElement,
  render,
  useState,
};

const todos = ["do chore 1", "do chore 2"];

/** @jsx Zeact.createElement */
function Counter() {
  const [state, setState] = Zeact.useState(1);
  return (
    <div>
      <h1>React from scratch</h1>
      <button className="button" onClick={() => setState((c: number) => c + 1)}>
        Count: {state}
      </button>
      {todos.map((todo) => (
        <div>{todo}</div>
      ))}
    </div>
  );
}

const element = <Counter />;
const container = document.getElementById("root");
Zeact.render(element, container);
