import React, { createContext, useContext } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { derive } from 'valtio/utils'
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

// Factory function to create a new store instance
const createTodoStore = () => {
  const state = proxy<TodoState>({
    todos: [
      { id: '1', text: 'Learn Valtio + Context', completed: false },
      { id: '2', text: 'Build todo app', completed: true },
      { id: '3', text: 'Compare patterns', completed: false }
    ],
    filter: 'all'
  })
  
  const derived = derive({
    filteredTodos: (get) => {
      const currentState = get(state)
      switch (currentState.filter) {
        case 'active': return currentState.todos.filter(t => !t.completed)
        case 'completed': return currentState.todos.filter(t => t.completed)
        default: return currentState.todos
      }
    },
    stats: (get) => {
      const todos = get(state).todos
      return {
        total: todos.length,
        active: todos.filter(t => !t.completed).length,
        completed: todos.filter(t => t.completed).length
      }
    }
  })
  
  const actions = {
    addTodo: (text: string) => {
      state.todos.push({
        id: Date.now().toString(),
        text,
        completed: false
      })
    },
    
    toggleTodo: (id: string) => {
      const todo = state.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    
    deleteTodo: (id: string) => {
      const index = state.todos.findIndex(t => t.id === id)
      if (index !== -1) {
        state.todos.splice(index, 1)
      }
    },
    
    setFilter: (filter: Filter) => {
      state.filter = filter
    },
    
    clearCompleted: () => {
      state.todos = state.todos.filter(t => !t.completed)
    }
  }
  
  return { state, derived, actions }
}

type TodoStore = ReturnType<typeof createTodoStore>

// Context for store instance
const TodoContext = createContext<TodoStore | null>(null)

// Provider component
export const ValtioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    throw new Error('useTodoStore must be used within ValtioProvider')
  }
  return store
}

const ValtioContextContent: React.FC = () => {
  const { state, derived, actions } = useTodoStore()
  const snap = useSnapshot(state)
  const derivedSnap = useSnapshot(derived)
  
  return (
    <div className="todo-app">
      <h2>Valtio + Context API</h2>
      <div className="todo-stats">
        <span>Store ID: {state.toString().slice(-8)}</span>
        <span>Total: {derivedSnap.stats.total}</span>
        <span>Active: {derivedSnap.stats.active}</span>
        <span>Completed: {derivedSnap.stats.completed}</span>
      </div>
      
      <AddTodo onAdd={actions.addTodo} />
      
      <TodoFilter 
        currentFilter={snap.filter}
        onFilterChange={actions.setFilter}
      />
      
      <div className="todo-list">
        {derivedSnap.filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={actions.toggleTodo}
            onDelete={actions.deleteTodo}
          />
        ))}
      </div>
      
      {snap.todos.some(t => t.completed) && (
        <button onClick={actions.clearCompleted} className="clear-completed">
          Clear Completed
        </button>
      )}
      
      <div className="implementation-notes">
        <h3>Valtio + Context Implementation Notes:</h3>
        <ul>
          <li>✅ Scoped mutable state per context</li>
          <li>✅ Multiple independent store instances</li>
          <li>✅ Natural mutable API preserved</li>
          <li>✅ Automatic dependency tracking per instance</li>
          <li>✅ Great for component-level state</li>
          <li>✅ Easy to test with isolated stores</li>
          <li>⚠️ Need factory function for instances</li>
          <li>⚠️ Manual store creation required</li>
        </ul>
      </div>
    </div>
  )
}

export const ValtioContextApp: React.FC = () => {
  return (
    <ValtioProvider>
      <ValtioContextContent />
    </ValtioProvider>
  )
}