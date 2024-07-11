import React from 'react';
import HtmlHead from 'components/html-head/HtmlHead';
import { Row ,Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import SiteDataGrid from 'components/DataGrid/SiteDataGrid';
import CompanyAddEdit from './CompanyAddEdit';

const CompanyPage = () => {
  const title = 'Customers';
  const description = 'Welcome to Customers page design.';
  const defaults = {
    sort: {
      id: 'createdDate',
      desc: true
    }, pageSize: 10,
    hiddenControls: ['Title']
  }
  const cmpnyActions = ['Edit', 'View', 'Delete'];
  const cmpnyColumns = [
    {
      Header: 'Name', accessor: 'customerName', sortable: true, headerStyles: {width: '15%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Email', accessor: 'email', sortable: true, headerStyles: {width: '15.25%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Location', accessor: 'city', sortable: true, headerStyles: {width: '13%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Devices', accessor: 'deviceCount', sortable: true, headerStyles: {width: '12%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Joined On', accessor: 'createdDate', sortable: true,
      headerClassName: 'text-muted text-small text-uppercase', headerStyles: {width: '12.35%'}
    },{
      Header: 'Status', accessor: 'isActive', sortable: true,  Cell: ({ row }) => {
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
      headerClassName: 'text-muted text-small text-uppercase', headerStyles: {width: '9%'}
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
          title="Customers"
          element="Customer"
          elements="Customers"
          searchBy='Name'
          colCnfg={cmpnyColumns}
          actions={cmpnyActions}
          editModal={CompanyAddEdit}
          defaults={defaults}
          endPoint="/customer"
          keyCol="custId"
          viewPage="/customers/details"
          minWidth='1100px'
          noDataMsg="Click the button below to create new Customer"
          check={true}
        />
      </Row>
    </>
  );
};

export default CompanyPage;
