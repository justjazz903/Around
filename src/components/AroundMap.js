import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  } from "react-google-maps"
import {AroundMarker} from './AroundMarker.js'
import {POS_KEY} from '../constants.js'

class NormalAroundMap extends React.Component{
  saveMapRef = (mapInstance) => {
    this.map = mapInstance;
  }

  reloadMarkers = () => {
    const center = this.map.getCenter();
    const newPos = {
      lat: center.lat(),
      lon: center.lng()
    };
    const bounds = this.map.getBounds();
    const northEast = bounds.getNorthEast();
    const east = new window.google.maps.LatLng(center.lat(), northEast.lng());
    const range = new window.google.maps.geometry.spherical.computeDistanceBetween(center, east) / 1000;
    if (this.props.onChange){
      this.props.onChange(newPos, range);
    }
  }

  render() {
    const curPos = JSON.parse(localStorage.getItem(POS_KEY))
    return (
      <GoogleMap
        ref={this.saveMapRef}
        defaultZoom={11}
        defaultCenter={{ lat: curPos.lat, lng: curPos.lon }}
        onDragEnd={this.reloadMarkers}
        onZoomChanged={this.reloadMarkers}
        onResize={this.reloadMarkers}
      >
        {
          this.props.posts.map((post) => (
            <AroundMarker post={post} key={post.url} />
          ))
        }
      </GoogleMap>
    );
  }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));
