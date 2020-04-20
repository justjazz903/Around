import React from 'react';
import '../styles/Register.css'
import {Link, useHistory} from 'react-router-dom'
import {API_ROOT} from '../constants'
import {
  Form,
  Input,
  Button,
  message,
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};


export const Register = () => {
  const [form] = Form.useForm();
  let history = useHistory();
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    let lastResponse;
    fetch(`${API_ROOT}/signup`, {
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
        message.success(text);
        history.push('/login');
      }else{
        message.error(text);
      }
    });
  };
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
      className='register-form'
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please enter your username',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject('The two passwords that you entered do not match!');
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
        <div>
          I already have an account, go back to <Link to='/Login'>login</Link>
        </div>
      </Form.Item>
    </Form>
  );
}
