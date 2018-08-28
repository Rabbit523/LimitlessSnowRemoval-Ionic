import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { ApplicationRef } from '@angular/core';

import { GlobalProvider } from '../../provider/globalprovider';
import { AddressService } from '../../services/address.service';
import firebase from "firebase";
import { HomePage } from '../home/home';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  items: any; //Array<any>; //Array<{title: string, note: string, imagepath: string}>;
  filters: any;
  matches: String[];
  isRecording = false;
  filtered = false;
  addrList = firebase.database().ref('address');

  constructor(public navCtrl: NavController, public appRef: ApplicationRef, public global: GlobalProvider,
              private addrListService: AddressService, public speechRecognition: SpeechRecognition, private plt: Platform, private cd: ChangeDetectorRef) {
    this.items = [];
    this.filters = [];
    this.getAllCatList().then((res) => {
      this.items = res;
      this.filters = res;
      this.appRef.tick();
    });
  }
  ngAfterViewInit() {
    this.global.isShowMenu = true;
  }

  isIos() {
    return this.plt.is('ios');
  }
 
  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }
 
  getPermission() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission();
        }
      });
  }
 
  startListening() {
    let options = {
      language: 'en-US'
    }
    this.speechRecognition.startListening(options).subscribe(matches => {
      this.matches = matches;
      this.filters = [];

      this.items.forEach(function (e) {    
        for (var item in e.address) {
          if (e.address[item].toLowerCase() == matches[0].toLowerCase()) {          
            this.filters.push(e);            
            return;
          }
        }
      }, this); 
      this.cd.detectChanges();
    });
    this.isRecording = true;
  }

  ShowOriginal () {    
    this.filters = this.items;
    this.appRef.tick();
  }

  getAllCatList() {
    return new Promise((resolve, reject) => {
      this.addrList.on('value', (snapshot) => {
          let Catdata = snapshot.val();
          let temparr = [];
          for (var key in Catdata) {
            var address = Catdata [key];            
            temparr.push({
              title: address.city + ", " + address.country,
              note: address.street + ", " + address.city + ", " + address.country,
              imagepath: address.imagepath,
              address: {key: key, ...address},
              show: true
            });            
            resolve(temparr);
          }
      });
    });
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    if (this.isPressTrash) {
      this.isPressTrash = false;
      return;
    }
    this.navCtrl.push(HomePage, {
      item: item.address
    });
  }

  isPressTrash : any = false;
  onTrash(event, item) {    
    this.isPressTrash = true;
    //Delete Original Image
    try {
      this.addrListService
      .deleteImage(item.address.imagepath)
      .subscribe(() => {});
    } catch (e) {}
    this.addrListService.removeAddress(item.address);
    
    for (var index in this.items) {
      if (this.items [index].address.key == item.address.key) {
        this.items.splice(index, 1);
        return;
      }
    }
    for (var inc in this.filters) {
      if (this.filters [inc].address.key == item.address.key) {
        this.filters.splice(inc, 1);
        return;
      }
    }

    this.appRef.tick();
    event.preventDefault();
    return false;
  }

  onAddItem() {
    this.navCtrl.push(HomePage);
  }
}
