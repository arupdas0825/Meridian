'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/shared/lib/db';

/**
 * Live-reactive hook for TaskForge tasks.
 * Re-renders automatically on any Dexie write from any component.
 */
export function useTasks() {
  const tasks = useLiveQuery(() => db.tf_tasks.orderBy('createdAt').reverse().toArray(), []);
  return { tasks: tasks ?? [], loading: tasks === undefined };
}

export async function addTask({ title, priority = 'medium', dueDate = null }) {
  return db.tf_tasks.add({
    title,
    status: 'todo',
    priority,
    dueDate,
    createdAt: new Date().toISOString(),
  });
}

export async function toggleTask(id, currentStatus) {
  return db.tf_tasks.update(id, {
    status: currentStatus === 'done' ? 'todo' : 'done',
  });
}

export async function deleteTask(id) {
  return db.tf_tasks.delete(id);
}
