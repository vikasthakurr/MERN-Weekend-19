import { createSlice, nanoid } from "@reduxjs/toolkit";

export const TodoSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      const newTodo = {
        id: nanoid(),
        text: action.payload.text,
        completed: false,
      };
      state.push(newTodo);
    },
    // removeTodo: (state, action) => {
    //   //todo -> logic
    // },
    // updatetodo: (state, action) => {
    //   //todo =>logic
    // },
    removeAll: () => {
      return [];
    },
  },
});

export const { addTask, removeAll } = TodoSlice.actions;

export default TodoSlice.reducer;
