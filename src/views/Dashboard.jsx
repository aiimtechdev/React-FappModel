import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CarouselFlow from 'components/carousel/CarouselFlow';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import PerformanceChart from 'components/charts/PerformanceChart';
import { Link } from 'react-router-dom';
import { apiRequest } from "utils/request";

const DashboardPage = () => {
  const title = 'Dashboard';
  const description = 'Welcome to Dashboard page design.';
  const [totCusCon, setTotCusCon] = useState(0);
  const [totDvceCon, setTotDvceCon] = useState(0);
  const [actDvceCon, setActDvceCon] = useState(0);
  const [critDvceCon, setCritDvceCon] = useState(0);
  const [warnDvceCon, setWarnDvceCon] = useState(0);
  const [faultDvceCon, setFaultDvceCon] = useState(0);
  const [latestCustomersLs, setLatestCustomersLs] = useState([]);
  const [critDvceList, setCritDvceList] = useState([]);
  const [activeDeviceStat, setActiveDeviceStat] = useState([]);
  const [crticalDeviceStat, setCrticalDeviceStat] = useState([]);
  const [label, setLabel] = useState([
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  ]);
  const fetchData = React.useCallback(async () => {
    document.body.classList.add('spinner');
    let reqUrl = '/dashboard';
    const resp = await apiRequest(reqUrl, 'GET', undefined, localStorage.getItem("token"));
    if (resp.status === 'success' && resp.data.status === 'success') {
      setTotCusCon(resp.data.data.customersCount);
      setTotDvceCon(resp.data.data.totalDevicesCount);
      setActDvceCon(resp.data.data.activeDevicesCount);
      setCritDvceCon(resp.data.data.criticalDevicesCount);
      setWarnDvceCon(resp.data.data.warningDevicesCount);
      setFaultDvceCon(resp.data.data.faultDevicesCount);
      await setLatestCustomersLs(resp.data.data.latestCustomers);
      await setCritDvceList(resp.data.data.criticalDevicesList);
      await setActiveDeviceStat(resp.data.data.activeDeviceStat);
      await setCrticalDeviceStat(resp.data.data.crticalDeviceStat);
    }
    document.body.classList.remove('spinner');
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);
    return () => {
      clearInterval(intervalId);
    };
    
  }, []);

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Row>
        <Col>
          <section className="scroll-section" id="title">
            <div className="page-title-container">
              <h1 className="mb-0 pb-0 text-primary ">{title}</h1>
            </div>
          </section>
        </Col>
      </Row>
      <Row className="mb-3 g-2">
        <Col xs="6" md="4" lg="2">
          <Link to={{ pathname: "/customers" }}>
            <Card className="h-100 hover-scale-up cursor-pointer">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="bg-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center mb-4">
                  <CsLineIcons icon="building" className="text-white" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">CUSTOMERS</div>
                <div className="text-primary cta-4">{totCusCon}</div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col xs="6" md="4" lg="2">
          <Link to={{ pathname: "/devices", state: { type: "All" } }}>
            <Card className="h-100 hover-scale-up cursor-pointer">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="bg-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center mb-4">
                  <CsLineIcons icon="cpu" className="text-white" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">DEVICES</div>
                <div className="text-primary cta-4">{totDvceCon}</div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col xs="6" md="4" lg="2">
          <Link to={{ pathname: "/devices", state: { type: "Active" } }}>
            <Card className="h-100 hover-scale-up cursor-pointer">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="bg-success sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center mb-4">
                  <CsLineIcons icon="cpu" className="text-white" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">ACTIVE DEVICES</div>
                <div className="text-primary cta-4">{actDvceCon}</div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col xs="6" md="4" lg="2">
          <Link to={{ pathname: "/devices", state: { type: "Critical" } }}>
            <Card className="h-100 hover-scale-up cursor-pointer">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="bg-danger sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center mb-4">
                  <CsLineIcons icon="cpu" className="text-white" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">CRITICAL DEVICES</div>
                <div className="text-primary cta-4">{critDvceCon}</div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col xs="6" md="4" lg="2">
          <Link to={{ pathname: "/devices", state: { type: "Warning" } }}>
            <Card className="h-100 hover-scale-up cursor-pointer">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="bg-warning sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center mb-4">
                  <CsLineIcons icon="warning-hexagon" className="text-white" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">WARNING DEVICES</div>
                <div className="text-primary cta-4">{warnDvceCon}</div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col xs="6" md="4" lg="2">
          <Link to={{ pathname: "/devices", state: { type: "Fault" } }}>
            <Card className="h-100 hover-scale-up cursor-pointer">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="bg-danger sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center mb-4">
                  <CsLineIcons icon="close-circle" className="text-white" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">FAULT DEVICES</div>
                <div className="text-primary cta-4">{faultDvceCon}</div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <section className="scroll-section" id="flow">
            <h2 className="small-title">Critical Devices</h2>
            <Row className="gx-2">
              <Col xs="12" className="p-0">
                <CarouselFlow critDvceList={critDvceList} />
              </Col>
            </Row>
          </section>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs="12" xl="8" className="mb-3">
          <section className="scroll-section" id="doughnutChart">
            <h2 className="small-title">Devices Performances</h2>
            <Card body>
              <div className="sh-35">
                <PerformanceChart label={label} activeDeviceStat={activeDeviceStat} crticalDeviceStat={crticalDeviceStat} />
              </div>
            </Card>
          </section>
        </Col>
        <Col xs="12" xl="4">
          <section className="scroll-section" id="doughnutChart">
            <h2 className="small-title">Latest Customers</h2>
            <div className="mb-n2">
              {latestCustomersLs && latestCustomersLs.length != 0 && latestCustomersLs.map((brand, i) => (
                <Card className="mb-2" key={`latestCustomers.${i}`}>
                  <Link to={{ pathname: "customers/details/"+(brand && brand.custId) }}>
                    <Row className="g-0 sh-10">
                      <Col xs="auto">
                        <div className="sw-9 sh-10 d-inline-block d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="user" className={brand.isActive ? "text-success" : "text-danger"}  />
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex flex-column ps-0 pt-0 pb-0 h-100 justify-content-center">
                          <div className="d-flex flex-column">
                            <div className="text-alternate">{brand.customerName && brand.customerName}</div>
                            <div className="text-small text-muted">{brand.userCount ? brand.userCount : 0} users | {brand.deviceCount ? brand.deviceCount : 0} devices.</div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
