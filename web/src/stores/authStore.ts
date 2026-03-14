import { useSyncExternalStore } from "react";

interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
}

const STORAGE_KEY = "cctv_auth_user";

function getStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  catch {
    return null;
  }
}

let currentUser: AuthUser | null = getStoredUser();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): AuthUser | null {
  return currentUser;
}

export function setAuthUser(user: AuthUser) {
  currentUser = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  listeners.forEach(l => l());
}

export function clearAuthUser() {
  currentUser = null;
  localStorage.removeItem(STORAGE_KEY);
  listeners.forEach(l => l());
}

export function getAuthUser(): AuthUser | null {
  return currentUser;
}

export function useAuthUser() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
