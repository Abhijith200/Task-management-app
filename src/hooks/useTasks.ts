'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { toast } from 'sonner';

const STORAGE_KEY = 'vibe_tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage
  useEffect(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to local storage
  const saveTasks = useCallback((newTasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    setTasks(newTasks);
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newTasks = [newTask, ...tasks];
    saveTasks(newTasks);
    toast.success('Task created successfully');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const newTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    saveTasks(newTasks);
    toast.success('Task updated successfully');
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    saveTasks(newTasks);
    toast.success('Task deleted successfully');
  };

  const updateStatus = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  const updatePriority = (id: string, priority: TaskPriority) => {
    updateTask(id, { priority });
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    updateStatus,
    updatePriority,
  };
}
