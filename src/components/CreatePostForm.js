import React from 'react';
import {
  Form,
  Upload,
  Input
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const normFile = e => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

export const CreatePostForm = React.forwardRef((props, ref) => {
  const onFinish = values => {
    console.log('Received values of form: ', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      ref = {ref}
    >
      <Form.Item
        name="message"
        label="Message"
        rules={[
          {
            required: true,
            message: 'Enter your message here',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Image" required='true'>
      <Form.Item name="image" valuePropName="fileList" getValueFromEvent={normFile} noStyle
      rules={[
        {
          required: true,
          message: 'Slect an image',
        },
      ]}
      >
        <Upload.Dragger name="files" beforeUpload={() => false}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
        </Upload.Dragger>
      </Form.Item>
    </Form.Item>
    </Form>
  );
});
