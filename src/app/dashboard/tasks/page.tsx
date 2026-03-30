'use client';

import React, { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskTable } from '@/components/tasks/TaskTable';
import { TaskModal } from '@/components/tasks/TaskModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter,
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { Separator } from '@/components/ui/separator';

export default function TasksPage() {
  const { 
    tasks, 
    isLoading, 
    addTask, 
    updateTask, 
    deleteTask, 
    updateStatus, 
    updatePriority 
  } = useTasks();
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate-asc');

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by search query
    if (searchQuery) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Sort
    result.sort((a, b) => {
      const [field, direction] = sortBy.split('-');
      const dir = direction === 'asc' ? 1 : -1;

      if (field === 'dueDate') {
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir;
      }
      if (field === 'priority') {
        const priorityScore = { high: 3, medium: 2, low: 1 };
        return (priorityScore[a.priority as TaskPriority] - priorityScore[b.priority as TaskPriority]) * dir;
      }
      return 0;
    });

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTasks.length / itemsPerPage));
  
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTasks, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmitTask = (data: any) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage, filter, and track your todos and projects.</p>
        </div>
        <Button onClick={handleOpenCreateModal} className="gap-2 shadow-lg hover:shadow-xl transition-all">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-muted/30 rounded-xl border border-primary/5">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-background/50 border-primary/10 focus:border-primary transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-[130px] bg-background/50 border-primary/10">
                <Filter className="h-3 w-3 mr-2 opacity-50" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(val) => { setPriorityFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-[130px] bg-background/50 border-primary/10">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-8 hidden md:block" />

            <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px] bg-background/50 border-primary/10">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate-asc">Date: Earliest</SelectItem>
                <SelectItem value="dueDate-desc">Date: Latest</SelectItem>
                <SelectItem value="priority-desc">Priority: High</SelectItem>
                <SelectItem value="priority-asc">Priority: Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
                <span>Total: {filteredAndSortedTasks.length} tasks matching your criteria</span>
                <span>Page {currentPage} of {totalPages}</span>
             </div>
             <TaskTable
                tasks={paginatedTasks}
                onEdit={handleOpenEditModal}
                onDelete={deleteTask}
                onStatusChange={updateStatus}
                onPriorityChange={updatePriority}
             />

             {/* Pagination Controls */}
             {totalPages > 1 && (
               <div className="flex items-center justify-center gap-2 mt-6">
                 <Button
                   variant="outline"
                   size="sm"
                   disabled={currentPage === 1}
                   onClick={() => handlePageChange(currentPage - 1)}
                 >
                   Previous
                 </Button>
                 <div className="flex items-center gap-1">
                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                     <Button
                       key={page}
                       variant={currentPage === page ? "default" : "ghost"}
                       size="sm"
                       className="w-8 h-8 p-0"
                       onClick={() => handlePageChange(page)}
                     >
                       {page}
                     </Button>
                   ))}
                 </div>
                 <Button
                   variant="outline"
                   size="sm"
                   disabled={currentPage === totalPages}
                   onClick={() => handlePageChange(currentPage + 1)}
                 >
                   Next
                 </Button>
               </div>
             )}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTask}
        task={editingTask}
      />
    </div>
  );
}
