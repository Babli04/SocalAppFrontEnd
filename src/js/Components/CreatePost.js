import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Card, Toast, ToastContainer } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { actions } from '../redux';

const CreatePost = () => {
    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.auth.accessToken);
    const [validated, setValidated] = useState(false);
    const [postType, setPostType] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [linkContent, setLinkContent] = useState('');
    const [description, setDescription] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handlePostTypeChange = (event) => {
        setPostType(event.target.value);
    };

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleLinkContentChange = (event) => {
        setLinkContent(event.target.value);
    };

    const handlePostTitleChange = (event) => {
        setPostTitle(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handlePostUpload = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            let postData = {
                title: postTitle,
                body: description,
                type: parseInt(postType),
            };

            if (postType === "2") {
                postData.link_url = linkContent;
            }

            if (postType === "1") {
                const formData = new FormData();
                formData.append('image', imageFile);

                // Use axios for image upload
                const imageUploadResponse = await axios.post('https://localhost:7186/imageUpload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });

                if (imageUploadResponse.status === 200) {
                    postData.image_url = imageUploadResponse.data.url;
                } else {
                    console.error("Failed to upload image. Status:", imageUploadResponse.status);
                    return;
                }
            }

            const response = await axios.post('https://localhost:7186/posts', postData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (response.status === 200) {
                setShowToast(true)
                setPostType('');
                setPostTitle('');
                setImageFile(null);
                setLinkContent('');
                setDescription('');

                // add to the right store
                switch (postType) {
                    case "0":
                        dispatch(actions.addForum(response.data));
                        break;
                    case "1":
                        dispatch(actions.addImage(response.data));
                        break;
                    case "2":
                        dispatch(actions.addLink(response.data));
                        break;
                }
            } else {
                console.error("Failed to upload post. Status:", response.status);
            }
        } catch (error) {
            console.error("Error during post upload:", error);
        }
    };

    return (
        <>
            <Card className='mx-auto p-2 col-sm-6'>
                <Form noValidate validated={validated} onSubmit={handlePostUpload}>
                    {/* Post Type Dropdown */}
                    <Form.Select required aria-label="Default select example" defaultValue={postType} onChange={handlePostTypeChange}>
                        <option value="" disabled>Válassz bejegyzés típust!</option>
                        <option value="0">Fórum</option>
                        <option value="1">Média</option>
                        <option value="2">Link</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Kötelező választani egy bejegyzés típust!
                    </Form.Control.Feedback>

                    {/* Post Title */}
                    <Form.Group required className='mb-3'>
                        <Form.Label>Cím</Form.Label>
                        <Form.Control type="text" required value={postTitle} onChange={handlePostTitleChange} />
                        <Form.Control.Feedback type="invalid">
                            Kötelező bejegyzés címet megadni!
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Image Upload */}
                    {postType === "1" && (
                        <Form.Group className='mb-3'>
                            <Form.Label>Tölts fel egy képet!</Form.Label>
                            <Form.Control required type="file" onChange={handleFileChange} />
                            <Form.Control.Feedback type="invalid">
                                Kötelező képet feltölteni média bejegyzések esetén!
                            </Form.Control.Feedback>
                        </Form.Group>
                    )}

                    {/* Link Content */}
                    {postType === "2" && (
                        <Form.Group className='mb-3'>
                            <Form.Label>Link</Form.Label>
                            <Form.Control required as="textarea" placeholder="Másold be ide a posztolni kívánt linket!" value={linkContent} onChange={handleLinkContentChange} />
                            <Form.Control.Feedback type="invalid">
                                Kötelező linket megadni link bejegyzések esetén!
                            </Form.Control.Feedback>
                        </Form.Group>
                    )}

                    {/* Description */}
                    <Form.Group required className='mb-3'>
                        <Form.Label>Leírás</Form.Label>
                        <Form.Control required as="textarea" rows="3" value={description} onChange={handleDescriptionChange} />
                        <Form.Control.Feedback type="invalid">
                            Kötelező leírást megadni!
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Upload Button */}
                    <div className="d-grid gap-2">
                        <button type="submit" class="btn btn-outline-light">Bejegyzés feltöltése!</button>
                    </div>
                </Form>
            </Card>
            <ToastContainer
          className="p-3"
          position="bottom-end"
          style={{ zIndex: 1 }}>
            <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Siker!</strong>
                </Toast.Header>
                <Toast.Body>Bejegyzés sikeresen feltöltve!</Toast.Body>
            </Toast>
            </ToastContainer>
        </>
    );
};

export default CreatePost;
