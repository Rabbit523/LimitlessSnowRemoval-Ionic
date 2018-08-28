import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform  } from 'ionic-angular';
import * as firebase from 'Firebase';
import { GlobalProvider } from '../../provider/globalprovider';

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  ref = firebase.database().ref('geolocations/');

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public platform: Platform,           
              public global: GlobalProvider) {
    platform.ready().then(() => {
      this.initMap();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  initMap() {
    const location = new google.maps.LatLng(43.119809, 131.886924);
    const options = {center:location, zoom:10};
    this.map = new google.maps.Map(this.mapElement.nativeElement, options);
    var geocoder = new google.maps.Geocoder();
    var navCtrl = this.navCtrl;
    var global = this.global;

    google.maps.event.addListener(this.map, 'click', function(event) {     
      geocoder.geocode({
        'latLng': event.latLng
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            var address = results [0];

            var getAddressWithType = (address, type) => {
              var newAddr = "";
              address.address_components.forEach((component) => {
                if (component.types.indexOf(type) != -1)
                  newAddr = component.long_name;
              })
              return newAddr;
            }
                  
            global.address.latitude = event.latLng.lat();
            global.address.longtitude = event.latLng.lng();
            global.address.zipcode = getAddressWithType(address, "postal_code");
            global.address.street = getAddressWithType(address, "street_number");
            global.address.state = getAddressWithType(address, "route");
            global.address.city = getAddressWithType(address, "locality");
            global.address.country = getAddressWithType(address, "country");
            navCtrl.pop();
          }
        }
      });
    });
  }

  addMarkersToMap(markers) {
    for(let marker of markers) {
      var position = new google.maps.LatLng(marker.latitude, marker.longitude);
      var dogwalkMarker = new google.maps.Marker({position: position, title: marker.title});
      dogwalkMarker.setMap(this.map);
    }
  }
}