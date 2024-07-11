/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Card, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { NavLink, Redirect, useParams, useHistory} from 'react-router-dom';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import SiteDataGrid from 'components/DataGrid/SiteDataGrid';
import ChartStreamingLine from 'components/charts/ChartStreamingLine';
import SystemStatusGChart from 'components/charts/systemReportCharts/SystemStatusGChart';
import WarningStatusGChart from 'components/charts/systemReportCharts/WarningStatusGChart';
import FanEnableGChart from 'components/charts/systemReportCharts/FanEnableGChart';
import FanOutputGChart from 'components/charts/systemReportCharts/FanOutputGChart';
import Alarm1GChart from 'components/charts/systemReportCharts/Alarm1GChart';
import Alarm2GChart from 'components/charts/systemReportCharts/Alarm2GChart';
import DamperOutputGChart from 'components/charts/systemReportCharts/DamperOutputGChart';
import GaugeChart from 'react-gauge-chart';
import io from 'socket.io-client'
import { apiRequest } from "utils/request";

const DeviceDetailsPage = ({ location }) => {

  const title = 'Device Details';
  let { id } = useParams();
  const history = useHistory();

  const DeviceDetails = async () => {
    let reqUrl =  await `/device/${id}`
    if(id) {
        const resp = await  apiRequest(reqUrl, 'GET', undefined, localStorage.getItem("token"));
        if(resp.status === 'success' && resp.data.status === 'success') {
          await setdevDetail(resp.data.data[0])
          await setDeviceReg(resp.data.data[0].dvceReg);
        } else return ( history.replace("/devices"))
    }  else return ( history.replace("/devices"))
  } 

  const percent = (tot, succ) => (succ / tot);
  const [systemStatus, setSystemStatus] = useState(0);
  const [warningStatus, setWarningStatus] = useState(100);
  const [fanEnable, setFanEnable] = useState(0);
  const [fanOutput, setFanOutput] = useState(100);
  const [alarm1, setAlarm1] = useState(0);
  const [alarm2, setAlarm2] = useState(0);
  const [damperOutput, setDamperOutput] = useState(0);

  const [sensor, setSensor] = useState([0, 0, 0]);

  const [lpLimit, setLpLimit] = useState(0);
  const [hpLimit, setHpLimit] = useState(0);

  const [socket, setSocket] = useState();
  const [deviceReg, setDeviceReg] = useState();
  const [devDetail, setdevDetail] = useState();

  useEffect(() => {
    let socketOptions = {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: localStorage.getItem('token'),
            UserType: 1
          }
        }
      }
    };
    const newSocket = io(import.meta.env.VITE_SOCK_IP, socketOptions)
    setSocket(newSocket);
  }, [setSocket])

  useEffect(() => {
    socket?.connect();
    return () => {
      socket?.off("sendMessage", null);
      socket?.disconnect();
    }
  }, [socket, deviceReg])

  useEffect(async () => {
    await socket?.emit("sendMessage", { "deviceReg": deviceReg });
  }, [deviceReg])
  useEffect(async () => {
    if (location.state === undefined)  await  DeviceDetails();
    else {
        setdevDetail(location.state.row)
        setDeviceReg(location.state.row.dvceReg);
    }
   }, [])

  const messageListener = async (message) => {
    if (message.length != 0) {
      if (message === "something went wrong") {
      } else {
        let sensorsData = [message[0]['deviceData']["state"]["reported"]['Sensor1'], message[0]['deviceData']["state"]["reported"]['Sensor2'], message[0]['deviceData']["state"]["reported"]['Sensor3']];
        await setSensor(sensorsData);
        lpLimit != message[0]['deviceData']["state"]["reported"]['LoPressLimit'] && await setLpLimit(message[0]['deviceData']["state"]["reported"]['LoPressLimit'])
        hpLimit != message[0]['deviceData']["state"]["reported"]['HighPressLimit'] && await setHpLimit(message[0]['deviceData']["state"]["reported"]['HighPressLimit'])
        systemStatus != message[0]['deviceData']["state"]["reported"]['SystemStatus'] && await setSystemStatus(message[0]['deviceData']["state"]["reported"]['SystemStatus'])
        warningStatus != message[0]['deviceData']["state"]["reported"]['WarnStatus'] && await setWarningStatus(message[0]['deviceData']["state"]["reported"]['WarnStatus'])
        fanEnable != message[0]['deviceData']["state"]["reported"]['FanEnable'] && await setFanEnable(message[0]['deviceData']["state"]["reported"]['FanEnable'])
        fanOutput != message[0]['deviceData']["state"]["reported"]['FanOuput'] && await setFanOutput(message[0]['deviceData']["state"]["reported"]['FanOuput'])
        alarm1 != message[0]['deviceData']["state"]["reported"]['Alarm1'] && await setAlarm1(message[0]['deviceData']["state"]["reported"]['Alarm1'])
        alarm2 != message[0]['deviceData']["state"]["reported"]['Alarm2'] && await setAlarm2(message[0]['deviceData']["state"]["reported"]['Alarm2'])
        damperOutput != message[0]['deviceData']["state"]["reported"]['DamperOutput'] && await setDamperOutput(message[0]['deviceData']["state"]["reported"]['DamperOutput'])
      }
    }
  }
  useEffect(() => {
    socket?.on('recMessage', (messageListener));

    return () => {
      socket?.off("recMessage");
    }
  }, [messageListener])

  const tstFnDefaults = {
    sort: {
      id: 'testTiming',
      desc: true
    }, pageSize: 5,
    hiddenControls: ['PageSize', 'Edit', 'Delete', 'Add', 'Search']
  }
  const tstFnActions = ['View'];
  const tstColumns = [
    {
      Header: 'Test Date', accessor: 'testDate', sortable: true, headerStyles: { width: '15%' },
      headerClassName: 'text-muted text-small text-uppercase'
    }, {
      Header: 'Test Timing', accessor: 'testTiming', sortable: true,
      headerClassName: 'text-muted text-small text-uppercase', headerStyles: { width: '15%' }
    }, {
      Header: 'Status', accessor: 'testStatus', sortable: true, Cell: ({ row }) => {
        return (
          <div>
            <OverlayTrigger placement="top" className="text-success" overlay={<Tooltip id="tooltip-top" >{(row.original.testStatus === 'success') ? 'Success' : 'Failed'}</Tooltip>}>
              <div className="d-inline-block mx-2">
                <CsLineIcons icon={(row.original.testStatus === 'success') ? 'check-circle' : 'close-circle'} className={(row.original.testStatus === 'success') ? 'text-success' : 'text-danger'} size="20" />
              </div>
            </OverlayTrigger>
          </div>
        )
      },
      headerClassName: 'text-muted text-small text-uppercase', headerStyles: { width: '9%' }
    }
  ];

  return (
    <div>
      <div className="page-title-container">
        <Row className="g-0">
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back w-auto" to="/devices">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Devices</span>
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
            <Card className="mb-5" style={{ maxWidth: '500px', margin: 'auto' }} >
              <Card.Body className="mb-n5">
                <div className='d-flex justify-content-center'>
                  <p className="bg-primary" style={{ width: '100px', height: '100px', borderRadius: '50%', fontSize: '35px', color: '#fff', textAlign: 'center', lineHeight: '100px', margin: '20px 0' }}> <CsLineIcons icon="cpu" className="text-white" size="35" /></p>
                </div>
                <div className="d-flex align-items-center flex-column mb-1">
                  <div className="mb-5 d-flex align-items-center flex-column">
                    <div className="h2 text-primary mb-1">{(devDetail && devDetail.dvceName)}</div>
                    <div className="h6">
                      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Device Type</Tooltip>}>
                        <span className="align-middle">{devDetail && devDetail.deviceType}</span>
                      </OverlayTrigger>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <strong className="text-medium text-primary">Device Details</strong>
                  <Row className="g-0 my-2">
                    <Col xxl="7" xl="12" md="6">
                      <div className="d-flex mb-2">
                        <div className="sw-3 me-1">
                          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Device Register</Tooltip>}>
                            <a><CsLineIcons icon="cpu" size="18" className="text-primary" /> </a>
                          </OverlayTrigger>
                        </div>
                        <div className="text-alternate">{devDetail &&  devDetail.dvceReg}</div>
                      </div>
                    </Col>
                    <Col xxl="5" xl="12" md="6">
                      <div className="d-flex mb-2">
                        <div className="sw-3 me-1">
                          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">Created Date</Tooltip>}>
                            <a><CsLineIcons icon="calendar" size="18" className="text-primary" /></a>
                          </OverlayTrigger>
                        </div>
                        <div className="text-alternate">{devDetail && devDetail.createdDate}</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Col xl="8" md="12" sm="12">
        { devDetail &&
          <SiteDataGrid
            title="Test Function Data"
            element="Test Function Data"
            elements="Test Function Data"
            colCnfg={tstColumns}
            actions={tstFnActions}
            defaults={tstFnDefaults}
            keyCol="testId"
            endPoint="/testFunction"
            listFilter={"&dvceId=" + (devDetail && devDetail.dvceId ? devDetail.dvceId : 0) + "&custId=" + (devDetail && devDetail.custId ? devDetail.custId : 0)}
            minWidth="750px"
            noDataMsg="Currently, There are no test function data for this device"
          />
        }
        </Col>
      </Row>
      <Row>
        <section className="scroll-section" id="smallDoughnutCharts">
          <h2 className="small-title">Pressure Limits</h2>
          <Row className="row g-2 mb-5">
            <Col xs="12" md="6" xl="6">
              <Card className="sh-13 p-3">
                <div className='d-flex h-100'>
                  <div style={{ flex: '0.7', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <div style={{ textTransform: 'uppercase' }}>High Pressure Limit</div>
                  </div>
                  <div style={{ flex: '0.3' }}>
                    <GaugeChart id="hpLimit" style={{ width: '160px', height: '100%', fill: 'black' }}
                      nrOfLevels={3}
                      animate={false}
                      colors={["#00FF00AB", "#FFFF00AB", "#FF0000AB"]}
                      textColor='var(--primary)'
                      percent={percent(100, hpLimit)}
                    />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs="12" md="6" xl="6">
              <Card className="sh-13 p-3">
                <div className='d-flex h-100'>
                  <div style={{ flex: '0.7', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <div style={{ textTransform: 'uppercase' }}>Low Pressure Limit</div>
                  </div>
                  <div style={{ flex: '0.3' }}>
                    <GaugeChart id="lpLimit" style={{ width: '160px', height: '100%', fill: 'black' }}
                      nrOfLevels={3}
                      animate={false}
                      colors={["#FF0000AB", "#FFFF00AB", "#00FF00AB"]}
                      textColor='var(--primary)'
                      percent={percent(100, lpLimit)}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </section>
      </Row>
      <Row>
        <section className="scroll-section" id="smallDoughnutCharts">
          <h2 className="small-title">System Reporting (Live)</h2>
          <Row className="row g-2 mb-5">
            <Col xs="12" md="6" xl="4">
              <Card className="sh-13 p-3">
                <SystemStatusGChart value={systemStatus} />
              </Card>
            </Col>
            <Col xs="12" md="6" xl="4">
              <Card className="sh-13 p-3" id="test2">
                <WarningStatusGChart value={warningStatus} />
              </Card>
            </Col>
            <Col xs="12" md="6" xl="4">
              <Card className="sh-13 p-3">
                <FanEnableGChart value={fanEnable} />
              </Card>
            </Col>
            <Col xs="12" md="6" xl="4">
              <Card className="sh-13 p-3">
                <FanOutputGChart value={fanOutput} />
              </Card>
            </Col>
            <Col xs="12" md="6" xl="4">
              <Card className="sh-13 p-3">
                <Alarm1GChart value={alarm1} />
              </Card>
            </Col>
            <Col xs="12" md="6" xl="4">
              <Card className="sh-13 p-3">
                <Alarm2GChart value={alarm2} />
              </Card>
            </Col>
            <Col xs="12" md="6" xl="4">
              <Card className="sh-13 p-3">
                <DamperOutputGChart value={damperOutput} />
              </Card>
            </Col>
          </Row>
        </section>
      </Row>
      <Row>
        <section className="scroll-section" id="streamingLineChart">
          <h2 className="small-title">Sensors (Live)</h2>
          <Card body className="mb-5">
            <div className="sh-35">
              <ChartStreamingLine sensor={sensor} />
            </div>
          </Card>
        </section>
      </Row>
    </div>
  );
}

export default DeviceDetailsPage;