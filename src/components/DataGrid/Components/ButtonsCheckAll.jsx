/* eslint-disable no-nested-ternary */
import { Button, ButtonGroup, Dropdown, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useEffect, useRef } from 'react';

const ButtonsCheckAll = ({ tableInstance }) => {
  const checkAllRef = useRef(null);
  const {
    getToggleAllPageRowsSelectedProps,
  } = tableInstance;
  const { onChange, checked, indeterminate } = getToggleAllPageRowsSelectedProps();

  useEffect(() => {
    if (checkAllRef.current) {
      checkAllRef.current.indeterminate = indeterminate;
    }
    return () => {};
  }, [indeterminate]);
  return (
    <div className="">
      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top-add">Select All</Tooltip>}>
        <Button variant="outline-primary" className="btn-custom-control p-0 ps-3 pe-3" onClick={onChange}>
          <Form.Check ref={checkAllRef} className="form-check float-end pt-0" type="checkbox" checked={checked} onChange={() => {}} />
        </Button>
      </OverlayTrigger>
  
    </div>
  );
};
export default ButtonsCheckAll;
