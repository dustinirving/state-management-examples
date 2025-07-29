import React, { createContext, useContext } from 'react'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { TodoItem } from '../../components/TodoItem'
import { TodoFilter } from '../../components/TodoFilter'
import { AddTodo } from '../../components/AddTodo'

interface Todo {
  id: string
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

// Store class
class TodoStore {
  todos: Todo[] = [
    { id: '1', text: 'Learn MobX + Context', completed: false },
    { id: '2', text: 'Build todo app', completed: true },
    { id: '3', text: 'Compare patterns', completed: false }
  ]
  filter: Filter = 'all'
  
  constructor() {
    makeAutoObservable(this)
  }
  
  // Computed values
  get filteredTodos() {
    switch (this.filter) {
      case 'active': return this.todos.filter(t => !t.completed)
      case 'completed': return this.todos.filter(t => t.completed)
      default: return this.todos
    }
  }
  
  get stats() {
    return {
      total: this.todos.length,
      active: this.todos.filter(t => !t.completed).length,
      completed: this.todos.filter(t => t.completed).length
    }
  }
  
  // Actions
  addTodo = (text: string) => {
    this.todos.push({
      id: Date.now().toString(),
      text,
      completed: false
    })
  }
  
  toggleTodo = (id: string) => {
    const todo = this.todos.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }
  
  deleteTodo = (id: string) => {
    const index = this.todos.findIndex(t => t.id === id)
    if (index !== -1) {
      this.todos.splice(index, 1)
    }
  }
  
  setFilter = (filter: Filter) => {
    this.filter = filter
  }
  
  clearCompleted = () => {
    this.todos = this.todos.filter(t => !t.completed)
  }
}

// Context for store instance
const TodoContext = createContext<TodoStore | null>(null)

// Provider component
export const MobXProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = new TodoStore()
  
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
    throw new Error('useTodoStore must be used within MobXProvider')
  }
  return store
}

const MobXContextContent: React.FC = observer(() => {
  const store = useTodoStore()
  
  return (
    <div className="todo-app">
      <h2>MobX + Context API</h2>
      <div className="todo-stats">
        <span>Store ID: {store.toString().slice(-8)}</span>
        <span>Total: {store.stats.total}</span>
        <span>Active: {store.stats.active}</span>
        <span>Completed: {store.stats.completed}</span>
      </div>
      
      <AddTodo onAdd={store.addTodo} />
      
      <TodoFilter 
        currentFilter={store.filter}
        onFilterChange={store.setFilter}
      />
      
      <div className="todo-list">
        {store.filteredTodos.map(todo => (
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
        <h3>MobX + Context Implementation Notes:</h3>
        <ul>
          <li>✅ Scoped reactive stores per context</li>
          <li>✅ Multiple independent store instances</li>
          <li>✅ Object-oriented approach maintained</li>
          <li>✅ Computed values work per instance</li>
          <li>✅ Great for complex business logic</li>
          <li>✅ Natural dependency injection pattern</li>
          <li>⚠️ Still need observer wrapper</li>
          <li>⚠️ Class instantiation in provider</li>
          <li>⚠️ Memory overhead per instance</li>
        </ul>
      </div>
    </div>
  )
})

export const MobXContextApp: React.FC = () => {
  return (
    <MobXProvider>
      <MobXContextContent />
    </MobXProvider>
  )
}