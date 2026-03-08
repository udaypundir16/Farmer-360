
import React, { useEffect, useState } from 'react';
import { getSchemeNews } from '../../services/schemes.service';
import Loader from '../ui/loader';
import { ExternalLink, Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const SchemeNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getSchemeNews();
                setNews(data.slice(0, 5)); // Show top 5 news items
            } catch (err) {
                console.error('Failed to fetch scheme news:', err);
                setError('Failed to load news');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <div className="flex justify-center p-4"><Loader /></div>;
    if (error || news.length === 0) return null;

    return (
        <div className="bg-white rounded-agri-lg shadow-sm border border-primary-100 p-6 mb-8 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-primary-600" size={24} />
                <h2 className="text-xl font-bold text-soil">Latest Agriculture News & Schemes</h2>
            </div>

            <div className="space-y-4">
                {news.map((item, index) => (
                    <div key={index} className="group border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <h3 className="font-semibold text-soil group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                                {item.title}
                            </h3>

                            <div className="flex items-center gap-3 text-xs text-soil-light mt-1">
                                <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                                    {item.source}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    <span>{item.pubDate ? format(new Date(item.pubDate), 'MMM d, yyyy') : 'Recent'}</span>
                                </div>
                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SchemeNews;
