import { Card} from '@dhis2/ui'
import styles from '../styles/AboutPage.module.css'


const DashboardPage = () => (
    <div className={styles.container}>
        <Card>
            <img
                src='images/dashboard-place-holder.png'
                alt="Dashboard Banner"
                width='95%'
            />
        </Card>
    </div>
)

export default DashboardPage
