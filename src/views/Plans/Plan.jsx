import React from 'react';
import { Row, Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import { NavLink } from 'react-router-dom';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import SiteDataGrid from 'components/DataGrid/SiteDataGrid';
import PlanAddEdit from './PlansAddEdit';

const PlanPage = () => {
  const title = 'Plans';
  const description = 'Welcome to Plans page.';
  const defaults = {
    sort: {
      id: 'planName',
      desc: true
    }, pageSize: 10,
    hiddenControls: ['Add', 'Delete', 'Title', 'PageSize'],
  }
  const dvceActions = ['Edit'];
  const dvceColumns = [
    {
      Header: 'ID', accessor: 'planId', sortable: true, headerStyles: {width: '10%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Name', accessor: 'planName', sortable: true, headerStyles: {width: '17%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Frequency', accessor: 'frequency', sortable: true, headerStyles: {width: '17%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'cost', accessor: d => `$ ${d.cost}`, sortable: true, headerStyles: {width: '20%'},
      headerClassName: 'text-muted text-small text-uppercase'
    },
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
          title="Plans"
          element="Plan"
          elements="Plan"
          searchBy="Name"
          colCnfg={dvceColumns}
          actions={dvceActions}
          editModal={PlanAddEdit}
          defaults={defaults}
          keyCol="planId"
          endPoint="/plan"
          viewPage="/plans/details"
          minWidth="950px"
          check={true}
        />
      </Row>
    </>
  );
};

export default PlanPage;
