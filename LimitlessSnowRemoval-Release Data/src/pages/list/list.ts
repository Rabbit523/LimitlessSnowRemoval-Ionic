import { Component } from '@angular/core';
import { NavController, Platform, ToastController, AlertController } from 'ionic-angular';
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
  is_speech =false;
  count: number = 0;

  constructor(public navCtrl: NavController, 
              public appRef: ApplicationRef, 
              public global: GlobalProvider,
              private addrListService: AddressService, 
              public speechRecognition: SpeechRecognition, 
              private plt: Platform, 
              private cd: ChangeDetectorRef,
              public alertCtrl: AlertController,
              private toast: ToastController) {
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
    const prompt = this.alertCtrl.create({        
      title: 'Search',
      message: "Enter the name of city or country",
      inputs: [
        {
          name: 'search',
          placeholder: 'search'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {              
          }
        },
        {
          text: 'Search',
          handler: data => {        
            this.filters = [];                    
            this.items.forEach(function (e) {                                            
              if (String(e.address.city).toLowerCase() == String(data.search).toLowerCase() || 
                  String(e.address.country).toLowerCase() == String(data.search).toLowerCase() ||
                  String(e.address.tag).toLowerCase() == String(data.search).toLowerCase()) {                              
                this.filters.push(e);                      
                return;
              }                             
            }, this); 
            this.cd.detectChanges();               
          }
        }
      ]
    });          
    if (this.plt.is('android') && Number(this.plt.version().str) >= 7.1) {
      if (this.count != 1) {
        this.is_speech = true;      
        this.toast.create({
          message: "Your phone is android v7.1.1 +. Currently released Ionic frameworks support android v7.1.0 in maximum. And the speech recognition plugin works under android v7.0.0.",
          duration: 5000,
          showCloseButton: false,
          dismissOnPageChange: true,
          cssClass: "toast-failed.scss",
        }).present();
        this.count = 1;
        setTimeout(() => prompt.present(), 5000);
      } else if (this.count == 1) {      
        prompt.present(); 
      }         
    } else {                   
      let options = {
        language: 'en-US'
      }
      this.speechRecognition.startListening(options).subscribe(matches => {      
        this.matches = matches;
        this.filters = [];      
        this.items.forEach(function (e) {        
          for (var item in e.address) {       
            for (var m_item in matches) {
              if (String(e.address[item]).toLowerCase() == String(matches[m_item]).toLowerCase()) {              
                this.filters.push(e);            
                return;
              }
            }
          }
        }, this); 
        this.cd.detectChanges();
      });
      this.isRecording = true;      
    }
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
            if (address.user_info == this.global.current_user.email) {
              temparr.push({
                title: address.city + ", " + address.country,
                note: address.street + ", " + address.city + ", " + address.country,
                imagepath: address.imagepath,
                address: {key: key, ...address},
                show: true
              });            
            }            
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
