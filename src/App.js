// import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import _ from "lodash";
//storesHash, updateStoresWithNewData
import { getStores } from './services/apiService';
import { StoresComponent } from './components/Stores';
import { Marker } from './components/Marker';
import { haversine_distance, getBrowserUserLocation } from './services/utilService';
import {
  defaultCenter, lastUpdated, defaultZoom, defaultDistance,
  zoomDistanceMap, minZoom, maxZoom, styledMapTypeUber
} from './services/constants';
import './App.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner'

export class App extends Component {
  constructor(props) {
    super(props);
    this.lastQueryParams = {};

    this.state = {
      // update places
      places: [],
      // used when store is clicked and Map is to be centered.
      center: null,
      // used to update API calls when the pan distance exceeds distance/2
      panCenter: {
        lat: defaultCenter.lat,
        lng: defaultCenter.lng
      },
      isLoading: false,
      mapInstance: null,
      mapApi: null,
      distance: defaultDistance,
      selectedStoreId: null,
      home: null
    };

    getBrowserUserLocation().then((position) => {
      this.handleGetLocationStates(position);
    }).catch((err) => {
      console.error(err);
      this.handleGetLocationStates(defaultCenter);
    });
  }

  handleHomeLocation(location) {
    const homeLocation = {
      id: 1,
      lat: location.lat,
      lon: location.lng,
      timeStamp: null,
      isSelected: true,
      last_transaction: null,
      name: 'Home Location',
      isHome: true,
      text: 'Home'
    };

    if (this.state.places.length === 0) {
      this.setState((prevState) => {
        return {
          places: [homeLocation],
          home: location
        };
      });
    }
    if(this.state.places.length > 0) {
      if (!this.state.places.filter(place => place.id === 1).length) {
        this.setState((prevState) => {
          return {
            places: prevState.places.unshift(homeLocation),
            home: location
          };
        });
      }
    }

  }

  handleGetLocationStates(position) {
    this.handleHomeLocation(position);
    this.setState({
      center: position
    });

    // this.delayedGetPlaces({
    //   lat: this.state.center.lat,
    //   lon: this.state.center.lng,
    //   mins: lastUpdated,
    //   dist: this.state.distance
    // });
  }

  delayedGetPlaces = _.throttle((queryParams) => {

    if (JSON.stringify(this.lastQueryParams) === JSON.stringify(queryParams)) {
      return;
    }
    this.setState({ isLoading: true });
    this.lastQueryParams = queryParams;
    getStores(queryParams).then((result) => {
      const newCenter = { lat: queryParams.lat, lng: queryParams.lon };
      // updateStoresWithNewData(result);
      // const places = Array.from(storesHash.values());
      const places = result;
      this.setState({
        places: places,
        panCenter: newCenter
      });

      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 800);

    }, (error) => {
      console.error(error);
      this.setState({ isLoading: false });
    });
  }, 1500);

  onMapDrag(map) {
    const currPanCenter = { lat: map.center.lat(), lng: map.center.lng() };
    // console.log('distance in metres', (haversine_distance(currPanCenter, prevState.panCenter) * 1000));
    if ((haversine_distance(currPanCenter, this.state.panCenter) * 1000) > (this.state.distance / 2)) {
      // this.delayedGetPlaces({
      //   lat: currPanCenter.lat,
      //   lon: currPanCenter.lng,
      //   mins: lastUpdated,
      //   dist: this.state.distance
      // });

      // this.setState({ center: currPanCenter });
    }
  }

  updateCenter(coords) {

    const zoomLevel = this.state.mapInstance.getZoom();

    if (zoomLevel !== defaultZoom) {
      this.state.mapInstance.setZoom(defaultZoom);
    }

    if (coords.id === 1) {
      this.setState({ home: { lat: coords.lat, lng: coords.lng } });
      this.state.mapInstance.setCenter({ lat: coords.lat, lng: coords.lng });
    }
    // this.delayedGetPlaces({
    //   lat: coords.lat,
    //   lon: coords.lng,
    //   mins: lastUpdated,
    //   dist: this.state.distance,
    //   limit: 40
    // });

    this.setState({
      center: { lat: coords.lat, lng: coords.lng },
      distance: zoomDistanceMap[defaultZoom],
      selectedStoreId: coords.id
    });
  }

  onZoomChange() {
    const newZoom = this.state.mapInstance.getZoom();
    // this.delayedGetPlaces({
    //   lat: this.state.center.lat,
    //   lon: this.state.center.lng,
    //   mins: lastUpdated,
    //   dist: this.state.distance
    // });
    this.setState({ distance: zoomDistanceMap[newZoom] });
  }

  render() {
    const { places, center, isLoading, selectedStoreId } = this.state;

    let mapPlaces = places;
    return (
      <>
        <Loader className="loader" type="Puff" color="#072f5d"
          height={100} width={100} visible={isLoading} timeout={5000}
        />
        {mapPlaces && mapPlaces.length > 0 && <>

          <StoresComponent center={center || defaultCenter} selectedStore={selectedStoreId} stores={mapPlaces}
            onStoreSelect={(coords) => { this.updateCenter(coords) }} />

          <div className="map-container">
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.REACT_APP_NOT_SECRET_CODE }}
              yesIWantToUseGoogleMapApiInternals
              defaultCenter={defaultCenter}
              center={center || defaultCenter}
              defaultZoom={defaultZoom}
              onDrag={(map) => this.onMapDrag(map)}
              onGoogleApiLoaded={({ map, maps }) => {
                this.googleApiIsLoaded(map, maps);
              }}>
              {mapPlaces.map(place => (

                <Marker
                  key={place.id}
                  text={place.isHome ? place.text : place.name}
                  lat={place.lat}
                  lng={place.lon}
                  timeStamp={place.last_transaction}
                  isSelected={place.id === selectedStoreId ? true : false}
                  isHome={place.isHome ? true : false}
                />
              ))}
            </GoogleMapReact>
          </div>
        </>}
      </>
    );
  }

  googleApiIsLoaded(map, maps) {
    map.setOptions({
      zoomControl: true,
      minZoom,
      maxZoom
    });

    map.zoom_changed = () => {
      this.onZoomChange();
    };

    this.setState({
      mapInstance: map,
      mapApi: maps
    });

    map.mapTypes.set(
      'styled_map', new maps.StyledMapType(styledMapTypeUber, { name: 'Styled Map' })
    );
    map.setMapTypeId('styled_map');
  }
}

export default App;