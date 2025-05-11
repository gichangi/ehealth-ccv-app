import useAppSettings from '../../hooks/useAppSettings.js'
import TextInput from "./TextInput";
import useDataStore from '../../hooks/useDataStore.js';

const AssessmentToolsSettings = () => {
    const { settings, changeSetting } = useAppSettings()

    if (!settings) {
        return null
    }

    const {
        ccvHFATFlood='A294977888e',
        ccvHFATHeatwave ='pFSueR4Uwyy',
        ccvHFATDrought,
        ccvHFATDashboard,

    } = settings

    return (
        <>
            <h2>Assessment Tools Configuration</h2>
            <TextInput
                id="ccvHFATFlood"
                label='CCV-HFAT Flood Assessment'
                value={ccvHFATFlood}
                onChange={changeSetting}
                inputWidth="100px"
            />

            <TextInput
                id="ccvHFATHeatwave"
                label='CCV-HFAT Heatwave Assessment'
                value={ccvHFATHeatwave}
                onChange={changeSetting}
                inputWidth="100px"
            />

            <TextInput
                id="ccvHFATDrought"
                label='CCV-HFAT Adaptation Drought'
                value={ccvHFATDrought}
                onChange={changeSetting}
                inputWidth="100px"
            />

            <TextInput
                id="ccvHFATDashboard"
                label='CCV-HFAT Dashboard URL'
                value={ccvHFATDashboard}
                onChange={changeSetting}
                inputWidth="100px"
            />

        </>
    )
}

export default AssessmentToolsSettings
