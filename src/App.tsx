import React, { useState } from 'react'
import { ZustandTodoApp } from './examples/ZustandTodoApp'
import { ReduxTodoApp } from './examples/ReduxTodoApp'
import { JotaiTodoApp } from './examples/JotaiTodoApp'
import { ValtioTodoApp } from './examples/ValtioTodoApp'
import { MobXTodoApp } from './examples/MobXTodoApp'
import { RecoilTodoApp } from './examples/RecoilTodoApp'
import { ZustandContextApp } from './examples/context/ZustandContextApp'
import { ReduxContextApp } from './examples/context/ReduxContextApp'
import { JotaiContextApp } from './examples/context/JotaiContextApp'
import { ValtioContextApp } from './examples/context/ValtioContextApp'
import { MobXContextApp } from './examples/context/MobXContextApp'
import { ContextOnlyApp } from './examples/context/ContextOnlyApp'
import './App.css'

type Example = 'zustand' | 'redux' | 'jotai' | 'valtio' | 'mobx' | 'recoil' | 
               'zustand-context' | 'redux-context' | 'jotai-context' | 'valtio-context' | 'mobx-context' | 'context-only'

const App: React.FC = () => {
  const [currentExample, setCurrentExample] = useState<Example>('zustand')
  const [showContext, setShowContext] = useState(false)
  
  const globalExamples = [
    { key: 'zustand', name: 'Zustand', component: <ZustandTodoApp /> },
    { key: 'redux', name: 'Redux Toolkit', component: <ReduxTodoApp /> },
    { key: 'jotai', name: 'Jotai', component: <JotaiTodoApp /> },
    { key: 'valtio', name: 'Valtio', component: <ValtioTodoApp /> },
    { key: 'mobx', name: 'MobX', component: <MobXTodoApp /> },
    { key: 'recoil', name: 'Recoil', component: <RecoilTodoApp /> }
  ] as const
  
  const contextExamples = [
    { key: 'zustand-context', name: 'Zustand + Context', component: <ZustandContextApp /> },
    { key: 'redux-context', name: 'Redux + Context', component: <ReduxContextApp /> },
    { key: 'jotai-context', name: 'Jotai + Context', component: <JotaiContextApp /> },
    { key: 'valtio-context', name: 'Valtio + Context', component: <ValtioContextApp /> },
    { key: 'mobx-context', name: 'MobX + Context', component: <MobXContextApp /> },
    { key: 'context-only', name: 'Context Only', component: <ContextOnlyApp /> }
  ] as const
  
  const allExamples = [...globalExamples, ...contextExamples]
  
  const currentExampleData = allExamples.find(ex => ex.key === currentExample)
  const currentExamples = showContext ? contextExamples : globalExamples
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>State Management Examples</h1>
        <p>Compare different React state management solutions</p>
        <div className="mode-toggle">
          <button
            onClick={() => {
              setShowContext(false)
              setCurrentExample('zustand')
            }}
            className={`mode-button ${!showContext ? 'active' : ''}`}
          >
            Global State
          </button>
          <button
            onClick={() => {
              setShowContext(true)
              setCurrentExample('zustand-context')
            }}
            className={`mode-button ${showContext ? 'active' : ''}`}
          >
            Context API
          </button>
        </div>
      </header>
      
      <nav className="app-nav">
        {currentExamples.map(example => (
          <button
            key={example.key}
            onClick={() => setCurrentExample(example.key as Example)}
            className={`nav-button ${currentExample === example.key ? 'active' : ''}`}
          >
            {example.name}
          </button>
        ))}
      </nav>
      
      <main className="app-main">
        {currentExampleData?.component}
      </main>
      
      <footer className="app-footer">
        <div className="comparison-table">
          <h3>Quick Comparison</h3>
          <table>
            <thead>
              <tr>
                <th>Library</th>
                <th>Bundle Size</th>
                <th>Learning Curve</th>
                <th>Boilerplate</th>
                <th>DevTools</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Zustand</td>
                <td>~2.5kb</td>
                <td>Easy</td>
                <td>Low</td>
                <td>Good</td>
                <td>Most projects</td>
              </tr>
              <tr>
                <td>Redux Toolkit</td>
                <td>~15kb</td>
                <td>Steep</td>
                <td>High</td>
                <td>Excellent</td>
                <td>Large apps</td>
              </tr>
              <tr>
                <td>Jotai</td>
                <td>~3kb</td>
                <td>Moderate</td>
                <td>Low</td>
                <td>Good</td>
                <td>Atomic state</td>
              </tr>
              <tr>
                <td>Valtio</td>
                <td>~3kb</td>
                <td>Easy</td>
                <td>Very Low</td>
                <td>Basic</td>
                <td>Mutable API</td>
              </tr>
              <tr>
                <td>MobX</td>
                <td>~15kb</td>
                <td>Moderate</td>
                <td>Medium</td>
                <td>Excellent</td>
                <td>OOP patterns</td>
              </tr>
              <tr>
                <td>Recoil</td>
                <td>~10kb</td>
                <td>Moderate</td>
                <td>Medium</td>
                <td>Excellent</td>
                <td>Experimental</td>
              </tr>
            </tbody>
          </table>
        </div>
      </footer>
    </div>
  )
}

export default App