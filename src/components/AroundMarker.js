import React from 'react';
import {
  Marker,
  InfoWindow } from "react-google-maps"
import '../styles/AroundMarker.css'

export class AroundMarker extends React.Component{
  state = {
    toggle: false
  }
  onToggle = () => {
    this.setState(({toggle}) => ({
      toggle: !toggle
    }));
  }
  render() {
    const post = this.props.post;
    return (
      <Marker
        position={{
          lat: post.location.lat,
          lng: post.location.lon
        }}
        onMouseOver={this.onToggle}
        onMouseOut={this.onToggle}
      >
        {(this.state.toggle ?
        <InfoWindow onCloseClick={this.onToggle}>
          <div>
            {
              post.type === 'image' ? <img src={post.url} alt={post.message} className='around-marker'/> :
              <video src={post.url} className='around-marker' />
            }
            <div>{`${post.user}: ${post.message}`}</div>\
          </div>
        </InfoWindow>
        : null)}
      </Marker>
    );
  }
}
