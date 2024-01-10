import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Form, Button, Alert } from 'react-bootstrap';
import { actions } from '../redux'; // Update the path

const LoginForm = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [showTotpField, setShowTotpField] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call your API to login
    const response = await fetch('https://localhost:7186/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
        TotpToken: showTotpField ? totpToken : null,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // Check if TotpToken is required
      if (data === 'EnterTotp') {
        setShowTotpField(true);
        setErrorMessage('TOTP token is required.');
      } else {
        // Save access token to Redux store
        dispatch(actions.setAccessToken(data.accessToken));
      }
    } else {
      setErrorMessage('Sikertelen bejelentkezés! Ellenőrizd adataid helyességét!');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className='card' style={{width: "40rem", 
    margin: "0 auto",
        float: "none",
        marginBottom: "10px",
        marginTop: "80px"}}>
      <Form.Group className="mb-3 card-body" controlId="formUsername">
        <Form.Label>Felhasználónév:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Add meg a felhasználónevedet..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3 card-body" controlId="formPassword">
        <Form.Label>Jelszó:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Add meg a jelszavad..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      {showTotpField && (
        <Form.Group className="mb-3 card-body" controlId="formTotpToken">
          <Form.Label>2FA Token:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Add meg a két faktoros hitelesítéshez szükséges tokent!"
            value={totpToken}
            onChange={(e) => setTotpToken(e.target.value)}
            required
          />
        </Form.Group>
      )}

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form.Group className="mb-3 card-body">
      <Button variant="light" type="submit">
        Bejelntkezés
      </Button>

        <span style={{display:"flex", float:"right"}}>
        Nincs még felhasználód?
        </span>
        <br></br>
        <span style={{display:"flex", float:"right"}}><Link to="/register"><button type="button" class="btn btn-outline-light btn-sm">Regisztrálj itt!</button></Link></span>
      </Form.Group>
    </Form>
  );
};

export default LoginForm;