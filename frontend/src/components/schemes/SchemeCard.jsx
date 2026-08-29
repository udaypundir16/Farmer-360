import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const categoryStyles = {
  subsidy: 'bg-primary-100 text-primary-800 border-primary-200',
  loan: 'bg-earth-100 text-earth-800 border-earth-200',
  insurance: 'bg-gold-100 text-gold-800 border-gold-200',
  training: 'bg-crop/20 text-primary-800 border-crop/40',
  other: 'bg-cream-200 text-soil border-primary-100',
};

export default function SchemeCard({ scheme }) {
  const { t } = useTranslation();
  const style = categoryStyles[scheme.category] || categoryStyles.other;

  // Determine external news or portal link directly
  const redirectUrl = scheme.news_link || scheme.official_link || (scheme.name ? `https://news.google.com/search?q=${encodeURIComponent(scheme.name)}&hl=en-IN&gl=IN&ceid=IN:en` : 'https://www.india.gov.in/my-government/schemes');

  return (
    <Card className="group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full bg-white rounded-agri-lg border border-primary-100 shadow-sm hover:shadow-agri">
      <div>
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
          <CardTitle className="text-base md:text-lg font-bold text-soil line-clamp-2 leading-snug">
            {scheme.name}
          </CardTitle>
          <Badge className={`${style} border capitalize whitespace-nowrap text-xs`}>
            {scheme.category || 'General'}
          </Badge>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <p className="text-sm text-soil-light line-clamp-3 leading-relaxed">
            {scheme.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-soil-light/80">
            {scheme.source && (
              <span className="bg-primary-50 text-primary-700 font-medium px-2 py-0.5 rounded-full border border-primary-100">
                {scheme.source}
              </span>
            )}
            {scheme.state_specific && (
              <span>{scheme.state_specific}</span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="pt-3 border-t border-primary-100/40">
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 font-medium transition-colors"
          >
            <span>{t('schemes.view_more', 'View More')}</span>
            <ExternalLink size={14} />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}

