import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { actions } from './redux.js';
import MainPage from './Components/MainPage';
import ForumPostList from './Components/ForumPostList';
import MediaPostList from './Components/MediaPostList';
import LinkPostList from './Components/LinkPostList';
import CreatePost from './Components/CreatePost';
import { Alert, Button, Collapse, Spinner, Navbar, Nav, Container } from 'react-bootstrap';
import LoginForm from './Components/LoginForm.js';
import RegisterForm from './Components/RegisterForm.js';
import { Camera, Home, Link, LogIn, LogOut, MessageCircle, MessageCirclePlus } from 'lucide-react';
import LogoutComponent from './Components/LogoutComponent.js';

function App() {
  const iconSize = '1rem';

  const dispatch = useDispatch();
  const username = useSelector((state) => state.session.username);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetailsOpen, setErrorDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const wait = setTimeout(() => setWait(true), 5000);

      try {
        const response = (await axios.get('https://localhost:7186/posts')).data;

        const forum = response.filter(x => x.type === 0);
        const images = response.filter(x => x.type === 1);
        const links = response.filter(x => x.type === 2);

        dispatch(actions.setImages(images));
        dispatch(actions.setForum(forum));
        dispatch(actions.setLinks(links));
      } catch (error) {
        setError(error.message);
      } finally {
        clearInterval(wait);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    if (accessToken != null) {
      axios
        .get('https://localhost:7186/session', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          if(response.status == 200) {
            dispatch(actions.setSession(response.data));
          }
        })
        .catch(() => {
          dispatch(actions.setSession({ username: null, email: null, isAdmin: false }));
          dispatch(actions.setAccessToken(null));
        });
    }
  }, [accessToken]);

  const containerStyle = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: '0px'
  };

  const spinnerContainerStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={spinnerContainerStyle}>
          <Spinner animation="border" role="status" variant="primary" style={{ marginRight: '10px' }}>
            <span className="visually-hidden">Betöltés folyamatban...</span>
          </Spinner>
          {wait && (
            <Alert variant="warning" style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '5px', textAlign: 'center' }}>
              Az adatok lekérése az elvártnál több ideig tart...
            </Alert>
          )}
          <h1>Töltés...</h1>
        </div>
      </div>
    );
  } else if (error != null) {
    return (
      <Alert variant="danger" style={containerStyle}>
        <Alert.Heading>Hiba történt.</Alert.Heading>
        <Button variant="outline-danger" onClick={() => setErrorDetailsOpen(!errorDetailsOpen)} aria-controls="error-details-collapse-text" aria-expanded={errorDetailsOpen}>
          Részletek
        </Button>
        <Collapse in={errorDetailsOpen}>
          <div id="error-details-collapse-text">{error}</div>
        </Collapse>
      </Alert>
    );
  }

  return (
    <Router>
      <div id="main">
        {/* Navigációs sáv */}
        <Navbar className='navszin' bg="dark" variant="dark">
  <Container fluid={true}>
    <Nav className="align-items-center">
      <Nav.Link as={NavLink} to={`/`} className="navbar-brand d-flex align-items-center">
        <Home className="icon mr-2" style={{ width: iconSize, height: iconSize }} />
        <span className="d-flex align-items-center"> Kezdőlap</span>
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/media`} className="d-flex align-items-center">
        <Camera alt="Media" className="icon mr-2" style={{ width: iconSize, height: iconSize }} />
        <span className="d-flex align-items-center"> Média</span>
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/forum`} className="d-flex align-items-center">
        <MessageCircle alt="Forum" className="icon mr-2" style={{ width: iconSize, height: iconSize }} />
        <span className="d-flex align-items-center"> Fórum</span>
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/links`} className="d-flex align-items-center">
        <Link alt="Links" className="icon mr-2" style={{ width: iconSize, height: iconSize }} />
        <span className="d-flex align-items-center"> Link</span>
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/publish`} className="d-flex align-items-center">
        <MessageCirclePlus alt="Publish" className="icon mr-2" style={{ width: iconSize, height: iconSize }} />
        <span className="d-flex align-items-center"> Új bejegyzés</span>
      </Nav.Link>
    </Nav>
    {username == null ? (
      <Nav className="justify-content-end align-items-center">
        <Nav.Link as={NavLink} to={`/login`} className="d-flex align-items-center">
          <LogIn className="icon mr-2" style={{ width: iconSize, height: iconSize }} />
          <span className="d-flex align-items-center">Belépés</span>
        </Nav.Link>
      </Nav>
    ) : (
      <Nav className="justify-content-end align-items-center">
        <p className="m-0">Bejelntkezve, mint {username}</p>
        <Nav.Link as={NavLink} to={`/logout`} className="d-flex align-items-center">
          <LogOut className="icon mr-2" style={{ width: iconSize, height: iconSize }} />
          <span className="d-flex align-items-center">Kijelentkezés</span>
        </Nav.Link>
      </Nav>
    )}
  </Container>
</Navbar>

      </div>

      <Routes>
        <Route path="/*" element={<MainPage />} />
        <Route path="/forum" element={<ForumPostList />} />
        <Route path="/media" element={<MediaPostList />} />
        <Route path="/links" element={<LinkPostList />} />
        <Route path="/publish" element={<CreatePost />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/logout" element={<LogoutComponent />} />
      </Routes>
    </Router>
  );
}

export default App;