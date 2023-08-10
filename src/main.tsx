import { createElement, render, useState, useEffect } from "./zeact";
import "./index.css";

const Zeact = {
  createElement,
  render,
  useState,
  useEffect,
};

const todos = ["do chore 1", "do chore 2"];

/** @jsx Zeact.createElement */
function Counter() {
  const [state, setState] = Zeact.useState(1);
  // const [text, setText] = Zeact.useState("");

  // Zeact.useEffect(() => {
  // This crashes the app
  //   setText(() => (state % 2 === 0 ? "even" : "odd"));
  // }, [state]);

  Zeact.useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div>
      <h1
        style={{
          textTransform: "uppercase",
        }}
      >
        React from scratch
      </h1>
      <button className="button" onClick={() => setState((c: number) => c + 1)}>
        Count: {state}
      </button>
      {/* <div>Text updated from effect hook: {text}</div> */}
      {todos.map((todo) => (
        <div>{todo}</div>
      ))}
    </div>
  );
}

const element = <Counter />;
const container = document.getElementById("root");
Zeact.render(element, container);
