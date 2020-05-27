import React, { useEffect, useState } from "react";
import SignIn from './Login';
import { loginUser } from '../actions';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token !== null) {
      axios.get('/api/user/account', { headers: { "auth-token": token } })
        .then(res => {
          if (res.status === 200) {
            setIsLoggedIn(true);
            dispatch(loginUser({ ...res.data, 'token': token }));
          }
        }).catch((err) => {
          if (err.response) {
            console.log(err.response)
            setIsLoggedIn(false);
          }
        });
    }
  }, []);


  return (
    <div>
      {isLoggedIn ? <Redirect to="/Chat" /> : null}
      <SignIn />
    </div>
  )
}

export default Home;
