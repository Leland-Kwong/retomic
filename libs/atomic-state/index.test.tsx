import React from 'react'
import {
  renderHook,
  act
} from '@testing-library/react-hooks'
import {
  atomRef,
  useReadAtom,
  useResetAtom,
  useSendAtom,
  AtomRoot
} from '.'

type State = { text: string }
type State2 = string

const identity = (d: any) => d
const setTestState = (s: State, text: string) => ({
  ...s,
  text
})
const setTestState2 = (_: State2, newText: string) =>
  newText
const ref = atomRef<State>({
  key: 'test',
  defaultState: {
    text: 'foo'
  }
})
const ref2 = atomRef<State2>({
  key: 'test2',
  defaultState: 'foo2'
})

describe('react-atomic', () => {
  test('useReadAtom', () => {
    const wrapper = ({ children }: { children: any }) => (
      <AtomRoot>{children}</AtomRoot>
    )
    const selector = (d: State) => d.text.length
    const { result } = renderHook(
      () => useReadAtom(ref, selector),
      { wrapper }
    )

    expect(result.current).toBe(3)
  })

  test('useSendAtom', async () => {
    const wrapper = ({ children }: { children: any }) => (
      <AtomRoot>{children}</AtomRoot>
    )
    const mockSelector = jest.fn((d) => d)
    const { result } = renderHook(
      () => {
        const readValue = useReadAtom(ref, mockSelector)
        const sendAtom = useSendAtom(ref)
        const readValue2 = useReadAtom(ref2, identity)
        const sendAtom2 = useSendAtom(ref2)

        return {
          readValue,
          sendAtom,
          readValue2,
          sendAtom2
        }
      },
      { wrapper }
    )

    await act(async () => {
      await result.current.sendAtom2(setTestState2, 'bar2')
    })
    await act(async () => {
      await result.current.sendAtom(setTestState, 'baz')
    })

    expect(mockSelector.mock.calls).toEqual([
      [{ text: 'foo' }],
      [{ text: 'foo' }],
      [{ text: 'baz' }],
      [{ text: 'baz' }]
    ])
    expect(result.current.readValue2).toBe('bar2')
    expect(result.current.readValue).toEqual({
      text: 'baz'
    })
  })

  test('useResetAtom', async () => {
    const mockWrapper = ({
      children
    }: {
      children: any
    }) => <AtomRoot>{children}</AtomRoot>
    const mockSelector = jest.fn((d) => d)
    const { result } = renderHook(
      () => {
        const readValue = useReadAtom(ref, mockSelector)
        const resetAtom = useResetAtom(ref)
        const sendAtom = useSendAtom(ref)

        return {
          readValue,
          resetAtom,
          sendAtom
        }
      },
      { wrapper: mockWrapper }
    )

    await act(async () => {
      await result.current.sendAtom(setTestState, 'bar')
    })
    await act(async () => {
      await result.current.resetAtom()
    })

    expect(mockSelector.mock.calls).toEqual([
      [{ text: 'foo' }],
      [{ text: 'bar' }],
      [{ text: 'bar' }],
      [{ text: 'foo' }],
      [{ text: 'foo' }]
    ])
    expect(result.current.readValue).toBe(ref.defaultState)
  })
})