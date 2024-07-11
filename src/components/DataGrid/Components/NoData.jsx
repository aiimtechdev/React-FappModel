/* eslint-disable */
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React from 'react'
import { Card, Button } from 'react-bootstrap';

const NoData = ({ tableInstance }) => {
    const { defaults, element, title, setIsOpenAddEditModal, data, noDataMsg, term, dvceFilterType } = tableInstance;
    console.log('no data', dvceFilterType)

    return (
        <div className="d-flex justify-content-center align-items-center py-2">
            <Card className="mt-5 hover-scale-up position-relative">
                <Card.Body className="text-center d-flex justify-content-evenly">
                    <div className="sw-15 sh-15 d-inline-block d-flex justify-content-center align-items-center my-auto" style={{borderRadius:'40%'}}>
                        <i className="bi-inboxes" style={{fontSize: '7rem', color: '#bdbdbd'}}/>
                    </div>
                    <div className="d-flex flex-column ms-2 justify-content-center align-items-center">
                        <p className="heading mb-n1" style={{fontWeight:"600", fontSize:"1.5rem"}}>No {title} Found!</p>
                        <div className="text-semi-large text-muted my-3" style={{maxWidth: '250px'}}>
                            {/* { defaults.hiddenControls.includes('Add') ? `Please Contact your administrator to add ${title}.` : `Click the button below to create new ${element}.` } */}
                            { dvceFilterType === 'All' && !term && noDataMsg}
                        </div>
                        { dvceFilterType === 'All' && !term && !defaults.hiddenControls.includes('Add') && (
                            <Button variant='outline-primary' onClick={()=>setIsOpenAddEditModal(true)}><CsLineIcons icon='plus' /> Add {element}</Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default NoData;
