import React, { useState } from 'react';
import { Card, Pagination } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const MainPage = () => {
    const images = useSelector((state) => state.data.images);
    const forum = useSelector((state) => state.data.forum);
    const links = useSelector((state) => state.data.links);

    const [imageIndex, setImageIndex] = useState(0);
    const [forumIndex, setForumIndex] = useState(0);
    const [linkIndex, setLinkIndex] = useState(0);

    const handleImagePagination = (index) => setImageIndex(index * 3);
    const handleForumPagination = (index) => setForumIndex(index * 3);
    const handleLinkPagination = (index) => setLinkIndex(index * 3);

    return (
        <div>
            {/* 1. blokk: Média tartalmak */}
            <div style={{ display: "flex", alignItems: "center" }}>
                {images.slice(imageIndex, imageIndex + 3).map((image, i) => (
                    <Card key={i} className='mx-auto p-2' style={{ width: "20%", border: "none" }}>
                        <Card.Title>{image.title}</Card.Title>
                        <Card.Img
                            src={image.imageUrl}
                            alt={`image-${imageIndex + i + 1}`}
                        />
                        <Card.Body>
                            <Card.Title>{image.body}</Card.Title>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <div className="d-flex flex-column align-items-center mt-2">
            <Pagination>
                {Array.from({ length: Math.ceil(images.length / 3) }).map((_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index * 3 === imageIndex}
                        onClick={() => handleImagePagination(index)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
            </div>

            {/* 2. blokk: Fórum posztok */}
            <div style={{ display: "flex", alignItems: "center" }}>
                {forum.slice(forumIndex, forumIndex + 3).map((post, i) => (
                    <Card key={i} className='mx-auto p-2' style={{ width: "20%", border: "none" }}>
                        <Card.Header>{post.title}</Card.Header>
                        <Card.Body>
                            <Card.Text>{post.body.slice(0, 30)}{post.body.length > 30 ? "..." : ""}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <div className="d-flex flex-column align-items-center mt-2">
            <Pagination>
                {Array.from({ length: Math.ceil(forum.length / 3) }).map((_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index * 3 === forumIndex}
                        onClick={() => handleForumPagination(index)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
            </div>

            {/* 3. blokk: Linkek */}
            <div style={{ display: "flex", alignItems: "center"}}>
                {links.slice(linkIndex, linkIndex + 3).map((link, i) => (
                    <Card key={i} className="text-center mx-auto p-2" style={{ width: "20%", border: "none" }}>
                        <Card.Header>
                            <ul className="nav nav-pills card-header-pills justify-content-center">
                                <li className="nav-item">
                                    <a className="nav-link" href={link.linkUrl} target="_blank" title={link.title}>Link</a>
                                </li>
                            </ul>
                        </Card.Header>
                        <Card.Body>
                            {link && (
                                <>
                                    <Card.Title>{link.body}</Card.Title>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <div className="d-flex flex-column align-items-center mt-2">
                <Pagination>
                    {Array.from({ length: Math.ceil(links.length / 3) }).map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index * 3 === linkIndex}
                            onClick={() => handleLinkPagination(index)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </div>
    );
};

export default MainPage;
