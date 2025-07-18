import {CircularLoader, NoticeBox, OrganisationUnitTree} from '@dhis2/ui'
import { useNavigate } from 'react-router-dom'
import useOrgUnitRoots from '../../hooks/useOrgUnitRoots.js'
import exploreStore from '../../store/exploreStore.js'
import styles from './styles/OrgUnitTree.module.css'

const OrgUnitTree = () => {
    const { orgUnit,setOrgUnit } = exploreStore()
    const { roots, loading, error } = useOrgUnitRoots()
    const navigate = useNavigate()
    const path = orgUnit?.path.split('/')

    const initiallyExpanded =
        path?.length > 2
            ? [path.slice(0, -1).join('/')]
            : roots?.map((r) => r.path)

    const selected = orgUnit?.path ? [orgUnit.path] : []
    if (loading) {return <CircularLoader />}
    if (error) {return <NoticeBox title="Error loading user org units">{error.message}</NoticeBox>}

    //const onChange = (orgUnit) => navigate(`/assessments/${orgUnit.id}`)
    const onChange = (orgUnit) => setOrgUnit(orgUnit)
    const allowedOrgUnitIds = ["bqgW6c9CFxr", "mK5qh5OFbyW"]

    return roots ? (
        <div className={styles.container}>

            <div className={styles.orgUnitTree}>
                <OrganisationUnitTree
                    roots={roots.map((r) => r.id)}
                    selected={selected}
                    onChange={onChange}
                    singleSelection={true}
                    initiallyExpanded={initiallyExpanded}
                />
            </div>
        </div>
    ) : null
}

export default OrgUnitTree
