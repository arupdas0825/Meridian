'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { DateTimePicker } from '@/shared/ui/DateTimePicker';
import { CheckSquare, Plus, Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { useTasks, addTask, toggleTask, deleteTask } from '@/modules/taskforge/hooks/useTasks';
import { toast } from 'sonner';

export default function TasksPage() {
  const { tasks, loading } = useTasks();
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addTask({
      title: newTitle.trim(),
      priority,
      dueDate: dueDate || null,
    });
    setNewTitle('');
    setDueDate(null);
    toast.success('Task created successfully');
  };

  const handleToggleTask = async (task) => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    await toggleTask(task.id, task.status);
    toast.success(nextStatus === 'done' ? 'Task completed' : 'Task restored');
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    toast.success('Task deleted');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'todo') return t.status !== 'done';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  const formatDueDate = (val) => {
    if (!val) return null;
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      // If it contains time
      if (val.includes('T')) {
        return d.toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return val;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">TaskForge — Tasks</h1>
          <p className="text-xs text-ink-600">Manage your productivity, priorities, and deadlines</p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'todo', 'done'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize text-xs h-8 px-3"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Add Task Form with DateTimePicker */}
      <Card className="border-primary/20 shadow-sm bg-surface-1">
        <CardContent className="pt-6">
          <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <Input
              placeholder="Add a new task..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 min-w-[200px]"
              required
            />
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-9 px-3 rounded-md border border-line text-xs bg-surface-0 text-ink-900 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <DateTimePicker value={dueDate} onChange={setDueDate} />

              <Button type="submit" className="gap-1.5 bg-primary hover:bg-primary/90 text-white shrink-0 h-9">
                <Plus className="w-4 h-4" /> Add Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="bg-surface-1 shadow-e1">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 font-display">
            <CheckSquare className="w-4 h-4 text-primary" />
            Task List ({filteredTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-ink-600">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-ink-600 space-y-1">
              <p className="font-semibold text-ink-900">No Tasks — You&apos;re all caught up.</p>
              <p>Add a new task above with deadline and priority to get started.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border border-line bg-surface-0 hover:bg-surface-2 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="text-ink-600 hover:text-primary transition-colors shrink-0"
                    title={task.status === 'done' ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="truncate">
                    <p
                      className={`text-sm font-medium ${
                        task.status === 'done' ? 'line-through text-ink-400' : 'text-ink-900'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-[11px] text-ink-600 mt-0.5 font-mono-data">
                        <Calendar className="w-3 h-3 text-primary/70" />
                        <span>Due: {formatDueDate(task.dueDate)}</span>
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
                    className="p-1.5 rounded-md text-ink-600 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete task"
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
