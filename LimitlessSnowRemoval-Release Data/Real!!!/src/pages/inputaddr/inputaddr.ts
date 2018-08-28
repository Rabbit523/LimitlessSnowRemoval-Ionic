import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Address } from "../../models/address";
import { MapPage } from '../map/map';
import { GlobalProvider } from '../../provider/globalprovider';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Jsonp } from '@angular/http';

import { AddressService } from '../../services/address.service';
import { ListPage } from '../list/list';
import { Forecast } from '../../models/forecast';

@Component({
  selector: 'page-inputaddr',
  templateUrl: 'inputaddr.html'
})

export class InputaddrPage {
  public isMapSelected : boolean;
  public addr = {} as Address;
  
  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public global: GlobalProvider,
              private addrListService: AddressService,
              public http: HttpClient,
              public jsonp: Jsonp) {
  }

  ionViewWillEnter(): Observable<Forecast> {
    var address = this.global.address;
    if (address.country == ""
        || address.country == undefined) return;

    this.addr = address;
    this.isMapSelected = true;
   
    var headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept','application/json');
    headers.append('content-type','application/json');
    
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    let url = 'https://api.darksky.net/forecast/22529da26a830db484b9941df203cc1c/' + address.latitude + ',' + address.longtitude+'?units=si';
    this.http.get<{Forecast: any}>(proxy+url, {headers: headers}).subscribe(data => {
      this.addr.weather = data["currently"]["temperature"] + "°C, "+ data["currently"]["summary"];   
    });  
  }

  onUsingMap() {
    this.navCtrl.push(MapPage);
  } 
  
  onAcceptAddress() {
    if (this.global.image.image == null) {
      //Use original image.
      this.addrListService.updateAddress(this.global.address).then(ref => {
        this.navCtrl.setRoot(ListPage);
      });
    } else {
      if (this.global.address.key) {
        //Delete Original Image
        try {
          this.addrListService
          .deleteImage(this.global.address.imagepath)
          .subscribe(() => {});
        } catch (e) {}
      }
      //Upload new image
      let upload = this.addrListService.addImage(this.global.image.image);

      upload.then().then(ref => {
        upload.task.snapshot.ref.getDownloadURL().then(downloadURL => {
          this.global.address.imagepath = downloadURL;

          if (this.global.address.key)
            this.addrListService.updateAddress(this.global.address).then(ref => {
              this.navCtrl.setRoot(ListPage);
            });
          else
            this.addrListService.addAddress(this.global.address).then(ref => {
              this.navCtrl.setRoot(ListPage);
            });
        });
      });
    }
  }
}
