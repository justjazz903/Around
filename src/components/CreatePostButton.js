import { Modal, Button, message } from 'antd';
import React from 'react';
import {CreatePostForm} from './CreatePostForm.js';
import {API_ROOT, TOKEN_KEY, AUTH_HEADER, POS_KEY, POS_NOISE} from '../constants.js'

export class CreatePostButton extends React.Component {
  constructor(props){
    super(props);
    this.form = React.createRef();
  }
  state = {
    visible: false,
    confirmLoading: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    })
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    this.form.current.validateFields().then((values) => {
      const formData = new FormData();
      const token = localStorage.getItem(TOKEN_KEY);
      const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
      formData.append('lat', lat + Math.random() * POS_NOISE * 2 - POS_NOISE);
      formData.append('lon', lon + Math.random() * POS_NOISE * 2 - POS_NOISE);
      formData.append('message', this.form.current.getFieldValue('message'));
      formData.append('image', this.form.current.getFieldValue('image')[0].originFileObj);
      fetch(`${API_ROOT}/post`, {
        method: 'POST',
        body: formData,
        headers: {Authorization: `${AUTH_HEADER} ${token}`},
        dataType: 'text'
      }).then((response) => {
        if(response.ok){
          message.success('Create post succeeded.');
          this.form.current.resetFields();
          this.setState({
            visible: false,
            confirmLoading: false
          });
          if(this.props.onSuccess){
            this.props.onSuccess();
          }
        }else{
          message.error('Create post failed.');
          this.setState({
            confirmLoading: false
          });
        }
      });

    }).catch((err) => {
      this.setState({
        confirmLoading: false
      });
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Create New Post
        </Button>
        <Modal
          title="Create New Post"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          okText="Create"
        >
          <CreatePostForm ref={this.form}/>
        </Modal>
      </div>
    );
  }
}
