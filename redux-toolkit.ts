import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'

// State shape
interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
}

const initialState: TodoState = {
  todos: [],
  filter: 'all'
}

// Slice with reducers
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: Date.now().toString(),
        text: action.payload,
        completed: false
      })
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload)
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(t => !t.completed)
    }
  }
})

// Store
export const store = configureStore({
  reducer: {
    todos: todoSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Actions
export const { addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted } = todoSlice.actions

// Selectors
export const selectTodos = (state: RootState) => state.todos.todos
export const selectFilter = (state: RootState) => state.todos.filter
export const selectFilteredTodos = (state: RootState) => {
  const { todos, filter } = state.todos
  switch (filter) {
    case 'active': return todos.filter(t => !t.completed)
    case 'completed': return todos.filter(t => t.completed)
    default: return todos
  }
}

// Hook usage example
export const useTodos = () => {
  const dispatch = useDispatch<AppDispatch>()
  const todos = useSelector(selectFilteredTodos)
  const filter = useSelector(selectFilter)
  
  return {
    todos,
    filter,
    addTodo: (text: string) => dispatch(addTodo(text)),
    toggleTodo: (id: string) => dispatch(toggleTodo(id)),
    deleteTodo: (id: string) => dispatch(deleteTodo(id)),
    setFilter: (filter: 'all' | 'active' | 'completed') => dispatch(setFilter(filter)),
    clearCompleted: () => dispatch(clearCompleted())
  }
}

/*
COMPARISON NOTES:
- Boilerplate: High (store setup, slice definition, types)
- Granular Reactivity: Component-level (useSelector)
- Complex State: Excellent (normalized state, async middleware)
- Dev Tools: Excellent (Redux DevTools)
- Community: Largest ecosystem
- Learning Curve: Steep
- Bundle Size: Large
*/