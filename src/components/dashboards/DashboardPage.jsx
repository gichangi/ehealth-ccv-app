import { Card } from '@dhis2/ui';
import styles from '../styles/AboutPage.module.css';
import React, { useState, useEffect } from 'react';
import { CircularLoader, CenteredContent } from '@dhis2/ui';
import useAppSettings from '../../hooks/useAppSettings';

const DashboardPage = () => {
    const { settings, loading } = useAppSettings();
    const [url, setUrl] = useState('https://public.tableau.com/views/Makeovermondayweek46-AidWorkerSecurityIncidents/SecurityIncidents?:language=en-GB&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link');

    // Check if settings is available and update the URL accordingly
    useEffect(() => {
        if (settings?.ccvHFATDashboard) {
            let tableauUrl = '';
            // if (!tableauUrl.includes('?:embed=y')) {
            //     tableauUrl += '?:embed=y&:display_count=yes';
            // }
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
                <iframe
                    src="https://public.tableau.com/views/CrumbsofCrumble/Crumble?:language=en-GB&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"
                    width="100%"
                    height="100%"
                    title="Dashboard"
                    frameBorder="0"
                    allowFullScreen
                />
        </div>
    );
};

export default DashboardPage;
