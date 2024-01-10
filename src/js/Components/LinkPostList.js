import React, { useState } from 'react';
import { Pagination, Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DeletePostForm from './DeletePostForm';
import EditPostForm from './EditPostForm';
import { deletePostGlobal, editPostGlobal } from '../APIUtil';

const LinkPostList = () => {
    const links = useSelector((state) => state.data.links);
    const [linkIndex, setLinkIndex] = useState(0);
    const linksPerPage = 9;

    const totalPages = Math.ceil(links.length / linksPerPage);

    const handleLinkPagination = (index) => setLinkIndex(index);

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
        editPostGlobal(dispatch, 'links', editedPost);
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
        deletePostGlobal(dispatch, 'links', deletePost.id);
        setIsDeleting(false);
    };

    const handleCancelDelete = () => {
        setIsDeleting(false);
    };      

    return (
        <>
            <Container>
                <Row>
                    {links.slice(linkIndex * linksPerPage, (linkIndex + 1) * linksPerPage).map((link, index) => (
                        <Col key={index} md={4} className="mb-3">
                            <Card className="text-center mx-auto p-2" key={index}>
                                <Card.Header>
                                    <ul className="nav nav-pills card-header-pills justify-content-center">
                                        <li className="nav-item">
                                            <a className="nav-link" href={link.Link} target="_blank" rel="noopener noreferrer">{link.linkUrl}</a>
                                        </li>
                                    </ul>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>{link.title}</Card.Title>
                                    <Card.Text>{link.body}</Card.Text>
                                </Card.Body>

                                <div>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" type="button" onClick={() => handleEdit(link)}>Szerkesztés</button>
                                    <button class="btn btn-outline-danger" type="button" onClick={() => handleDelete(link)}>Törlés</button>
                            </div>
                            </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            <div className="d-flex flex-column align-items-center mt-2 text-center">
                <Pagination>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index === linkIndex}
                            onClick={() => handleLinkPagination(index)}
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
}

export default LinkPostList;