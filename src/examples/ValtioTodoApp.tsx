import React from 'react'
import { proxy, useSnapshot } from 'valtio'
import { derive } from 'valtio/utils'
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

const todoState = proxy<TodoState>({
  todos: [
    { id: '1', text: 'Learn Valtio', completed: false },
    { id: '2', text: 'Build todo app', completed: true },
    { id: '3', text: 'Compare state managers', completed: false }
  ],
  filter: 'all'
})

const derivedState = derive({
  filteredTodos: (get) => {
    const state = get(todoState)
    switch (state.filter) {
      case 'active': return state.todos.filter(t => !t.completed)
      case 'completed': return state.todos.filter(t => t.completed)
      default: return state.todos
    }
  },
  stats: (get) => {
    const todos = get(todoState).todos
    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    }
  }
})

const todoActions = {
  addTodo: (text: string) => {
    todoState.todos.push({
      id: Date.now().toString(),
      text,
      completed: false
    })
  },
  
  toggleTodo: (id: string) => {
    const todo = todoState.todos.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  },
  
  deleteTodo: (id: string) => {
    const index = todoState.todos.findIndex(t => t.id === id)
    if (index !== -1) {
      todoState.todos.splice(index, 1)
    }
  },
  
  setFilter: (filter: Filter) => {
    todoState.filter = filter
  },
  
  clearCompleted: () => {
    todoState.todos = todoState.todos.filter(t => !t.completed)
  }
}

export const ValtioTodoApp: React.FC = () => {
  const snap = useSnapshot(todoState)
  const derivedSnap = useSnapshot(derivedState)
  
  return (
    <div className="todo-app">
      <h2>Valtio Todo App</h2>
      <div className="todo-stats">
        <span>Total: {derivedSnap.stats.total}</span>
        <span>Active: {derivedSnap.stats.active}</span>
        <span>Completed: {derivedSnap.stats.completed}</span>
      </div>
      
      <AddTodo onAdd={todoActions.addTodo} />
      
      <TodoFilter 
        currentFilter={snap.filter}
        onFilterChange={todoActions.setFilter}
      />
      
      <div className="todo-list">
        {derivedSnap.filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={todoActions.toggleTodo}
            onDelete={todoActions.deleteTodo}
          />
        ))}
      </div>
      
      {snap.todos.some(t => t.completed) && (
        <button onClick={todoActions.clearCompleted} className="clear-completed">
          Clear Completed
        </button>
      )}
      
      <div className="implementation-notes">
        <h3>Valtio Implementation Notes:</h3>
        <ul>
          <li>✅ Extremely low boilerplate - direct mutations</li>
          <li>✅ Mutable API feels natural and intuitive</li>
          <li>✅ Automatic tracking of state changes</li>
          <li>✅ Small bundle size (~3kb)</li>
          <li>✅ Great for complex nested state</li>
          <li>✅ useSnapshot provides immutable snapshots</li>
          <li>⚠️ Limited DevTools compared to Redux/MobX</li>
          <li>⚠️ Mutable patterns may be unfamiliar to React devs</li>
        </ul>
      </div>
    </div>
  )
}