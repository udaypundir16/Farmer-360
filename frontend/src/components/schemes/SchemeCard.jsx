import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const categoryStyles = {
  subsidy: 'bg-primary-100 text-primary-800 border-primary-200',
  loan: 'bg-earth-100 text-earth-800 border-earth-200',
  insurance: 'bg-gold-100 text-gold-800 border-gold-200',
  training: 'bg-crop/20 text-primary-800 border-crop/40',
  other: 'bg-cream-200 text-soil border-primary-100',
};

export default function SchemeCard({ scheme }) {
  const style = categoryStyles[scheme.category] || categoryStyles.other;

  return (
    <Card className="group hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <CardTitle className="text-lg text-soil">{scheme.name}</CardTitle>
        <Badge className={`${style} border`}>{scheme.category}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-soil-light line-clamp-3 leading-relaxed">{scheme.description}</p>
        {scheme.state_specific && (
          <p className="text-xs text-soil-light/80 mt-2">State: {scheme.state_specific}</p>
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/schemes/${scheme.id}`}>
          <Button variant="outline" size="sm">View More</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
