import React from 'react';
import '../styles/Home.css';
import { Tabs, Spin, Row, Col } from 'antd';
import {
  GEO_OPTIONS,
  POS_KEY,
  TOKEN_KEY,
  AUTH_HEADER,
  API_ROOT,
  POST_TYPE_IMAGE,
  POST_TYPE_VIDEO,
  MAP_API_KEY
} from '../constants.js';
import {Gallery} from './Gallery.js';
import {CreatePostButton} from './CreatePostButton.js';
import {AroundMap} from './AroundMap.js'

const { TabPane } = Tabs;

export class Home extends React.Component{
  state = {
    isLoadingGeoLocation: false,
    isLoadingPosts: false,
    error: '',
    posts: [],
  }

  componentDidMount(){
      if('geolocation' in navigator){
        this.setState({isLoadingGeoLocation: true, error: ''});
        navigator.geolocation.getCurrentPosition(
          this.onSuccessLoadGeoLocation,
          this.onFailedLoadGeolocation,
          GEO_OPTIONS
        );
      }else{
        this.setState({error: 'Geolocation is not supported.'});
      }
  }

  onSuccessLoadGeoLocation = (position) => {
    const {latitude, longitude} = position.coords;
    localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}));
    this.setState({isLoadingGeoLocation: false, error: ''});
    this.loadNearbyPosts();
  }

  onFailedLoadGeolocation = () => {
    this.setState({isLoadingGeoLocation: false, error: 'Failed to load geolocation.'});
  }

  loadNearbyPosts = (center, radius) => {
    const {lat, lon} = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
    const range = radius ? radius : 20;
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('loading nearby posts')
    this.setState({isLoadingPosts: true, error: ''});
    fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`, {
      method: 'GET',
      headers: {
        Authorization: `${AUTH_HEADER} ${token}`
      }
    }).then((response) => {
      if(response.ok){
        return response.json();
      }
      throw new Error('Failed to load post.');
    }).then((data) => {
      this.setState({posts: data ? data : [], isLoadingPosts: false});
      this.renderPosts(POST_TYPE_IMAGE)
      this.renderPosts(POST_TYPE_VIDEO)
    }).catch((e) => {
      this.setState({isLoadingPosts: false, error: e.message});
    });
  }

  renderPosts(type){
    const {error, isLoadingGeoLocation, isLoadingPosts, posts} = this.state;
    if(error){
      return error;
    }else if(isLoadingGeoLocation){
      return <Spin tip='Loading geo location...'/>;
    }else if(isLoadingPosts){
      return <Spin tim='Loading posts...'/>;
    }else if(posts.length > 0){
      switch(type){
        case POST_TYPE_IMAGE:
          return this.renderImagePosts();
        case POST_TYPE_VIDEO:
          return this.renderVideoPosts();
        default:
          throw new Error('Unknown post type');
      }
    }else{
      return 'No nearby posts';
    }
  }

  renderImagePosts() {
    const images = this.state.posts
    .filter((post) => post.type === POST_TYPE_IMAGE)
    .map((post) => {
      return {
        user: post.user,
        src: post.url,
        thumbnail: post.url,
        caption: post.message,
        thumbnailWidth: 400,
        thumbnailHeight: 300,
      };
    });
    return <Gallery images={images}/>;
  }

  renderVideoPosts() {
    return (
      <Row gutter={32}>
        {
          this.state.posts
          .filter((post) => post.type === POST_TYPE_VIDEO)
          .map((post) => (
            <Col className="gutter-row" span={6}>
              <video src={post.url} controls className='video-block' />
              <div>{`${post.user}: ${post.message}`}</div>
            </Col>
          ))
        }
    </Row>
    );
  }

  render(){
    const operations = <CreatePostButton onSuccess={this.loadNearbyPosts}/>;
    return (
      <Tabs tabBarExtraContent={operations} className='main-tabs'>
        <TabPane tab="Images" key="1">
          {this.renderPosts(POST_TYPE_IMAGE)}
        </TabPane>
        <TabPane tab="Videos" key="2">
          {this.renderPosts(POST_TYPE_VIDEO)}
        </TabPane>
        <TabPane tab="Map" key="3">
          <AroundMap
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `600px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            posts={this.state.posts}
            onChange={this.loadNearbyPosts}
          />
        </TabPane>
      </Tabs>
    );
  }
}
