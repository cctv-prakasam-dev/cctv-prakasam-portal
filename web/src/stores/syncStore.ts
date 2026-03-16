import { useSyncExternalStore } from "react";

interface SyncState {
  isSyncing: boolean;
  toast: { type: "success" | "error"; message: string } | null;
}

let state: SyncState = { isSyncing: false, toast: null };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): SyncState {
  return state;
}

export function startSyncing() {
  state = { ...state, isSyncing: true, toast: null };
  emit();
}

export function stopSyncing(toast: SyncState["toast"] = null) {
  state = { ...state, isSyncing: false, toast };
  emit();
}

export function dismissToast() {
  state = { ...state, toast: null };
  emit();
}

export function useSyncStore() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
