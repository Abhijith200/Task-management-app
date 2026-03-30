'use client';

import React from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ListTodo,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TaskTable } from '@/components/tasks/TaskTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { tasks, isLoading } = useTasks();

  const stats = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: ListTodo,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Completed',
      value: tasks.filter(t => t.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'In Progress',
      value: tasks.filter(t => t.status === 'in-progress').length,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Pending',
      value: tasks.filter(t => t.status === 'todo').length,
      icon: Circle,
      color: 'text-slate-500',
      bgColor: 'bg-slate-500/10',
    }
  ];

  const recentTasks = [...tasks].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Monitor your task progress and performance.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/dashboard/tasks">View All Tasks</Link>
            </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-primary/5 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>Updated just now</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-primary/5">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading tasks...</p>
              ) : recentTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">No tasks found</p>
                  <p className="text-sm text-muted-foreground">Get started by creating your first task.</p>
                </div>
              ) : (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-primary/10 hover:bg-muted/30 transition-all group">
                    <div className="flex flex-col overflow-hidden mr-4">
                      <span className="font-medium truncate group-hover:text-primary transition-colors">{task.title}</span>
                      <span className="text-xs text-muted-foreground truncate w-full max-w-md">{task.description}</span>
                    </div>
                    <Badge variant={
                      task.status === 'completed' ? 'success' : 
                      task.status === 'in-progress' ? 'default' : 'secondary'
                    } className="capitalize shrink-0">
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-primary/5">
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center">
             <div className="h-[200px] w-full flex items-end justify-center gap-4 py-4">
               {stats.slice(1).map((stat) => {
                 const percentage = tasks.length > 0 ? (stat.value / tasks.length) * 100 : 0;
                 return (
                   <div key={stat.title} className="flex flex-col items-center gap-2 flex-1 max-w-[60px]">
                     <div 
                       className={`w-full rounded-t-lg ${stat.bgColor.replace('/10', '/30')} ${stat.color.replace('text-', 'bg-')} transition-all duration-1000`} 
                       style={{ height: `${Math.max(percentage, 5)}%` }}
                     />
                     <span className="text-[10px] font-medium text-center leading-tight truncate w-full">{stat.title.split(' ')[0]}</span>
                   </div>
                 );
               })}
             </div>
             <p className="text-center text-xs text-muted-foreground mt-4 italic">
               Visualization of your current task status distribution.
             </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
