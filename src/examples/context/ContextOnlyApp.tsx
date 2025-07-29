import React, { createContext, useContext, useReducer, useMemo } from 'react'
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

type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_FILTER'; payload: Filter }
  | { type: 'CLEAR_COMPLETED' }

const initialState: TodoState = {
  todos: [
    { id: '1', text: 'Learn Context API', completed: false },
    { id: '2', text: 'Build todo app', completed: true },
    { id: '3', text: 'Compare patterns', completed: false }
  ],
  filter: 'all'
}

// Reducer function
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now().toString(),
            text: action.payload,
            completed: false
          }
        ]
      }
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      }
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      }
    
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      }
    
    default:
      return state
  }
}

// Context types
interface TodoContextType {
  state: TodoState
  dispatch: React.Dispatch<TodoAction>
  // Computed values
  filteredTodos: Todo[]
  stats: {
    total: number
    active: number
    completed: number
  }
  // Action helpers
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  setFilter: (filter: Filter) => void
  clearCompleted: () => void
}

// Create context
const TodoContext = createContext<TodoContextType | null>(null)

// Provider component
export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  
  // Memoized computed values
  const filteredTodos = useMemo(() => {
    switch (state.filter) {
      case 'active': return state.todos.filter(t => !t.completed)
      case 'completed': return state.todos.filter(t => t.completed)
      default: return state.todos
    }
  }, [state.todos, state.filter])
  
  const stats = useMemo(() => ({
    total: state.todos.length,
    active: state.todos.filter(t => !t.completed).length,
    completed: state.todos.filter(t => t.completed).length
  }), [state.todos])
  
  // Memoized action helpers
  const actions = useMemo(() => ({
    addTodo: (text: string) => dispatch({ type: 'ADD_TODO', payload: text }),
    toggleTodo: (id: string) => dispatch({ type: 'TOGGLE_TODO', payload: id }),
    deleteTodo: (id: string) => dispatch({ type: 'DELETE_TODO', payload: id }),
    setFilter: (filter: Filter) => dispatch({ type: 'SET_FILTER', payload: filter }),
    clearCompleted: () => dispatch({ type: 'CLEAR_COMPLETED' })
  }), [])
  
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    filteredTodos,
    stats,
    ...actions
  }), [state, filteredTodos, stats, actions])
  
  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  )
}

// Custom hook to use the context
const useTodoContext = () => {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodoContext must be used within ContextProvider')
  }
  return context
}

const ContextOnlyContent: React.FC = () => {
  const {
    state,
    filteredTodos,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearCompleted
  } = useTodoContext()
  
  return (
    <div className="todo-app">
      <h2>Context API Only</h2>
      <div className="todo-stats">
        <span>Total: {stats.total}</span>
        <span>Active: {stats.active}</span>
        <span>Completed: {stats.completed}</span>
      </div>
      
      <AddTodo onAdd={addTodo} />
      
      <TodoFilter 
        currentFilter={state.filter}
        onFilterChange={setFilter}
      />
      
      <div className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
      
      {state.todos.some(t => t.completed) && (
        <button onClick={clearCompleted} className="clear-completed">
          Clear Completed
        </button>
      )}
      
      <div className="implementation-notes">
        <h3>Context API Only Implementation Notes:</h3>
        <ul>
          <li>✅ Built into React - no external dependencies</li>
          <li>✅ useReducer for predictable state updates</li>
          <li>✅ useMemo for computed values and performance</li>
          <li>✅ Type-safe with TypeScript</li>
          <li>✅ Great for component tree scoped state</li>
          <li>⚠️ Can cause re-renders if not optimized</li>
          <li>⚠️ Boilerplate for actions and types</li>
          <li>⚠️ No devtools without additional setup</li>
          <li>⚠️ Performance concerns with frequent updates</li>
        </ul>
      </div>
    </div>
  )
}

export const ContextOnlyApp: React.FC = () => {
  return (
    <ContextProvider>
      <ContextOnlyContent />
    </ContextProvider>
  )
}