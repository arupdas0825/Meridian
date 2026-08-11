'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { CheckSquare, Plus, Trash2, Calendar, Tag, CheckCircle2, Circle } from 'lucide-react';
import { listCollection, createDoc, updateDocById, deleteDocById } from '@/shared/lib/firestore';
import { toast } from 'sonner';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await listCollection('taskforge', 'tasks');
    if (data.length === 0) {
      // Seed default tasks if empty
      const seedTasks = [
        { title: 'Research flight options to Rome', priority: 'high', status: 'todo', due_date: '2026-08-20' },
        { title: 'Update monthly savings in LedgerWise', priority: 'medium', status: 'completed', due_date: '2026-08-10' },
        { title: 'Check passport validity for Europe trip', priority: 'high', status: 'todo', due_date: '2026-08-15' },
      ];
      for (const t of seedTasks) {
        await createDoc('taskforge', 'tasks', t);
      }
      const seeded = await listCollection('taskforge', 'tasks');
      setTasks(seeded);
    } else {
      setTasks(data);
    }
    setLoading(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      title: newTitle,
      priority,
      status: 'todo',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    const created = await createDoc('taskforge', 'tasks', newTask);
    setTasks([created, ...tasks]);
    setNewTitle('');
    toast.success('Task created successfully');
  };

  const handleToggleTask = async (task) => {
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    await updateDocById('taskforge', 'tasks', task.id, { status: nextStatus });
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
    toast.success(nextStatus === 'completed' ? 'Task completed' : 'Task restored');
  };

  const handleDeleteTask = async (id) => {
    await deleteDocById('taskforge', 'tasks', id);
    setTasks(tasks.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'todo') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">TaskForge — Tasks</h1>
          <p className="text-xs text-muted-foreground">Manage your productivity and deadlines</p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'todo', 'completed'].map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize text-xs"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Add Task Form */}
      <Card className="border-blue-500/20 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Add a new task..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="h-9 px-3 rounded-md border text-xs bg-background"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <Button type="submit" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" /> Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            Task List ({filteredTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-muted-foreground">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">No Tasks — You&apos;re all caught up.</p>
              <p>Add a new task above to get started.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/40 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="text-muted-foreground hover:text-blue-600 transition-colors shrink-0"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="truncate">
                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </p>
                    {task.due_date && (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {task.due_date}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant={
                      task.priority === 'high'
                        ? 'destructive'
                        : task.priority === 'medium'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="capitalize text-[10px]"
                  >
                    {task.priority}
                  </Badge>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
