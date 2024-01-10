import React, { useState } from 'react';
import { Form, Button, Alert, FormGroup } from 'react-bootstrap';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirmation
    if (password !== confirmPassword) {
      setErrorMessage('Jelszó nem egyezik.');
      return;
    }

    // Call your API to register
    const response = await fetch('https://localhost:7186/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: email,
        Username: username,
        Password: password,
      }),
    });

    if (response.ok) {
      setErrorMessage('');
      alert('Sikeres regisztráció! Mostmár bejelentkezhetsz!');
    } else {
      const data = await response.json();
      setErrorMessage(data);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className='card' style={{width: "40rem", 
    margin: "0 auto",
        float: "none",
        marginBottom: "10px",
        marginTop: "80px"}}>
      <Form.Group className="mb-3 card-body" controlId="formEmail">
        <Form.Label>Email cím:</Form.Label>
        <Form.Control
          type="email"
          placeholder="Add meg az email címed..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

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

      <Form.Group className="mb-3 card-body" controlId="formConfirmPassword">
        <Form.Label>Jelszó megerősítése:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Erősítsd meg a jelszavadat!"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </Form.Group>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form.Group className="mb-3 card-body">
      <Button variant="primary" type="submit">
        Regisztrálok
      </Button>
      </Form.Group>
    </Form>
  );
};

export default RegisterForm;