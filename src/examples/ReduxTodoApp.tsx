import React from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TodoItem } from '../components/TodoItem'
import { TodoFilter } from '../components/TodoFilter'
import { AddTodo } from '../components/AddTodo'

interface Todo {
  id: string
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

interface TodoState {
  todos: Todo[]
  filter: Filter
}

const initialState: TodoState = {
  todos: [
    { id: '1', text: 'Learn Redux Toolkit', completed: false },
    { id: '2', text: 'Build todo app', completed: true },
    { id: '3', text: 'Compare state managers', completed: false }
  ],
  filter: 'all'
}

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
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(t => !t.completed)
    }
  }
})

const store = configureStore({
  reducer: {
    todos: todoSlice.reducer
  }
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

const { addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted } = todoSlice.actions

const selectTodos = (state: RootState) => state.todos.todos
const selectFilter = (state: RootState) => state.todos.filter
const selectFilteredTodos = (state: RootState) => {
  const { todos, filter } = state.todos
  switch (filter) {
    case 'active': return todos.filter(t => !t.completed)
    case 'completed': return todos.filter(t => t.completed)
    default: return todos
  }
}

const TodoAppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const todos = useSelector(selectTodos)
  const filter = useSelector(selectFilter)
  const filteredTodos = useSelector(selectFilteredTodos)
  
  const handleAddTodo = (text: string) => dispatch(addTodo(text))
  const handleToggleTodo = (id: string) => dispatch(toggleTodo(id))
  const handleDeleteTodo = (id: string) => dispatch(deleteTodo(id))
  const handleSetFilter = (filter: Filter) => dispatch(setFilter(filter))
  const handleClearCompleted = () => dispatch(clearCompleted())
  
  return (
    <div className="todo-app">
      <h2>Redux Toolkit Todo App</h2>
      <div className="todo-stats">
        <span>Total: {todos.length}</span>
        <span>Active: {todos.filter(t => !t.completed).length}</span>
        <span>Completed: {todos.filter(t => t.completed).length}</span>
      </div>
      
      <AddTodo onAdd={handleAddTodo} />
      
      <TodoFilter 
        currentFilter={filter}
        onFilterChange={handleSetFilter}
      />
      
      <div className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </div>
      
      {todos.some(t => t.completed) && (
        <button onClick={handleClearCompleted} className="clear-completed">
          Clear Completed
        </button>
      )}
      
      <div className="implementation-notes">
        <h3>Redux Toolkit Implementation Notes:</h3>
        <ul>
          <li>✅ Excellent DevTools with time-travel debugging</li>
          <li>✅ Immer integration for immutable updates</li>
          <li>✅ Massive ecosystem and middleware support</li>
          <li>✅ Predictable state updates with actions</li>
          <li>✅ Great for complex apps with many developers</li>
          <li>⚠️ More boilerplate (store, slices, selectors)</li>
          <li>⚠️ Requires Provider wrapper</li>
          <li>⚠️ Larger bundle size</li>
        </ul>
      </div>
    </div>
  )
}

export const ReduxTodoApp: React.FC = () => {
  return (
    <Provider store={store}>
      <TodoAppContent />
    </Provider>
  )
}