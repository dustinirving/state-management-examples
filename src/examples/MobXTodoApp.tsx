import React from 'react'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { TodoItem } from '../components/TodoItem'
import { TodoFilter } from '../components/TodoFilter'
import { AddTodo } from '../components/AddTodo'

interface Todo {
  id: string
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

class TodoStore {
  todos: Todo[] = [
    { id: '1', text: 'Learn MobX', completed: false },
    { id: '2', text: 'Build todo app', completed: true },
    { id: '3', text: 'Compare state managers', completed: false }
  ]
  filter: Filter = 'all'
  
  constructor() {
    makeAutoObservable(this)
  }
  
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

const todoStore = new TodoStore()

const MobXTodoAppContent: React.FC = observer(() => {
  return (
    <div className="todo-app">
      <h2>MobX Todo App</h2>
      <div className="todo-stats">
        <span>Total: {todoStore.stats.total}</span>
        <span>Active: {todoStore.stats.active}</span>
        <span>Completed: {todoStore.stats.completed}</span>
      </div>
      
      <AddTodo onAdd={todoStore.addTodo} />
      
      <TodoFilter 
        currentFilter={todoStore.filter}
        onFilterChange={todoStore.setFilter}
      />
      
      <div className="todo-list">
        {todoStore.filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={todoStore.toggleTodo}
            onDelete={todoStore.deleteTodo}
          />
        ))}
      </div>
      
      {todoStore.todos.some(t => t.completed) && (
        <button onClick={todoStore.clearCompleted} className="clear-completed">
          Clear Completed
        </button>
      )}
      
      <div className="implementation-notes">
        <h3>MobX Implementation Notes:</h3>
        <ul>
          <li>✅ Object-oriented approach with classes</li>
          <li>✅ Computed values with getter methods</li>
          <li>✅ Automatic dependency tracking</li>
          <li>✅ Excellent DevTools support</li>
          <li>✅ Great for complex business logic</li>
          <li>✅ Mature ecosystem and patterns</li>
          <li>⚠️ Requires observer wrapper for components</li>
          <li>⚠️ Learning curve for reactive concepts</li>
          <li>⚠️ Larger bundle size (~15kb)</li>
        </ul>
      </div>
    </div>
  )
})

export const MobXTodoApp: React.FC = () => {
  return <MobXTodoAppContent />
}