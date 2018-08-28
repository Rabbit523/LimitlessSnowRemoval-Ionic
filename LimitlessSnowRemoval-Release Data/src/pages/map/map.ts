import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform  } from 'ionic-angular';
import * as firebase from 'Firebase';
import { GlobalProvider } from '../../provider/globalprovider';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';
import { Address } from '../../models/addresses';
import { State } from '../../models/state';

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  locations: any;
  markers = [];
  ref = firebase.database().ref('geolocations/'); 
  minuslatLng : any; pluslatLng : any; mainlatLng : any;
  addresses = {} as Address;
  state = {} as State;
  locationList = firebase.database().ref('state');
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public platform: Platform,           
              public global: GlobalProvider,
              public geolocation: Geolocation,
              public alertCtrl: AlertController ) {
    this.locations = [];
    platform.ready().then(() => {
      this.getAllLocations().then((res) => {
        this.locations = res;
        this.initMap();        
      });      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  initMap() {    
    let geoOptions = {
      timeout:10000,
      enableHighAccuracy:true
    };
    this.geolocation.getCurrentPosition(geoOptions).then((position) => {           
      const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      const options = {center:location, zoom:15, mapTypeId: google.maps.MapTypeId.ROADMAP};
      this.map = new google.maps.Map(this.mapElement.nativeElement, options);    
      this.addMarkersToMap(position.coords.latitude, position.coords.longitude);
      
      this.minuslatLng = {
        lat: position.coords.latitude - 0.0090440444966989,
        lng: position.coords.longitude - 0.0089831117499102
      };        
      this.pluslatLng = {
        lat: position.coords.latitude + 0.0090440444966989,
        lng: position.coords.longitude + 0.0089831117499102
      }; 
      this.mainlatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };  
      this.getAddress(this.mainlatLng).then((resp) => {          
        this.addresses.mainAddress = resp;
        this.addresses.mainAddr = this.getLocation(resp);
        return;
      }).then(() => {
        return this.getAddress(this.minuslatLng);
      }).then((resp) => {          
        this.addresses.minusAddress = resp;
        this.addresses.minusAddr = this.getLocation(resp);
        return this.getAddress(this.pluslatLng);
      }).then((resp) => {          
        this.addresses.plusAddress = resp;
        this.addresses.plusAddr = this.getLocation(resp);
        return;
      }).then(() => {
        setTimeout(() => this.doRadio(), 1500);
      });      
    });    
  }

  doRadio() {    
    let dialog = this.alertCtrl.create();
    dialog.present();
    dialog.setTitle('Choose the correct location');
    for (var key in this.locations) {
      var location = this.locations[key];
      if (String(location.stateAddress).toLowerCase().match(String(this.addresses.minusAddr).toLowerCase())) {
        dialog.addInput({type: 'radio', label: this.addresses.minusAddr, value: '1', checked: true});
      } 
      if (String(location.stateAddress).toLowerCase().match(String(this.addresses.mainAddr).toLowerCase())) {
        dialog.addInput({type: 'radio', label: this.addresses.mainAddr, value: '2'});
      } 
      if (String(location.stateAddress).toLowerCase().match(String(this.addresses.plusAddr).toLowerCase())) {
        dialog.addInput({type: 'radio', label: this.addresses.plusAddr, value: '3'});
      } else {
        dialog.setTitle("No locations in 1km around!");
      }
    }
    
    dialog.addButton('Cancel');
    dialog.addButton({
      text: 'OK',
      handler: data => {
        dialog.dismiss();
        if (data == "1") {             
          this.setDetailAddress(this.minuslatLng, this.addresses.minusAddress);          
        } else if (data == "2") {          
          this.setDetailAddress(this.mainlatLng, this.addresses.mainAddress);
        } else if (data == "3") {          
          this.setDetailAddress(this.pluslatLng, this.addresses.plusAddress);
        }
      }      
    });    
  }

  getAddress(latLng: any): Promise<any> {
    var geocoder = new google.maps.Geocoder();    
    return new Promise((resolve,reject) => {    
      geocoder.geocode({'location': latLng}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            resolve(results[0]);
          } else {
            reject('No results found');
          }
        } else {
          reject('Geocoder failed due to: ' + status);
        }
      });  
    })
  }

  setDetailAddress(latLng, address) {        
    var getAddressWithType = (address, type) => {
      var newAddr = "";
      address.address_components.forEach((component) => {
        if (component.types.indexOf(type) != -1)
          newAddr = component.long_name;
      })
      return newAddr;
    }
    this.global.state.stateAddress = this.state.stateAddress;
    this.global.address.latitude = latLng.lat;
    this.global.address.longtitude = latLng.lng;
    this.global.address.zipcode = getAddressWithType(address, "postal_code");
    this.global.address.street = getAddressWithType(address, "street_number");
    this.global.address.state = getAddressWithType(address, "route");
    this.global.address.city = getAddressWithType(address, "locality");
    this.global.address.country = getAddressWithType(address, "country");
    this.navCtrl.pop();
  }

  getLocation(address) {
    var getAddressWithType = (address, type) => {
      var newAddr = "";
      address.address_components.forEach((component) => {
        if (component.types.indexOf(type) != -1)
          newAddr = component.long_name;
      })
      return newAddr;
    }
    return getAddressWithType(address, "street_number") + " " + getAddressWithType(address, "route");
  }

  addMarkersToMap(lat, lng) {     
    let position = new google.maps.LatLng(lat, lng);
    let Marker = new google.maps.Marker({position: position, title: "Me", animation: google.maps.Animation.DROP});
    Marker.setMap(this.map);
  }

  getAllLocations() {    
    return new Promise((resolve, reject) => {
      this.locationList.on('value', (snapshot) => {
          let Catdata = snapshot.val();
          var temparr = [];
          for (var key in Catdata) {
            var state = Catdata [key];
            if (String(state.staff).toLocaleLowerCase() == String(this.global.current_user).toLocaleLowerCase()) {
              temparr.push({
                key: key,
                stateAddress: state.stateAddress,
                staff: state.staff
              });
            }
          }
          resolve(temparr);
      });
    });
  }
}