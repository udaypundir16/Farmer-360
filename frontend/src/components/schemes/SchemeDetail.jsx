import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSchemeById, applyToScheme } from '../../services/schemes.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useAuth } from '../../context/AuthContext';

export default function SchemeDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadScheme();
  }, [id]);

  const loadScheme = async () => {
    try {
      const data = await getSchemeById(id);
      setScheme(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToScheme(id);
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Failed to apply. You may have already applied.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div>{t('common.loading')}</div>;
  if (!scheme) return <div>{t('schemes.no_schemes_found')}</div>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{scheme.name || 'Scheme Details'}</CardTitle>
          <Badge>{scheme.category || 'General'}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* introductory paragraph describing content source */}
          <div>
            <p className="text-sm text-gray-600">
              {t('schemes.govt_data_notice', 'This information is sourced from official government records. Fields marked below reflect the latest published data; if a field is blank, details were not provided in the dataset.')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">{t('schemes.description')}</h3>
            <p>{scheme.description || t('schemes.no_description')}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('schemes.eligibility')}</h3>
            <p>{scheme.eligibility_criteria || t('schemes.no_eligibility')}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('schemes.benefits')}</h3>
            <p>{scheme.benefits || t('schemes.no_benefits')}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t('schemes.application_process')}</h3>
            <p>{scheme.application_process || t('schemes.no_application_process')}</p>
          </div>
          {scheme.documents_required?.length > 0 && (
            <div>
              <h3 className="font-semibold">{t('schemes.documents_required')}</h3>
              <ul className="list-disc pl-5">
                {scheme.documents_required.map((doc, i) => <li key={i}>{doc}</li>)}
              </ul>
            </div>
          )}
          {scheme.deadline && (
            <div>
              <h3 className="font-semibold">{t('schemes.deadline')}</h3>
              <p>{new Date(scheme.deadline).toLocaleDateString()}</p>
            </div>
          )}
          {scheme.official_link ? (
            <div>
              <a href={scheme.official_link} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                {t('schemes.official_link')}
              </a>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500">{t('schemes.no_official_link')}</p>
            </div>
          )}

          {/* render any additional fields that may come from government dataset */}
          {(() => {
            const ignore = ['id', 'name', 'description', 'category', 'eligibility_criteria', 'benefits', 'application_process', 'documents_required', 'state_specific', 'deadline', 'official_link', 'is_active', 'created_at'];
            const pretty = {
              department: 'Department',
              scheme_code: 'Scheme Code',
              start_date: 'Start Date',
              funding_amount: 'Funding Amount',
              implementing_agency: 'Implementing Agency',
              contact_info: 'Contact Information',
              last_updated: 'Last Updated',
            };
            return Object.entries(scheme)
              .filter(([k, v]) => !ignore.includes(k) && v != null && v !== '')
              .map(([key, value]) => {
                const label = pretty[key] || key.replace(/_/g, ' ');
                const display = ['start_date', 'deadline', 'last_updated', 'created_at'].includes(key)
                  ? new Date(value).toLocaleDateString()
                  : value.toString();
                return (
                  <div key={key}>
                    <h3 className="font-semibold">{label}</h3>
                    <p>{display}</p>
                  </div>
                );
              });
          })()}
        </CardContent>
      </Card>

    </div>
  );
}