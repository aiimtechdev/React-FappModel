/* eslint-disable */
import React, { useState, useEffect }  from 'react';
import { Card, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { NavLink, Redirect,  useParams, useHistory} from 'react-router-dom';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import SiteDataGrid from 'components/DataGrid/SiteDataGrid';
import DeviceAddEdit from 'views/Devices/DeviceAddEdit';
import UserAddEdit from './UserAddEdit';
import HtmlHead from 'components/html-head/HtmlHead';
import { apiRequest } from "utils/request";

const CompanyDetailsPage = ({ location }) => {
  //const cusDetail = location.state ? location.state.row : '';
  const [cusDetail, setcusDetail] = useState();

  let { id } = useParams();
  const history = useHistory();

  const custDetail = async () => {
    let reqUrl =  await `/customer/${id}`
    if(id) {
      document.body.classList.add('spinner');
        const resp = await  apiRequest(reqUrl, 'GET', undefined, localStorage.getItem("token"));
        if(resp.status === 'success' && resp.data.status === 'success') {
          await setcusDetail(resp.data.data[0])
          document.body.classList.remove('spinner');
          //await setDeviceReg(resp.data.data[0].dvceReg);
        } else {
          document.body.classList.remove('spinner');
          return ( history.replace("/customers"))
        }
    }  else{
      document.body.classList.remove('spinner'); 
      return ( history.replace("/customers"))
    } 
  }
  

  
  
  
  const title = 'Customer Details';
  const description = 'Welcome to Customer Details page design.';
  
 
  let avtrTxt = '';
   cusDetail && cusDetail.customerName.split(' ').map(wrd => avtrTxt += wrd.charAt(0).toUpperCase())

  useEffect(async () => {
    if (location.state === undefined)  await  custDetail();
    else {
      setcusDetail(location.state.row)
    }
   }, [])

  const dvceDefaults = {
    sort: {
      id: 'createdDate',
      desc: true
    }, pageSize: 5,
    option: {
      custId: {
        value: cusDetail && cusDetail.custId,
        label: cusDetail && cusDetail.customerName
      }
    }, hiddenControls: ['PageSize']
  }
  const dvceActions = ['Edit', 'View', 'Delete'];
  const dvceColumns = [
    {
      Header: 'Register', accessor: 'dvceReg', sortable: true, headerStyles: {width: '13%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Name', accessor: 'dvceName', sortable: true, headerStyles: {width: '15%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Type', accessor: 'deviceType', sortable: true, headerStyles: {width: '9%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Created On', accessor: 'createdDate', sortable: true,
      headerClassName: 'text-muted text-small text-uppercase', headerStyles: {width: '12%'}
    },{
      Header: 'Active', accessor: 'isActive', sortable: true,  Cell: ({ row }) => {
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

  const usrDefaults = {
    sort: {
      id: 'createdDate',
      desc: true
    }, pageSize: 5,
    option: {
      custId: {
        value: cusDetail && cusDetail.custId,
        label: cusDetail && cusDetail.customerName
      }
    }, hiddenControls: []
  }
  const usrActions = ['Edit', 'Delete'];
  const usrColumns = [
    {
      Header: 'Name', accessor: 'fullName', sortable: true, headerStyles: {width: '18%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'email', accessor: 'email', sortable: true, headerStyles: {width: '15%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'City', accessor: 'city', sortable: true, headerStyles: {width: '10%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Role', accessor: 'userRole', sortable: true, headerStyles: {width: '9%'},
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Created On', accessor: 'createdDate', sortable: true,
      headerClassName: 'text-muted text-small text-uppercase', headerStyles: {width: '15%'}
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

  return (<>
    <HtmlHead title={title} description={description} />
    <div>
      <div className="page-title-container">
        <Row className="g-0">
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back w-auto" to="/customers">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Customers</span>
            </NavLink>
          </Col>
        </Row>
        <div>
          <Row className="g-0"> 
            <Col className="col-auto mb-3 mb-sm-0 me-auto text-primary">
              <h1 className="mb-0 pb-0 text-primary" id="title">
                {title}
              </h1>
            </Col>  
          </Row>
        </div>
      </div>
      <Row>
        <Col xl="4">
          <div>
            <h2 className="small-title">Info</h2>
            <Card className="mb-5" style={{maxWidth: '500px', margin: 'auto'}} >
              <Card.Body className="mb-n5">
                <div className='d-flex justify-content-center'>
                  <p className="bg-primary" style={{width:'100px', height:'100px', borderRadius:'50%', fontSize:'35px', color:'#fff', textAlign:'center', lineHeight:'100px', margin:'20px 0'}}>{avtrTxt}</p>
                </div>
                <div className="d-flex align-items-center flex-column mb-1">
                  <div className="mb-5 d-flex align-items-center flex-column">
                    <div className="h2 text-primary mb-1">{cusDetail && cusDetail.customerName}</div>
                    <div className="h6">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">City</Tooltip>}>
                      <span className="align-middle">{cusDetail && cusDetail.city}</span>
                      </OverlayTrigger>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <strong className="text-medium text-primary">Customer Details</strong>
                  <Row className="g-0 my-2">
                    <Col xxl="7" xl="12" md="6">
                      <div className="d-flex mb-2">
                        <div className="sw-3 me-1">
                          <CsLineIcons icon="building" size="18" className="text-primary" />
                        </div>
                        <div className="text-alternate">{cusDetail && cusDetail.customerName}</div>
                      </div>
                    </Col>
                    <Col xxl="5" xl="12" md="6">
                      <div className="d-flex mb-2">
                        <div className="sw-3 me-1">
                          <CsLineIcons icon="calendar" size="18" className="text-primary" />
                        </div>
                        <div className="text-alternate">{cusDetail && cusDetail.createdDate}</div>
                      </div>
                    </Col>
                    <Col xxl="7" xl="12" md="6">
                      <div className="d-flex mb-2">
                        <div className="sw-3 me-1">
                          <CsLineIcons icon="email" size="18" className="text-primary" />
                        </div>
                        <div className="text-alternate">{cusDetail && cusDetail.email}</div>
                      </div>
                    </Col>
                    <Col xxl="5" xl="12" md="6">
                      <div className="d-flex mb-2">
                        <div className="sw-3 me-1">
                          <CsLineIcons icon="phone" size="18" className="text-primary" />
                        </div>
                        <div className="text-alternate">{cusDetail && cusDetail.phoneNo}</div>
                      </div>
                    </Col>
                    <Col xl="12">
                      <div className="d-flex mb-2">
                        <div className="sw-3 me-1">
                          <CsLineIcons icon="pin" size="18" className="text-primary" />
                        </div>
                        <div className="text-alternate">
                          {cusDetail && cusDetail.addr_1 && (<><span>{cusDetail && cusDetail.addr_1}</span><br /></>)}
                          {cusDetail && cusDetail.addr_2 && (<><span>{cusDetail && cusDetail.addr_2}</span><br /></>)}
                          <span>{cusDetail && cusDetail.city}, {cusDetail && cusDetail.state}</span><br />
                          <span>{cusDetail && cusDetail.country}</span><br />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Col xl="8" md="12" sm="12">
          {
            cusDetail &&
          <SiteDataGrid
            title="Devices"
            element="Device"
            elements="Devices"
            searchBy='Register'
            colCnfg={dvceColumns}
            actions={dvceActions}
            editModal={DeviceAddEdit}
            defaults={dvceDefaults}
            keyCol="dvceId"
            endPoint="/device"
            listFilter={"&custId=" +  (cusDetail &&  cusDetail.custId ? cusDetail.custId : 0)}
            minWidth="800px"
            noDataMsg="Click the button below to create new device"
            viewPage="/devices/details"
            check={true}
          />
        }
        </Col>
      </Row>
      <Row>
        {
          cusDetail &&
        <SiteDataGrid
          title="Users"
          element="user"
          elements="Users"
          searchBy='Name'
          colCnfg={usrColumns}
          actions={usrActions}
          editModal={UserAddEdit}
          defaults={usrDefaults}
          keyCol="userId"
          endPoint="/user"
          listFilter={"&custId=" + (cusDetail &&  cusDetail.custId ? cusDetail.custId : 0)}
          minWidth="900px"
          noDataMsg="Click the button below to create new user"
          check={true}
        />
     }
      </Row>
    </div>
  </>
  );
}

export default CompanyDetailsPage;