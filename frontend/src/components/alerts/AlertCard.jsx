import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Bell, Trash2 } from 'lucide-react';

export default function AlertCard({ alert, onDelete }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={18} />
          {alert.commodity}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Market: {alert.market || 'Any'}</p>
        <p>Target: ₹{alert.target_price} ({alert.alert_type})</p>
        <p>Status: {alert.triggered ? 'Triggered' : 'Active'}</p>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" size="sm" onClick={() => onDelete(alert.id)}>
          <Trash2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}