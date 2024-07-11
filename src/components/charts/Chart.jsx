import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import ChartArea from './ChartArea';
import ChartHorizontalBar from './ChartHorizontalBar';
import ChartLine from './ChartLine';
import ChartDoughnut from './ChartDoughnut';
import ChartStreamingLine from './ChartStreamingLine';
import ChartStreamingBar from './ChartStreamingBar';
import SensorSuccessGauge from './SensorSuccessGauge';

const ChartPage = () => {
  const title = 'Charts';
  const description = 'Chart.js provides simple yet flexible JavaScript charting for designers & developers.';
  const sensors = [
    {
      total: 14,
      success: 10
    }, {
      total: 18,
      success: 12
    }, {
      total: 20,
      success: 19
    }, {
      total: 10,
      success: 2
    }, {
      total: 22,
      success: 22
    }, {
      total: 24,
      success: 17
    }
  ]
    return (
    <>
      <HtmlHead title={title} description={description} />
      <Row>
        {/* Line Chart Start */}
        <Col xs="12" xl="6">
          <section className="scroll-section" id="lineChart">
            <h2 className="small-title">Customers</h2>
            <Card body className="mb-5">
              <div className="sh-35">
                <ChartLine />
              </div>
            </Card>
          </section>
        </Col>
        {/* Line Chart End */}

        {/* Area Chart Start */}
        <Col xs="12" xl="6">
          <section className="scroll-section" id="areaChart">
            <h2 className="small-title">Devices</h2>
            <Card body className="mb-5">
              <div className="sh-35">
                <ChartArea />
              </div>
            </Card>
          </section>
        </Col>
        {/* Area Chart End */}

        {/* Streaming Line Chart Start */}
        <Col xs="12" xl="6">
          <section className="scroll-section" id="streamingLineChart">
            <h2 className="small-title">HighPressLimit (Live)</h2>
            <Card body className="mb-5">
              <div className="sh-35">
                <ChartStreamingLine />
              </div>
            </Card>
          </section>
        </Col>
        {/* Streaming Line Chart End */}

        {/* Streaming Bar Chart Start */}
        <Col xs="12" xl="6">
          <section className="scroll-section" id="streamingBarChart">
            <h2 className="small-title">LowPressLimit (Live)</h2>
            <Card body className="mb-5">
              <div className="sh-35">
                <ChartStreamingBar />
              </div>
            </Card>
          </section>
        </Col>
        {/* Streaming Bar Chart End */}

        {/* Doughnut Chart Start */}
        <Col xs="12" xl="6">
          <section className="scroll-section" id="doughnutChart">
            <h2 className="small-title">Devices</h2>
            <Card body className="mb-5">
              <div className="sh-35">
                <ChartDoughnut />
              </div>
            </Card>
          </section>
        </Col>
        {/* Doughnut Chart End */}

        {/* Horizontal Bar Chart Start */}
        <Col xs="12" xl="6">
          <section className="scroll-section" id="horizontalBarChart">
            <h2 className="small-title">New Devices</h2>
            <Card body className="mb-5">
              <div className="sh-35">
                <ChartHorizontalBar />
              </div>
            </Card>
          </section>
        </Col>
        {/* Horizontal Bar Chart End */}

        {/* Small Doughnut Charts Start */}
        <Row>
          <section className="scroll-section" id="smallDoughnutCharts">
            <h2 className="small-title">Sensor Reporting</h2>
            <Row className="row g-2 mb-5">
              {sensors.map((sense, ind) => (
                <Col xs="12" md="6" xl="4" key={ind}>
                  <Card className="sh-13 p-3">
                    <SensorSuccessGauge title={"Sensor " + (ind + 1)} total={sense.total} success={sense.success} />
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        </Row>
        {/* Small Doughnut Charts End */}
      </Row>
    </>
  );
};

export default ChartPage;
