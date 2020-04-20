import React from 'react';
import '../styles/Login.css'
import {Link} from 'react-router-dom'
import {API_ROOT} from '../constants'

import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export const Login = (props) => {
  const onFinish = values => {
    console.log('Received values of form: ', values);
    let lastResponse;
    fetch(`${API_ROOT}/login`, {
      method : 'POST',
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      })
    }).then((response) => {
      lastResponse = response;
      return response.text();
    }, (error) => {
      console.log('Error');
    }).then((text) => {
      if(lastResponse.ok){
        message.success('Login success');
        props.handleLogin(text);
      }else{
        message.error(text);
      }
    });
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        <div>
          Or <Link to="/register">register now!</Link>
        </div>
      </Form.Item>
    </Form>
  );
};
