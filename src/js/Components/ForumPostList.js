import React, { useState } from 'react';
import { Pagination, Card, Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import EditPostForm from './EditPostForm';
import DeletePostForm from './DeletePostForm';
import { deletePostGlobal, editPostGlobal } from '../APIUtil';

const ForumPostList = () => {
    const username = useSelector((state) => state.session.username);
    const [forumIndex, setForumIndex] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const forum = useSelector((state) => state.data.forum);
    const postsPerPage = 9;

    const totalPages = Math.ceil(forum.length / postsPerPage);

    const handleForumPagination = (index) => setForumIndex(index);


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
        editPostGlobal(dispatch, 'forum', editedPost);
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
        deletePostGlobal(dispatch, 'forum', deletePost.id);
        setIsDeleting(false);
    };

    const handleCancelDelete = () => {
        setIsDeleting(false);
    };

    return (
        <>
            <Container>
                <Row>
                    {forum.slice(forumIndex * postsPerPage, (forumIndex + 1) * postsPerPage).map((post, i) => (
                        <Col key={i} md={4} className="mb-3">
                            <Card className='mx-auto p-2'>
                                <Card.Header>{post.title}</Card.Header>
                                <Card.Body>
                                    <Card.Text>{post.body.slice(0, 30)}{post.body.length > 30 ? "..." : ""}</Card.Text>
                                    
                                    <div className="d-grid gap-2">
                                    <button className='btn btn-outline-light' type='button' onClick={() => { setModalIndex(post) }}>
                                        Bővebben
                                    </button>
                                {post.author === username &&
                                <>
                            <div>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" type="button" onClick={() => handleEdit(post)}>Szerkesztés</button>
                                    <button class="btn btn-outline-danger" type="button" onClick={() => handleDelete(post)}>Törlés</button>
                            </div>
                            </div>
                                </>
                                }
                            </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            {modalIndex !== null && (
                <Modal show={modalIndex !== null} onHide={() => setModalIndex(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalIndex.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalIndex.body}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalIndex(null)}>
                            Bezárás
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            <div className="d-flex flex-column align-items-center mt-2 text-center">
                <Pagination>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index === forumIndex}
                            onClick={() => handleForumPagination(index)}
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

export default ForumPostList;