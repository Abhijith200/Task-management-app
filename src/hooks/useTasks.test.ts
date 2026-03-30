import { renderHook, act } from '@testing-library/react';
import { useTasks } from './useTasks';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useTasks hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with an empty array of tasks', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add a task', () => {
    const { result } = renderHook(() => useTasks());
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo' as const,
      priority: 'medium' as const,
      dueDate: new Date().toISOString(),
    };

    act(() => {
      result.current.addTask(taskData);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Test Task');
  });

  it('should delete a task', () => {
    const { result } = renderHook(() => useTasks());
    const taskData = {
      title: 'Delete Me',
      description: 'Delete Me Description',
      status: 'todo' as const,
      priority: 'medium' as const,
      dueDate: new Date().toISOString(),
    };

    let taskId = '';
    act(() => {
      const task = result.current.addTask(taskData);
      taskId = task.id;
    });

    expect(result.current.tasks).toHaveLength(1);

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it('should update task status', () => {
    const { result } = renderHook(() => useTasks());
    const taskData = {
      title: 'Status Test',
      description: 'Status Test Description',
      status: 'todo' as const,
      priority: 'medium' as const,
      dueDate: new Date().toISOString(),
    };

    let taskId = '';
    act(() => {
      const task = result.current.addTask(taskData);
      taskId = task.id;
    });

    act(() => {
      result.current.updateStatus(taskId, 'completed');
    });

    expect(result.current.tasks[0].status).toBe('completed');
  });
});
