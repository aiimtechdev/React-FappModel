import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Glide from 'components/carousel/Glide';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { Link } from 'react-router-dom';

const CarouselFlow = ({ critDvceList = [] }) => {
  return (
    <>
      {critDvceList && critDvceList.length > 0 ? (
        <>
          {critDvceList && critDvceList.length < 4 ? (
            <>
              <Row className="g-2 mb-5">
                {critDvceList &&
                  critDvceList.map((brand, i) => (
                    <Col key={i} xl="4" md="6" sm="12">
                      {/* 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs' */}
                      <Card className="mb-2">
                        <Link to={{ pathname: '/devices/details/' + brand['dvceReg'].replace('#', '') }}>
                          <Row className="g-0 ps-2 pe-3 pt-2 pb-2 sh-18">
                            <Col xs="3" className="d-flex align-items-center justify-content-center">
                              <div className="bg-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                                <CsLineIcons icon="cpu" className="text-white" />
                              </div>
                            </Col>
                            <Col xs="9" className="d-flex flex-column justify-content-center">
                              <p className="heading fw-bolder mb-1">
                                {brand['dvceName']} ( {brand['dvceReg']} )
                              </p>
                              <div className="d-flex flex-row text-center align-item-center mb-1">
                                <CsLineIcons icon="tablet" className="text-small text-primary" />
                                <p className="text-medium text-bold mb-0 ms-1">{brand['deviceType']}</p>
                              </div>
                              <div className="d-flex flex-row text-center align-item-center mb-1">
                                <CsLineIcons icon="building" className="text-primary" />
                                <p className="text-medium text-bold mb-0 ms-1">{brand['customerName']}</p>
                              </div>
                              <div className="d-flex flex-row text-center align-item-center mb-1">
                                <p className="fs-6 text-danger text-bold mb-0 me-1">{brand['dvcePrblm']}</p>
                              </div>
                            </Col>
                          </Row>
                        </Link>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </>
          ) : (
            <>
              <Glide
                noControls
                options={{
                  gap: 2,
                  rewind: false,
                  type: 'carousel',
                  autoplay: 2000,
                  hoverpause: true,
                  animationDuration: 6000,
                  animationTimingFunc: 'linear',
                  perView: 3,
                  breakpoints: {
                    300: { perView: 1 },
                    700: { perView: 1 },
                    800: { perView: 2 },
                    1200: { perView: 2 },
                    1600: { perView: 3 },
                    1900: { perView: 3 },
                    3840: { perView: 3 },
                  },
                }}
              >
                {critDvceList &&
                  critDvceList.map((brand, i) => (
                    <Glide.Item key={`flow.${i}`}>
                      <Card className="mb-2">
                        <Link to={{ pathname: '/devices/details/' + brand['dvceReg'].replace('#', '') }}>
                          <Row className="g-0 ps-2 pe-3 pt-2 pb-2 sh-18">
                            <Col xs="3" className="d-flex align-items-center justify-content-center">
                              <div className="bg-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                                <CsLineIcons icon="cpu" className="text-white" />
                              </div>
                            </Col>
                            <Col xs="9" className="d-flex flex-column justify-content-center">
                              <p className="heading fw-bolder mb-1">
                                {brand['dvceName']} ( {brand['dvceReg']} )
                              </p>
                              <div className="d-flex flex-row text-center align-item-center mb-1">
                                <CsLineIcons icon="tablet" className="text-small text-primary" />
                                <p className="text-medium text-bold mb-0 ms-1">{brand['deviceType']}</p>
                              </div>
                              <div className="d-flex flex-row text-center align-item-center mb-1">
                                <CsLineIcons icon="building" className="text-primary" />
                                <p className="text-medium text-bold mb-0 ms-1">{brand['customerName']}</p>
                              </div>
                              <div className="d-flex flex-row align-item-center mb-1">
                                <p className="fs-6 text-danger text-bold mb-0 me-1">{brand['dvcePrblm']}</p>
                              </div>
                            </Col>
                          </Row>
                        </Link>
                      </Card>
                    </Glide.Item>
                  ))}
              </Glide>
            </>
          )}
        </>
      ) : (
        <>
          <Card className="sh-19">
            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
              {/* <CsLineIcons icon="pepper" className="text-primary mb-3" /> */}
              <p className="heading mb-1">Oops! no data found</p>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
};

export default CarouselFlow;
