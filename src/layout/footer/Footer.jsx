import React, { useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';

const Footer = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-footer', 'true');
    return () => {
      document.documentElement.removeAttribute('data-footer');
    };
  }, []);

  return (
    <footer>
      <div className="footer-content">
        <Container>
          <Row>
            <p className="mb-0 text-muted text-medium">&copy; MonitoringSensor - Admin 2023</p>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
