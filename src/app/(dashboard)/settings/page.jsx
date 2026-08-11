import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Settings, Moon, Globe, Database, ShieldCheck } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-xs text-muted-foreground">Configure Meridian platform options</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Eligibility & Two-Number Security Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <p className="text-foreground font-medium">
            Rule 4 Enforcement Active:
          </p>
          <p>
            Manual edits to the Atlas Travel Wallet affect only `availableTravelFunds`. Only confirmed LedgerWise monthly summaries write `verifiedTravelSavings` and drive destination unlock status.
          </p>
          <div className="pt-2 border-t flex justify-between items-center text-xs">
            <span>IndexedDB Cache (Dexie):</span>
            <Badge variant="outline">MeridianDB Active</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
