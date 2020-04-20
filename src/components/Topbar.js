import React from 'react';
import logo from '../assets/logo.svg';
import '../styles/Topbar.css'
import {LoginOutlined} from '@ant-design/icons'

export function Topbar(props){
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <div className="App-title"> Around </div>
      {
        props.isLoggedIn ?
        <a onClick={props.handleLogout} className='logout'> <LoginOutlined /> {' '}Logout </a> : null
      }
    </header>
  );
}
