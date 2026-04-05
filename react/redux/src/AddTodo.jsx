import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "./redux/todoSlice";

const AddTodo = () => {
  const [todo, setTodo] = useState(" ");
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    if (todo === " ") return;
    dispatch(addTask({ text: todo}));
  };
  return (
    <div>
      <input
        type="text"
        placeholder="enter any taks"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      ></input>
      <button onClick={handleClick}>AddTask</button>
    </div>
  );
};

export default AddTodo;
