// EditPostForm.js
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';
import axios from 'axios';

const EditPostForm = ({ originalPost, onSave, onCancel }) => {
  const [editedPost, setEditedPost] = useState({ ...originalPost });
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  const handleImageClick = () => {
    document.getElementById('imageUploadInput').click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    document.getElementById("postImage").src = URL.createObjectURL(file);
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const imageUploadResponse = await axios.post('https://localhost:7186/imageUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (imageUploadResponse.status === 200) {
        return imageUploadResponse.data.url;
      } else {
        console.error("Failed to upload image. Status:", imageUploadResponse.status);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSave = async() => {
    if(editedPost.type === 1) {
      const url = await handleImageUpload();
      if(url != null) {
        editedPost.imageUrl = url;
      }
    }

    onSave(editedPost);
  };

  return (
    <Modal show={true} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{editedPost.id}. számú bejegyzés szerkesztése</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Cím</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={editedPost.title}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formBody">
            <Form.Label>Leírás</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="body"
              value={editedPost.body}
              onChange={handleInputChange}
            />
          </Form.Group>

          {editedPost.type === 1 && (
            <>
              <Form.Group controlId="formImageUrl">
                <Form.Label>Kép</Form.Label>
                <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                  <Image id="postImage" src={editedPost.imageUrl} alt="Post Image" fluid="true" rounded />
                </div>
                <input
                  type="file"
                  id="imageUploadInput"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </Form.Group>
            </>
          )}

          {editedPost.type === 2 && (
            <>
              <Form.Group controlId="formLinkUrl">
                <Form.Label>Link</Form.Label>
                <Form.Control
                  type="text"
                  name="linkUrl"
                  value={editedPost.linkUrl}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Vissza
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Módosítások mentése
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPostForm;