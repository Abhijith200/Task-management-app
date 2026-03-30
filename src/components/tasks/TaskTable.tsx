'use client';

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  ArrowUpDown,
  CircleCheck,
  CirclePlay,
  Circle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onPriorityChange: (id: string, priority: TaskPriority) => void;
}

export function TaskTable({ 
  tasks, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  onPriorityChange 
}: TaskTableProps) {
  
  const getStatusIcon = (status: TaskStatus) => {
    switch(status) {
      case 'completed': return <CircleCheck className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <CirclePlay className="h-4 w-4 text-blue-500" />;
      case 'todo': return <Circle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch(priority) {
      case 'high': return <Badge variant="destructive" className="capitalize">High</Badge>;
      case 'medium': return <Badge variant="warning" className="capitalize">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="capitalize">Low</Badge>;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card/50 backdrop-blur-sm">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
          <Trash2 className="h-8 w-8 text-muted-foreground opacity-30" />
        </div>
        <h3 className="text-xl font-semibold">No tasks found</h3>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
          Start by adding a new task to your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-md overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[40%] font-semibold">Task</TableHead>
            <TableHead className="font-semibold text-center">Status</TableHead>
            <TableHead className="font-semibold text-center">Priority</TableHead>
            <TableHead className="font-semibold text-center">Due Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="group hover:bg-muted/40 transition-colors">
              <TableCell className="py-4">
                <div className="flex flex-col">
                  <span className="font-medium group-hover:text-primary transition-colors">{task.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{task.description}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="h-8 px-2 gap-2">
                       {getStatusIcon(task.status)}
                       <span className="capitalize text-xs font-semibold">{task.status.replace('-', ' ')}</span>
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="center">
                     <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => onStatusChange(task.id, 'todo')}>Todo</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in-progress')}>In Progress</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onStatusChange(task.id, 'completed')}>Completed</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
              </TableCell>
              <TableCell className="text-center">
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="h-8">
                       {getPriorityBadge(task.priority)}
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="center">
                     <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => onPriorityChange(task.id, 'low')}>Low</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onPriorityChange(task.id, 'medium')}>Medium</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onPriorityChange(task.id, 'high')}>High</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive font-medium" onClick={() => onDelete(task.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
