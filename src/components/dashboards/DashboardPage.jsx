import { Card } from '@dhis2/ui';
import styles from '../styles/AboutPage.module.css';
import React, { useState, useEffect } from 'react';
import { CircularLoader, CenteredContent } from '@dhis2/ui';
import useAppSettings from '../../hooks/useAppSettings';

const DashboardPage = () => {
    const { settings, loading } = useAppSettings();
    const [url, setUrl] = useState('');

    // Check if settings is available and update the URL accordingly
    useEffect(() => {
        if (settings?.ccvHFATDashboard) {
            let tableauUrl = settings.ccvHFATDashboard;
            if (!tableauUrl.includes('?:embed=y')) {
                tableauUrl += '?:embed=y&:display_count=yes';
            }
            setUrl(tableauUrl);
        }
    }, [settings]); // Ensure that effect runs whenever settings change

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader large />
            </CenteredContent>
        );
    }

    return (
        <div style={{ height: '90vh', width: '100%' }}>
            {url ? (
                <iframe
                    src={url}
                    width="100%"
                    height="100%"
                    title="Dashboard"
                    frameBorder="0"
                    allowFullScreen
                />
            ) : (
                <p style={{ textAlign: 'center' }}>No dashboard URL provided.</p>
            )}
        </div>
    );
};

export default DashboardPage;
