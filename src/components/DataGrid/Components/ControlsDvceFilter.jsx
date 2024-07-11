import React from 'react';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const ControlsDvceFilter = ({ tableInstance }) => {
  const {
    dvceFilterType,
    setDvceFilterType,
    gotoPage
  } = tableInstance;
  const options = ["All", "Active", "Critical", "Warning", "Fault"];

  const onSelectDvceFilterType = (type) => {
    setDvceFilterType(type);
    gotoPage(0);
  };
  return (
    <OverlayTrigger placement="top" delay={{ show: 1000, hide: 0 }} overlay={<Tooltip>Device Status</Tooltip>}>
      {({ ref, ...triggerHandler }) => (
        <Dropdown className="d-inline-block" align="end">
          <Dropdown.Toggle ref={ref} {...triggerHandler} variant="foreground-alternate" className="shadow text-primary fw-bold">
            <CsLineIcons icon="filter" className="text-primary me-1"/>
            {dvceFilterType}
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="shadow dropdown-menu-end"
            popperConfig={{
              modifiers: [
                {
                  name: 'computeStyles',
                  options: {
                    gpuAcceleration: false,
                  },
                },
              ],
            }}
          >
            {options.map((dFType) => (
              <Dropdown.Item key={`dvceFilterType.${dFType}`} active={dFType === dvceFilterType} onClick={() => onSelectDvceFilterType(dFType)}>
                {dFType}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </OverlayTrigger>
  );
};

export default ControlsDvceFilter;
