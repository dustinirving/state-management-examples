import React, { createContext, useContext } from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { TodoItem } from '../../components/TodoItem'
import { TodoFilter } from '../../components/TodoFilter'
import { AddTodo } from '../../components/AddTodo'

interface Todo {
  id: string
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

interface TodoStore {
  todos: Todo[]
  filter: Filter
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  setFilter: (filter: Filter) => void
  clearCompleted: () => void
  filteredTodos: () => Todo[]
}

// Create Zustand store
const createTodoStore = () => create<TodoStore>()(
  devtools((set, get) => ({
    todos: [
      { id: '1', text: 'Learn Zustand + Context', completed: false },
      { id: '2', text: 'Build todo app', completed: true },
      { id: '3', text: 'Compare patterns', completed: false }
    ],
    filter: 'all',
    
    addTodo: (text: string) =>
      set((state) => ({
        todos: [...state.todos, {
          id: Date.now().toString(),
          text,
          completed: false
        }]
      }), false, 'addTodo'),
    
    toggleTodo: (id: string) =>
      set((state) => ({
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      }), false, 'toggleTodo'),
    
    deleteTodo: (id: string) =>
      set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
      }), false, 'deleteTodo'),
    
    setFilter: (filter) =>
      set({ filter }, false, 'setFilter'),
    
    clearCompleted: () =>
      set((state) => ({
        todos: state.todos.filter(todo => !todo.completed)
      }), false, 'clearCompleted'),
    
    filteredTodos: () => {
      const { todos, filter } = get()
      switch (filter) {
        case 'active': return todos.filter(t => !t.completed)
        case 'completed': return todos.filter(t => t.completed)
        default: return todos
      }
    }
  }))
)

// Create Context
const TodoContext = createContext<ReturnType<typeof createTodoStore> | null>(null)

// Provider component
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createTodoStore()
  
  return (
    <TodoContext.Provider value={store}>
      {children}
    </TodoContext.Provider>
  )
}

// Custom hook to use the store
const useTodoStore = () => {
  const store = useContext(TodoContext)
  if (!store) {
    throw new Error('useTodoStore must be used within TodoProvider')
  }
  return store()
}

const ZustandContextContent: React.FC = () => {
  const store = useTodoStore()
  const filteredTodos = store.filteredTodos()
  
  return (
    <div className="todo-app">
      <h2>Zustand + Context API</h2>
      <div className="todo-stats">
        <span>Total: {store.todos.length}</span>
        <span>Active: {store.todos.filter(t => !t.completed).length}</span>
        <span>Completed: {store.todos.filter(t => t.completed).length}</span>
      </div>
      
      <AddTodo onAdd={store.addTodo} />
      
      <TodoFilter 
        currentFilter={store.filter}
        onFilterChange={store.setFilter}
      />
      
      <div className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={store.toggleTodo}
            onDelete={store.deleteTodo}
          />
        ))}
      </div>
      
      {store.todos.some(t => t.completed) && (
        <button onClick={store.clearCompleted} className="clear-completed">
          Clear Completed
        </button>
      )}
      
      <div className="implementation-notes">
        <h3>Zustand + Context Implementation Notes:</h3>
        <ul>
          <li>✅ Scoped state via Context Provider</li>
          <li>✅ Multiple independent instances possible</li>
          <li>✅ Server-side rendering friendly</li>
          <li>✅ Easy to test with mock providers</li>
          <li>✅ Same Zustand DX with Context scoping</li>
          <li>⚠️ Slight overhead from Context wrapping</li>
          <li>⚠️ Need to manage provider placement</li>
        </ul>
      </div>
    </div>
  )
}

export const ZustandContextApp: React.FC = () => {
  return (
    <TodoProvider>
      <ZustandContextContent />
    </TodoProvider>
  )
}