import React, { createContext, useContext } from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TodoItem } from '../../components/TodoItem'
import { TodoFilter } from '../../components/TodoFilter'
import { AddTodo } from '../../components/AddTodo'

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
    { id: '1', text: 'Learn Redux + Context', completed: false },
    { id: '2', text: 'Build todo app', completed: true },
    { id: '3', text: 'Compare patterns', completed: false }
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

// Create store factory
const createStore = () => configureStore({
  reducer: {
    todos: todoSlice.reducer
  }
})

type AppStore = ReturnType<typeof createStore>
type RootState = ReturnType<AppStore['getState']>
type AppDispatch = AppStore['dispatch']

// Context for store instance
const StoreContext = createContext<AppStore | null>(null)

// Provider component
export const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createStore()
  
  return (
    <StoreContext.Provider value={store}>
      <Provider store={store}>
        {children}
      </Provider>
    </StoreContext.Provider>
  )
}

// Custom hook to access store instance
const useStoreInstance = () => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useStoreInstance must be used within ReduxProvider')
  }
  return store
}

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

const ReduxContextContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const storeInstance = useStoreInstance()
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
      <h2>Redux + Context API</h2>
      <div className="todo-stats">
        <span>Store ID: {storeInstance.toString().slice(-8)}</span>
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
        <h3>Redux + Context Implementation Notes:</h3>
        <ul>
          <li>✅ Multiple store instances via Context</li>
          <li>✅ Full Redux DevTools per instance</li>
          <li>✅ Perfect for micro-frontends</li>
          <li>✅ Isolated state between instances</li>
          <li>✅ Server-side rendering support</li>
          <li>⚠️ Double provider pattern needed</li>
          <li>⚠️ More complex setup than global store</li>
          <li>⚠️ Memory overhead per instance</li>
        </ul>
      </div>
    </div>
  )
}

export const ReduxContextApp: React.FC = () => {
  return (
    <ReduxProvider>
      <ReduxContextContent />
    </ReduxProvider>
  )
}