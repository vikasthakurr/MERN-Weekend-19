import React, { useRef, useEffect } from "react";
import { useState } from "react";

const App = () => {
  // console.log("api called");
  const [count, setCount] = useState(0);
  // useLayoutEffect(() => {
  //   console.log("system connected");
  //   return function () {
  //     console.log("system disconnected");
  //   };
  // }, [count]);
  // let count = 5;
  // console.log(useState);
  // let value = 0;

  const ref = useRef();
  const ref1 = useRef();
  useEffect(() => {
    ref.current.style.backgroundColor = "Red";
    ref1.current.style.backgroundColor = "yellow";
  }, []);
  // console.log(ref.current);

  const handleClick = () => {
    // count = count - 1;
    // console.log(count);
    setCount(count + 1);
    // value = value + 1;
    // console.log(value);
    // ref.current = ref.current + 1;
    // console.log(ref.current);
  };
  return (
    <div>
      <h1 ref={ref}>the value of count is:{count}</h1>
      {/* {ref.current.style.backgroundColor="red"} */}
      <button ref={ref1} onClick={handleClick}>
        change
      </button>
    </div>
  );
};

export default App;
