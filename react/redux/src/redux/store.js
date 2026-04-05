import { configureStore } from "@reduxjs/toolkit";
import TodoSlice from "./todoSlice.js";

export default configureStore({
  reducer: {
    todos: TodoSlice,
  },
});
