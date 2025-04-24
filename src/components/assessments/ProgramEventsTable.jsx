import { useDataQuery } from '@dhis2/app-runtime'
import {
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
    CircularLoader,
    NoticeBox,
    Pagination,
    Button,
} from '@dhis2/ui'
import React, { useState, useEffect } from 'react'
import {useNavigate, useParams} from "react-router-dom";
import exploreStore from "../../store/exploreStore";
import EventViewer from "./EventViewer.tsx.jsx";


const query = {
    events: {
        resource: 'events',
        params: ({ page, pageSize, orgUnitId, programId }) => ({
            program: programId,
            paging: true,
            page,
            pageSize,
            ...(orgUnitId && { orgUnit: orgUnitId }),
            fields: ['event', 'eventDate', 'status', 'orgUnit[id,name]','createdByUserInfo','lastUpdatedByUserInfo'],
        }),
    },
}

const ProgramEventsTable = () => {
    const { programId } = useParams()
    const { orgUnit,setOrgUnit } = exploreStore()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const navigate = useNavigate()

    const { loading, error, data, refetch } = useDataQuery(query, {
        variables: {
            page,
            pageSize,
            orgUnitId: orgUnit?.id ?? null,
            programId,
        },
    })

    useEffect(() => {
        if (programId) {
            refetch({
                page,
                pageSize,
                orgUnitId: orgUnit?.id ?? null,
                programId,
            })
        }
    }, [page, pageSize, orgUnit?.id, programId, refetch])


    if (loading) {return <CircularLoader />}
    if (error) {return <NoticeBox title="Error fetching events">{error.message}</NoticeBox>}

    const events = data?.events?.events ?? []
    const pager = data?.events?.pager

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    padding: '0 1rem',
                }}
            >
                <div>
                    <h2 style={{ margin: 0 }}>Program Events</h2>
                    <p style={{ margin: 0, color: '#555' }}>
                        View, manage, and create new events for this program.
                    </p>
                </div>
                <Button
                    primary
                    onClick={() => navigate(`/assessments/${programId}/create`)}
                >
                    + Create New Event
                </Button>
            </div>
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Event ID</TableCellHead>
                        <TableCellHead>Event Date</TableCellHead>
                        <TableCellHead>Org Unit</TableCellHead>
                        <TableCellHead>Created By</TableCellHead>
                        <TableCellHead>Last Updated By</TableCellHead>
                        <TableCellHead>Status</TableCellHead>
                        <TableCellHead>Actions</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {events.map((event) => (
                        <TableRow key={event.event}>
                            <TableCell>{event.event}</TableCell>
                            <TableCell>{new Date(event.eventDate).toISOString().split('T')[0]}</TableCell>
                            <TableCell>{orgUnit?.displayName ?? 'N/A'}</TableCell>
                            <TableCell>{event.createdByUserInfo.username}</TableCell>
                            <TableCell>{event.lastUpdatedByUserInfo.username}</TableCell>
                            <TableCell>{event.status}</TableCell>
                            <TableCell>
                                <Button small onClick={() =>  navigate(`/assessments/${programId}/${event.event}`)}>View</Button>{' '}
                                <Button small destructive onClick={() => alert(`Delete ${event.event}`)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {pager && (
                <div style={{ marginTop: '16px' }}>
                    <Pagination
                        onPageSizeChange={(e) => setPageSize(e)}
                        onPageChange={(e) => setPage(e)}
                        page={pager.page}
                        pageSize={pager.pageSize}
                        total={pager.total}
                        isLastPage={pager.isLastPage}
                    />
                </div>
            )}
        </>
    )
}


export default ProgramEventsTable
