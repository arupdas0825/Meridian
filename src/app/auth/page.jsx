'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ShieldCheck, LogIn, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AuthPage() {
  const [email, setEmail] = useState('arup@meridian.app');
  const [password, setPassword] = useState('password123');
  const router = useRouter();

  const handleSignIn = (e) => {
    e.preventDefault();
    toast.success('Signed in successfully');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-slate-800 bg-slate-900 text-slate-100 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-lg">
            M
          </div>
          <CardTitle className="text-2xl font-bold">Sign In to Meridian</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            One platform across TaskForge, LedgerWise, and Atlas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100"
                required
              />
            </div>
            <Button type="submit" variant="atlas" className="w-full font-semibold gap-2">
              <LogIn className="w-4 h-4" /> Sign In
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-amber-400 flex items-center justify-center gap-1">
              Skip to Demo Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
