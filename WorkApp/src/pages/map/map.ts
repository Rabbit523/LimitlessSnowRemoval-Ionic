import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform  } from 'ionic-angular';
import * as firebase from 'Firebase';
import { GlobalProvider } from '../../provider/globalprovider';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  locations: any;
  states: any;
  service: any;
  infoWindow: any;
  vicinities: any;
  markers = [];
  ref = firebase.database().ref('geolocations/'); 
  locationList = firebase.database().ref('state');

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public platform: Platform,           
              public global: GlobalProvider,
              public geolocation: Geolocation,
              public alertCtrl: AlertController ) {
    this.locations = []; 
    this.vicinities = [];
    platform.ready().then(() => {
      this.getAllLocations().then((res) => {
        this.states = res;
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
      const options = {center:location, zoom:17, mapTypeId: google.maps.MapTypeId.ROADMAP};
      this.map = new google.maps.Map(this.mapElement.nativeElement, options);

      var request = {
        location: location,
        rankby : 'distance',
        radius: '100'
        // types: ['vicinity']
      };
      var ref = this;
      this.service = new google.maps.places.PlacesService(this.map).nearbySearch(request, function (results, status) {        
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            for (var j = i + 1; j < results.length; j ++) {
              if (results [i] != null
                 && results [j] != null
                 && results [i].vicinity.match(results [j].vicinity)) {
                results [j] = null;
              }
            }
          }
          for (var k = 0; k < results.length; k++) {
            if (results [k] == null)  continue;
            ref.addMarkersToMap(results[k]);
            ref.locations.push(results[k]);
            ref.vicinities.push(results[k].vicinity);
          }
        }
      });      
    });    
  }

  onsetAddress () {
    alert(JSON.stringify(this.vicinities));
    let dialog = this.alertCtrl.create();
    dialog.present();
    dialog.setTitle('Choose the correct location');
    
    var isFound = false;
    for (var index in this.vicinities) {
      var location = this.vicinities [index];
      for (var key in this.states) {
        var state = this.states[key].stateAddress;
        if (location.indexOf(state) != -1) {                    
          dialog.addInput({type: 'radio', label: location, value: index});
          isFound = true;
          break;
        }        
      }
      if (isFound)  break;     
    }    
    if (!isFound) {
      dialog.setTitle("No locations in 1km around!");
    }
    dialog.addButton('Cancel');
    dialog.addButton({
      text: 'OK',
      handler: data => {
        dialog.dismiss();
        // alert(JSON.stringify(this.locations[data].geometry.location));
        // alert(JSON.stringify(this.locations[data].vicinity));
        var address = {};
        this.getAddress(this.locations[data].geometry.location).then((resp) => {          
          address = resp;
        }).then(()=>{
          this.setDetailAddress(this.locations[data].geometry.location, address);
        });                    
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

    this.global.address.latitude = latLng.lat;
    this.global.address.longtitude = latLng.lng;
    this.global.address.zipcode = getAddressWithType(address, "postal_code");
    this.global.address.street = getAddressWithType(address, "street_number");
    this.global.address.state = getAddressWithType(address, "route");
    this.global.address.city = getAddressWithType(address, "locality");
    this.global.address.country = getAddressWithType(address, "country");    
    this.navCtrl.pop();
  }

  addMarkersToMap(place) {
    
    this.infoWindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location
    });
    var ref = this;
    google.maps.event.addListener(marker, 'click', function () {      
      ref.infoWindow.setContent(place.vicinity);
      ref.infoWindow.open(this.map, this);
    });   
  }

  getAllLocations() {    
    return new Promise((resolve, reject) => {
      this.locationList.on('value', (snapshot) => {
          let Catdata = snapshot.val();
          var temparr = [];
          for (var key in Catdata) {
            var state = Catdata [key];
            if (String(state.staff).toLowerCase().match(String(this.global.current_user.email).toLowerCase())) {
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