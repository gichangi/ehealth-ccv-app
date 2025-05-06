import { useEffect } from 'react';
import { Card } from '@dhis2/ui';
import styles from '../styles/AboutPage.module.css';

const DashboardPage = () => {
    useEffect(() => {
        const divElement = document.getElementById('viz1746534488626');
        const vizElement = divElement.getElementsByTagName('object')[0];
        vizElement.style.width = '100%';
        vizElement.style.height = '600px';

        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        vizElement.parentNode.insertBefore(scriptElement, vizElement);
    }, []);

    return (
        <div className={styles.container}>
            <Card>
                <div
                    className="tableauPlaceholder"
                    id="viz1746534488626"
                    style={{ position: 'relative', marginTop: '20px' }}
                >
                    <noscript>
                        <a href='#'>
                            <img
                                alt='Summary'
                                src='https://public.tableau.com/static/images/Su/SuperStoreSuperInteractivity/Summary/1_rss.png'
                                style={{ border: 'none' }}
                            />
                        </a>
                    </noscript>
                    <object className='tableauViz' style={{ display: 'none' }}>
                        <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
                        <param name='embed_code_version' value='3' />
                        <param name='site_root' value='' />
                        <param name='name' value='SuperStoreSuperInteractivity/Summary' />
                        <param name='tabs' value='no' />
                        <param name='toolbar' value='yes' />
                        <param name='static_image' value='https://public.tableau.com/static/images/Su/SuperStoreSuperInteractivity/Summary/1.png' />
                        <param name='animate_transition' value='yes' />
                        <param name='display_static_image' value='yes' />
                        <param name='display_spinner' value='yes' />
                        <param name='display_overlay' value='yes' />
                        <param name='display_count' value='yes' />
                        <param name='language' value='en-US' />
                    </object>
                </div>
            </Card>
        </div>
    );
};

export default DashboardPage;
