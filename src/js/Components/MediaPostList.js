import React, { useState } from 'react';
import { Pagination, Card, Container, Col, Row, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import EditPostForm from './EditPostForm';
import DeletePostForm from './DeletePostForm';
import { deletePostGlobal, editPostGlobal } from '../APIUtil';

const MediaPostList = () => {
    const images = useSelector((state) => state.data.images);
    const [imageIndex, setImageIndex] = useState(0);

    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState(null);

    const dispatch = useDispatch();

    const [isDeleting, setIsDeleting] = useState(false);
    const [deletePost, setDeletePost] = useState(null);

    const handleEdit = (post) => {
        setEditedPost(post);
        setIsEditing(true);
      };

    const handleSaveEdit = (editedPost) => {
        editPostGlobal(dispatch, 'images', editedPost);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleDelete = (post) => {
        setDeletePost(post);
        setIsDeleting(true);
    };

    const handleConfirmDelete = () => {
        deletePostGlobal(dispatch, 'images', deletePost.id);
        setIsDeleting(false);
    };

    const handleCancelDelete = () => {
        setIsDeleting(false);
    };      

    const handleImagePagination = (index) => setImageIndex(index * 9);

    return (
        <>
            <Container>
                <Row>
                    {images.slice(imageIndex, imageIndex + 9).map((image, i) => (
                        <Col key={i} md={4} className="mb-3">
                        <Card className="mx-auto p-2" style={{ width: "100%", border: "none" }}>
                            <Card.Title>{image.title}</Card.Title>
                            <Card.Img src={image.imageUrl} fluid="true" alt={`image-${imageIndex + i + 1}`} />
                            <Card.Body>
                                <Card.Title>{image.body}</Card.Title>
                            </Card.Body>
                            <div>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" type="button" onClick={() => handleEdit(image)}>Szerkesztés</button>
                                    <button class="btn btn-outline-danger" type="button" onClick={() => handleDelete(image)}>Törlés</button>
                            </div>
                            </div>
                        </Card>
                    </Col>
                    ))}                    
                </Row>
            </Container>
            <div className="d-flex flex-column align-items-center mt-2 text-center">
                <Pagination>
                    {Array.from({ length: Math.ceil(images.length / 9) }).map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index * 9 === imageIndex}
                            onClick={() => handleImagePagination(index)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
            {isEditing && (
                <EditPostForm
                    originalPost={editedPost}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            )}

            {isDeleting && (
                <DeletePostForm
                    toDelete={deletePost}
                    onDelete={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
};

export default MediaPostList;