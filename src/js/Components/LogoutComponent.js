// LogoutComponent.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions } from '../redux';

const LogoutComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Dispatch actions to clear session and access token
    dispatch(actions.setSession({ username: null, email: null, isAdmin: false }));
    dispatch(actions.setAccessToken(null));

    // Redirect to the home page or any desired route after logout
    navigate('/');
  }, [dispatch, navigate]);

  return null; // No need to render anything for the logout component
};

export default LogoutComponent;
