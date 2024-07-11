import React from 'react';
import { Button, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const ControlsDelete = ({ tableInstance, deleteItems, delElm, delElms, keyCol }) => {
  const { selectedFlatRows, isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal } = tableInstance;

  return (<>
    { selectedFlatRows.length === 0 ? (
        <Button variant="foreground-alternate" className="btn-icon btn-icon-only shadow delete-datatable" disabled>
          <CsLineIcons icon="bin" />
        </Button>
      ) : (<>
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top-delete">Delete</Tooltip>}>
          <Button onClick={() => setIsOpenDeleteConfirmModal(true)} variant="foreground-alternate" className="btn-icon btn-icon-only shadow delete-datatable">
            <CsLineIcons icon="bin" />
          </Button>
        </OverlayTrigger>
        <Modal show={isOpenDeleteConfirmModal} onHide={() => setIsOpenDeleteConfirmModal(false)} animation={false}  backdrop="static" dialogClassName="my-modal" centered>
          <Modal.Body><h4 className='text-primary mt-4'>Are you sure that you want to delete {selectedFlatRows.length === 1 ? `this ${delElm}` : `all the selected ${delElms}` } {}?</h4></Modal.Body>
          <div className='d-flex justify-content-end p-4 mt-n5'>
            <Button variant="outline-primary" onClick={() => setIsOpenDeleteConfirmModal(false)}>No</Button>&nbsp;
            <Button variant="primary" onClick={() => deleteItems({ ids: selectedFlatRows.map((x) => x.original[keyCol]) })}>Yes</Button>
          </div>
        </Modal>
      </>)
    }   
  </>);
};
export default ControlsDelete;
