import type { Atom } from './types';
export type { Atom } from './types';
export { AtomDevTools } from './AtomDevTools';
export { RetomicRoot as AtomRoot } from './RetomicRoot';
export { RetomicRoot } from './RetomicRoot';
export declare function atom<T>({ key, defaultState, resetOnInactive }: Atom<T>): Readonly<Atom<T>>;
export declare const atomRef: typeof atom;
export declare function useRead<T, SelectorValue = T>(atom: Atom<T>, selector: (state: T) => SelectorValue): SelectorValue;
export declare function useSend<T>(atom: Atom<T>): <Payload>(mutationFn: (oldState: T, payload: Payload) => T, payload: Payload) => Promise<[void, void]>;
export declare function useReset<T>(atom: Atom<T>): () => Promise<[void, void]>;
