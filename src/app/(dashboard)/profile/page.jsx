import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
        <p className="text-xs text-muted-foreground">Your Meridian account details</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-atlas-navy text-atlas-gold flex items-center justify-center font-bold text-2xl border-2 border-atlas-gold">
              AD
            </div>
            <div>
              <CardTitle className="text-xl">Arup Das</CardTitle>
              <span className="text-xs text-muted-foreground">arup@meridian.app</span>
              <div className="mt-1">
                <Badge variant="atlas">Meridian Owner</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-muted/40 space-y-1">
              <span className="text-muted-foreground block">Active Modules</span>
              <span className="font-bold text-foreground">TaskForge · LedgerWise · Atlas</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 space-y-1">
              <span className="text-muted-foreground block">Authentication Method</span>
              <span className="font-bold text-foreground">Firebase Shared Identity</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
