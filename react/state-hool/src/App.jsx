import React from "react";
import { useState } from "react";

const App = () => {
  console.log("api called");
  // let count = 5;
  // console.log(useState);
  const [count, setCount] = useState(5);
  const handleClick = () => {
    // count = count - 1;
    // console.log(count);
    setCount(count - 1);
    console.log(count);
  };
  return (
    <div>
      <h1>the value of count is:{count}</h1>
      <button onClick={handleClick}>change</button>
    </div>
  );
};

export default App;
