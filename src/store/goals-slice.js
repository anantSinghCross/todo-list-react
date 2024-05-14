import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* 
Initial state structure would look like below
goals:[
  {
    title: string,
    desc: string,
    targetDate: Date,
    progress: number,
    tasks: [
      {
        completed: boolean,
        text: string,
        subTasks: [
          {
            completed: boolean,
            text: string,
          },
          ...
        ]
      },
      ...
    ]
  },
  ...
]
*/

const goalsSlice = createSlice({
  name: "goals",
  initialState: [],
  reducers: {
    addGoal: {
      reducer: (state, action) => {
        state.unshift(action.payload);
      },
      prepare: (goal) => {
        return { ...goal, id: Math.trunc(Math.random()*100000000)}
      }
    },
    deleteGoal: (state, actions) => {
      const id = action.payload;
      return state.filter(item => item.id != id)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGoals.fulfilled, (state, action) => {
      console.log('Fetch successful!')
    })
  }
});

const fetchGoals = createAsyncThunk('goals/fetchGoals', (_, thunkApi) => {
  console.log('Fetching goals-');
})

const { addGoal, deleteGoal } = goalsSlice.actions;
export { addGoal, deleteGoal, fetchGoals }
export default goalsSlice;