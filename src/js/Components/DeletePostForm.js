import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeletePostForm = ({ onDelete, onCancel, toDelete }) => {
  return (
    <Modal show={true} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>A {toDelete.id}. számú bejegyzés törlése</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Biztosan törölni szeretnéd ezt a bejegyzést?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Mégse
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Törlés
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePostForm;
