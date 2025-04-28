import { useDataQuery, useDataEngine } from '@dhis2/app-runtime'
import { useAlert } from '@dhis2/app-runtime';
import {
    CircularLoader,
    NoticeBox,
    IconInfo16,
    IconChevronUp24,
    IconChevronDown24,
    Button,
} from '@dhis2/ui'
import { CalendarInput } from '@dhis2/ui';
import React, { useEffect, useState,useCallback } from 'react'
import {useNavigate, useParams} from "react-router-dom";
import exploreStore from "../../store/exploreStore";

const query = {
    event: {
        resource: 'events',
        id: ({ eventId }) => eventId,
        params: {
            fields: ['event', 'dataValues[dataElement,value]', 'program', 'programStage', 'orgUnit', 'eventDate'],
        },
    }
}

const EventViewer = () => {
    const { orgUnit,programsList,eventOrgUnit } = exploreStore()
    const [values, setValues] = useState({})
    const [openSections, setOpenSections] = useState({})
    const [eventMeta, setEventMeta] = useState(null)
    const engine = useDataEngine()
    const navigate = useNavigate()
    const { programId, eventId } = useParams()
    const [currentOrgUnit, setCurrentOrgunit] = useState(orgUnit ?? eventOrgUnit )
    const [openGuideId, setOpenGuideId] = useState(null)
    const [assessmentDate, setAssessmentDate] = useState(null);
    const { show } = useAlert(
        ({message}) => message,
        ({options}) => (options)
    )
    const existingProgram = programsList.find((p) => p.programId === programId)?.program

    const { loading, error, data } = useDataQuery(query, {
        variables: { eventId },
    })

    useEffect(() => {
        if (!currentOrgUnit) {
            navigate(`/assessments/${programId}`);
            return;
        }
        const shouldNavigate = orgUnit && orgUnit?.id !== currentOrgUnit.id;
        if (shouldNavigate) {
            navigate(`/assessments/${programId}`);
        }
    }, [orgUnit, currentOrgUnit]);

    useEffect(() => {
        if (data?.event?.dataValues) {
            let mapped = data.event.dataValues.reduce(
                (acc, dv) => ({ ...acc, [dv.dataElement]: dv.value }),
                {}
            )

            setEventMeta({
                event: data.event.event,
                program: data.event.program,
                programStage: data.event.programStage,
                orgUnit: data.event.orgUnit,
                eventDate: data.event.eventDate,
            })
            setAssessmentDate(formatDateString(data.event.eventDate))

            const saveKey = `${(orgUnit ?? eventOrgUnit)?.id}-${programId}-${formatDateString(data.event.eventDate)}`;
            const draft = localStorage.getItem(saveKey);

            if (draft) {
                try {
                    const parsedDraft = JSON.parse(draft);
                    if (parsedDraft && typeof parsedDraft === 'object') {
                        console.log('Found draft, merging into event data');
                        mapped = { ...mapped, ...parsedDraft };
                    }
                } catch (e) {
                    console.error('Error parsing saved draft:', e);
                }
            }
            setValues(mapped)

        }
        
        if (data?.program?.programStages?.[0]?.programStageSections) {
            const sectionMap = Object.fromEntries(
                data.program.programStages[0].programStageSections.map((s) => [s.id, false])
            )
            setOpenSections(sectionMap)
        }
    }, [data])

    const programStage = existingProgram?.[0]?.programStages?.[0]
    const sections = programStage?.programStageSections ?? []
    const elementsMap = Object.fromEntries(
        programStage?.programStageDataElements.map((psde) => [
            psde.dataElement.id,
            psde.dataElement,
        ]) ?? []
    )

    const toggleSection = (id) => {
        setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const handleOptionSelect = (dataElementId, value) => {
        setValues((prev) => ({ ...prev, [dataElementId]: value }))
    }

    const saveToLocalStorage = () => {
        const saveKey = `${currentOrgUnit.id}-${programId}-${assessmentDate}`;
        alert(saveKey)
        const payload = values
        alert(JSON.stringify(payload))
        localStorage.setItem(saveKey, JSON.stringify(payload));
        show({message: "Data saved locally successfully!", options:{ success: true, duration: 1500 }});
    };

    const handleSave = async () => {
        const payload = {
            program: eventMeta?.program ?? programId,
            programStage: eventMeta?.programStage,
            orgUnit: eventMeta?.orgUnit?.id ?? currentOrgUnit?.id,
            eventDate:  new Date(assessmentDate).toISOString().split('T')[0],
            dataValues: Object.entries(values).map(([dataElement, value]) => ({
                dataElement,
                value,
            })),
        }

        const isUpdate = !!eventMeta?.event

        try {
            if (isUpdate) {
                await engine.mutate({
                    resource: `events/${eventMeta.event}`,
                    type: 'update',
                    data: payload,
                })
                show({message: "Assessment updated successfully!", options:{ success: true, duration: 1500 }});
            } else {
                await engine.mutate({
                    resource: 'events',
                    type: 'create',
                    data: payload,
                })
                show({message: "New assessment created successfully!", options:{ success: true, duration: 1500 }});
            }
            navigate(`/assessments/${programId}`);
        } catch (err) {
            console.error(err)
            show({message: "Error occurred with saving to server.", options:{ warning: true, duration: 1500 }});
        }
    }


    const formatDateString = (dateString) => {
        if (!dateString) {return null;}
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return null;
        }
    };

    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


    const handleDateChange = useCallback((date) => {
        const selectedDateObj = new Date(date.calendarDateString);
        const todayObj = new Date();
        if (selectedDateObj > todayObj) {
            show({message: "Future dates cannot be selected.", options:{  duration: 1500 }});
            return;
        }
        setAssessmentDate(date.calendarDateString);
    }, [show, today]);

    if (loading) {return <CircularLoader />}
    if (error) {return <NoticeBox title="Error fetching events">{error.message}</NoticeBox>}



    return (
        <div style={{ fontFamily: 'Roboto, sans-serif', color: '#333',padding: '1rem', }}>
            <div
                style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: 6,
                    backgroundColor: '#f9f9f9'
                }}

            >
                <h2 style={{ margin: '0 0 0.5rem', color: '#0075c9' }}>
                    {programStage?.name || 'CCV-HFAT Event Assessment'}
                </h2>
                <p style={{ margin: '0 0 0.25rem', color: '#444' }}>
                    Review and update checklist responses for <strong>Org Unit:</strong> {currentOrgUnit?.displayName ?? 'N/A'}
                </p>
                <div style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    color: '#555',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '1rem',
                }}>
                    <span>Assessment Date:</span>
                    <CalendarInput
                        label=""
                        date={formatDateString(assessmentDate || eventMeta?.eventDate)}
                        onDateSelect={handleDateChange}
                        inputWidth='180px'
                        format="yyyy-MM-dd"
                        calendar="gregory"
                        locale="en-GB"
                        maxDate={todayFormatted}
                        pastOnly
                    />
                </div>
            </div>

            {sections.map((section) => (
                <div key={section.id} style={{ marginBottom: '0.2rem', border: '1px solid #ddd', borderRadius: 6 }}>
                    <div
                        onClick={() => toggleSection(section.id)}
                        style={{
                            cursor: 'pointer',
                            padding: '1rem 0.75rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #e0e0e0',
                        }}
                    >
                        <span style={{ color: '#0075c9', fontWeight: 600, textTransform: 'uppercase', fontSize: '14px' }}>
                            {section.displayName ?? section.name} ({section.dataElements.length})
                        </span>
                        {openSections[section.id] ? <IconChevronUp24 /> : <IconChevronDown24 />}
                    </div>

                    {openSections[section.id] && (
                        <div style={{ padding: '1rem' }}>
                            {section.dataElements.map((de, index) => {
                                const dataElement = elementsMap[de.id]
                                const selected = values[de.id]
                                const options = dataElement.optionSet?.options ?? []

                                return (
                                    <div
                                        key={de.id}
                                        style={{
                                            borderBottom: '1px solid #e0e0e0',
                                            paddingBottom: '1.5rem',
                                            marginBottom: '1.5rem',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                marginBottom: '0.25rem',
                                                color: '#555',
                                            }}
                                        >
                                            CHECKLIST {index + 1}/{section.dataElements.length}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                marginBottom: '0.75rem',
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {dataElement.formName || dataElement.name}
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '12px',
                                                width: '100%',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            {options.map((option) => (
                                                <div
                                                    key={option.id}
                                                    onClick={() => handleOptionSelect(de.id, option.code)}
                                                    style={{
                                                        flex: '0 0 calc(20% - 10px)',
                                                        textAlign: 'center',
                                                        padding: '12px 0',
                                                        borderRadius: 6,
                                                        border: '1px solid #ccc',
                                                        backgroundColor:
                                                            selected === option.code ? '#e1f0ff' : '#fff',
                                                        fontWeight: 500,
                                                        fontSize: '14px',
                                                        color: '#222',
                                                        cursor: 'pointer',
                                                        boxShadow:
                                                            selected === option.code
                                                                ? '0 0 0 2px #1976d2 inset'
                                                                : 'none',
                                                    }}
                                                >
                                                    {option.code}
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                                            <Button
                                                small
                                                icon={<IconInfo16 />}
                                                onClick={() =>
                                                    setOpenGuideId((prev) => (prev === de.id ? null : de.id))
                                                }
                                            >
                                                Score Guide
                                            </Button>
                                            {openGuideId === de.id && dataElement.description && (                                            <div
                                                style={{
                                                    backgroundColor: '#fff',
                                                    padding: '1rem',
                                                    border: '1px solid #eee',
                                                    borderRadius: 6,
                                                    marginTop: '1rem',
                                                    fontSize: '14px',
                                                    color: '#333',
                                                    whiteSpace: 'pre-line',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <strong>Level of Preparedness Score:</strong>
                                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', color: '#B7B747' }}>
                                                    <span style={{ fontSize: '18px', marginRight: '10px', color:'#B7B747' }}>⚠️</span>
                                                    <span><strong>1</strong> is the lowest while <strong>5</strong> is the highest.</span>
                                                </div>
                                                <div  style={{  marginTop: '-1.5rem', fontSize: '14px', }} dangerouslySetInnerHTML={{ __html: dataElement.description }} />
                                            </div>)}

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            ))}

            {/* Save button */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: '0.5rem',
                    marginBottom: '0.5rem',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                }}
            >
                {/* Save and Continue - Blue filled */}
                <button
                    style={{
                        backgroundColor: '#0075c9',
                        color: '#fff',
                        padding: '1rem',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '16px',
                        cursor: 'pointer',
                        width: '40%',
                    }}
                    onClick={saveToLocalStorage} // you can link this to navigation if needed
                >
                    Save and Continue
                </button>

                {/* Save and finish later - Outlined */}
                <button
                    style={{
                        backgroundColor: '#fff',
                        color: '#0075c9',
                        padding: '1rem',
                        border: '1px solid #0075c9',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '16px',
                        cursor: 'pointer',
                        width: '40%',
                    }}
                    onClick={handleSave}
                >
                    Save and Finish later
                </button>
            </div>
        </div>
    )
}

export default EventViewer
