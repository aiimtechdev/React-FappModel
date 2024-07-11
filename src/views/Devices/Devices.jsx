import React from 'react';
import HtmlHead from 'components/html-head/HtmlHead';
import { Row ,Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import SiteDataGrid from 'components/DataGrid/SiteDataGrid';
import DeviceAddEdit from './DeviceAddEdit';

const DevicesPage = ({ location }) => {
  const deviceFilter = location.state ? location.state.type : 'All';
  const title = 'Devices';
  const description = 'Welcome to Devices page design.';
  const defaults = {
    sort: {
      id: 'createdDate',
      desc: true
    }, pageSize: 10,
    hiddenControls: ['Title'],
    dvceFilterType: deviceFilter
  }
  const dvceActions = ['Edit', 'View', 'Delete'];
  const dvceColumns = [
    {
      Header: 'Register', accessor: 'dvceReg', sortable: true, headerStyles: {width: '10%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Name', accessor: 'dvceName', sortable: true, headerStyles: {width: '17%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Type', accessor: 'deviceType', sortable: true, headerStyles: {width: '8%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Allotted To', accessor: 'customerName', sortable: true, headerStyles: {width: '20%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Created On', accessor: 'createdDate', sortable: true,
      headerClassName: 'text-muted text-small text-uppercase', headerStyles: {width: '16%'}
    },{
      Header: 'Working', accessor: 'isActive', sortable: true,  Cell: ({ row }) => {
        return ( 
                  <div>
                    <OverlayTrigger placement="top" className="text-success" overlay={<Tooltip id="tooltip-top" >{(row.original.isActive) ?'Active': 'Inactive'}</Tooltip>}>
                          <div className="d-inline-block mx-2">
                              <CsLineIcons icon={(row.original.isActive) ?'check-circle': 'close-circle'} className={(row.original.isActive) ?'text-success': 'text-danger'} size="20" />
                          </div>
                    </OverlayTrigger>
                  </div>
                )
      },
      headerClassName: 'text-muted text-small text-uppercase', headerStyles: {width: '12%'}
    }
  ];
  return (
    <>
      <HtmlHead title={title} description={description} />
      <Row>
        <Row className='mb-4 mx-0'>
          <Row className="g-0 mb-2 mb-sm-0">
            <NavLink className="muted-link d-inline-block hidden breadcrumb-back w-auto" to="/dashboard">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Dashboard</span>
            </NavLink>
          </Row>
          <Row className="g-0 mb-2 mb-sm-0">
            <h1 className="mb-0 pb-0 text-primary" id="title">{title}</h1>
          </Row>
        </Row>
        <SiteDataGrid
          title="Devices"
          element="Device"
          elements="Devices"
          searchBy="Register"
          colCnfg={dvceColumns}
          actions={dvceActions}
          editModal={DeviceAddEdit}
          defaults={defaults}
          keyCol="dvceId"
          endPoint="/device"
          viewPage="/devices/details"
          minWidth="1000px"
          noDataMsg="Click the button below to create new device"
          check={true}
        />
      </Row>
    </>
  );
};

export default DevicesPage;
