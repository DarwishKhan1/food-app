import React, { Component } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
} from "react-google-maps";

class Map extends Component {
  state = {
    selected: {
      lat: 0,
      lng: 0,
    },
  };

  componentDidMount = () => {
    this.setState({
      selected: {
        lat: this.props.lat ? this.props.lat : 0,
        lng: this.props.lng ? this.props.lng : 0,
      },
    });
  };
  mapclicked = (coord) => {
    this.setState({
      selected: {
        lat: coord.latLng.lat(),
        lng: coord.latLng.lng(),
      },
    });
    this.props.selectArea(this.state.selected);
  };

  map = () => {
    return (
      <GoogleMap
        defaultZoom={5}
        defaultCenter={{
          lat: this.state.selected.lat ? this.state.selected.lat : -60.930432,
          lng: this.state.selected.lng ? this.state.selected.lng : 1.029414,
        }}
        onClick={this.mapclicked}
      >
        <Marker
          position={{
            lat: this.state.selected.lat ? this.state.selected.lat : -60.930432,
            lng: this.state.selected.lng ? this.state.selected.lng : 1.029414,
          }}
        />
      </GoogleMap>
    );
  };
  render() {
    const WrappedMap = withScriptjs(withGoogleMap(this.map));
    return (
      <div className="mt-1 mb-4 mx-auto">
        <WrappedMap
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB7qtP77Rx3HmirB5lyWJ90RYeMu4TVnyc&libraries=places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `350px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default Map;
