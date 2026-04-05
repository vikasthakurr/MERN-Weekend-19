import React from "react";
import { useSelector } from "react-redux";

const Demo = () => {
  const data = useSelector((state) => state.todos);
  console.log(data);
  return <div>Demo</div>;
};

export default Demo;
