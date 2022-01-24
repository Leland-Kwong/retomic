import React from 'react'
import {
  atomRef,
  useReadAtom,
  useSendAtom,
  AtomRoot
} from '../core'

type Todo = { text: string; done: boolean; id: string }

interface TodoState {
  items: Todo[]
}

const todosRef = atomRef<TodoState>({
  key: 'todos',
  defaultState: {
    items: [
      {
        text: 'buy eggs',
        done: false,
        id: String(0)
      }
    ]
  }
})

const addTodo = (
  s: TodoState,
  newTodo: Todo
): TodoState => ({
  ...s,
  items: [...s.items, newTodo]
})

function TodosList() {
  const todos = useReadAtom(todosRef, (d) => d.items)

  return (
    <div
      style={{
        height: 400,
        overflow: 'auto'
      }}
    >
      {todos.map(({ id, text, done }) => (
        <div key={id}>
          <input type="checkbox" checked={done} readOnly />
          text: {text}
        </div>
      ))}
    </div>
  )
}

function AddTodo() {
  const sendTodos = useSendAtom(todosRef)

  return (
    <button
      type="button"
      onClick={() => {
        sendTodos(addTodo, {
          text: 'buy something',
          done: false,
          id: String(Math.random())
        })
      }}
    >
      add todo
    </button>
  )
}

export function Todos() {
  return (
    <div>
      <h1>Retomic Example</h1>
      <AtomRoot>
        <TodosList />
        <AddTodo />
      </AtomRoot>
    </div>
  )
}