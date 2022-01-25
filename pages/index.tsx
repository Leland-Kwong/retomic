import dynamic from 'next/dynamic'
import { useEffect, useMemo } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {
  atomRef,
  useIsNew,
  useRead,
  useSend,
  AtomRoot
} from '../dist'

type $Hello = {
  message: string
  showTimer: boolean
}

const helloRef = atomRef<$Hello>({
  key: 'Hello',
  defaultState: {
    message: 'Hello world',
    showTimer: false
  }
})

// IMPORTANT: a benefit of using this function is it allows
// typescript to check for extraneous properties being
// merged in
function update<T>(baseProps: T, newProps: Partial<T>): T {
  return { ...baseProps, ...newProps }
}

const identity = <T,>(x: T) => x

const newMessage = (s: $Hello, message: string) =>
  update(s, {
    message
  })

const toggleShowTimer = (s: $Hello, showTimer: boolean) =>
  update(s, {
    showTimer
  })

type $Clock = number

const timerRef = atomRef<$Clock>({
  key: 'Clock',
  defaultState: 0
})

const tick = (time: $Clock, incrementBy: number) =>
  time + incrementBy

const Timer = () => {
  const count = useRead(timerRef, identity)
  const sendTimer = useSend(timerRef)

  useEffect(() => {
    const timer = setTimeout(() => {
      sendTimer(tick, 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [sendTimer, count])

  return <div>Time Elapsed: {count}s</div>
}

const MessageOnly = () => {
  const { msg } = useRead(
    helloRef,
    useIsNew(({ message: msg }) => ({ msg }))
  )

  return (
    <div>
      <h2>Message Only</h2>
      <div>{msg}</div>
    </div>
  )
}

const AtomAppDemo = () => {
  const text = useRead(helloRef, (s) => s.message)
  const showTimer = useRead(helloRef, (s) => s.showTimer)
  const sendHello = useSend(helloRef)

  return (
    <div>
      <h2>Atom App Main Demo</h2>
      <div>
        <input
          type="text"
          value={text}
          onChange={(ev) => {
            sendHello(newMessage, ev.target.value)
          }}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            onChange={(ev) => {
              sendHello(toggleShowTimer, ev.target.checked)
            }}
            checked={showTimer}
          />
          clock enabled
        </label>
        {showTimer && <Timer />}
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const AtomDevTools = useMemo(
    () =>
      dynamic(
        async () =>
          (await import('../src/retomic')).AtomDevTools,
        { ssr: false }
      ),
    []
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>React Atomic</h1>

        <AtomRoot>
          <MessageOnly />
          <AtomAppDemo />
          <AtomDevTools />
        </AtomRoot>
      </main>
    </div>
  )
}

export default Home
