import * as moment from 'moment';

export function getIsoString(timestampString){
  return timestampString.substring(0, 19) + timestampString.substring(26);
}

export function haversine_distance(mk1, mk2) {
  //https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
  var R = 6371.0710; // Radius of the Earth in miles
  var rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
  return d;
}

export function getBrowserUserLocation() {
  if (navigator.geolocation) {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(function (position) {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, function () {
        reject('Cannot get your current location. Using the Default Map Location');
      });
    });
  } else {
    return new Promise(function (resolve, reject) {
      reject('Cannot get your current location. Using the Default Map Location.');
    });
  }

}

export function distanceComparator(direction, center) {
  return function (objectA, objectB) {
    const distanceA = haversine_distance({lat:objectA.lat, lng: objectA.lon}, center);
    const distanceB = haversine_distance({lat:objectB.lat, lng: objectB.lon}, center);
    if (distanceA < distanceB) {
      return direction === 'asc' ? -1 : 1;
    } else if (distanceA > distanceB) {
      return direction === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  };
}

export function timeStringComparator(compareField, direction) {
  return function (objectA, objectB) {
    if(!objectA[compareField] || !objectB[compareField]){
      return -1;
    }
    const timeStringA = getIsoString(objectA[compareField]);
    const timeStringB = getIsoString(objectB[compareField]);

    if (moment(timeStringA).isBefore(timeStringB)) {
      return direction === 'asc' ? -1 : 1;
    } else if (moment(timeStringA).isAfter(timeStringB)) {
      return direction === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  };
}
