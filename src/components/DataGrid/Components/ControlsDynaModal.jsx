import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ControlsDynaModal = ({ tableInstance, Elm }) => {
  const { selectedFlatRows, isOpenDynConfirmModal, setIsOpenDynConfirmModal } = tableInstance;
  return (
    <>
      <Modal
        show={isOpenDynConfirmModal}
        onHide={() => setIsOpenDynConfirmModal(false)}
        animation={false}
        backdrop="static"
        dialogClassName="my-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">{Elm} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFlatRows.length === 1 && selectedFlatRows[0].original.dvceData ? (
            <pre>{JSON.stringify(selectedFlatRows.length === 1 && selectedFlatRows[0].original.dvceData, null, 2)}</pre>
          ) : (
            <div className="d-flex justify-content-center align-items-center py-2">Not Available !</div>
          )}
        </Modal.Body>
        <div className="d-flex justify-content-end p-4 mt-n5 al">
          <Button variant="primary" onClick={() => setIsOpenDynConfirmModal(false)}>
            Close
          </Button>
          &nbsp;
        </div>
      </Modal>
    </>
  );
};

export default ControlsDynaModal;
