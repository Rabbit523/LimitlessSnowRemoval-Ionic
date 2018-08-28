import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, AlertController } from 'ionic-angular';
import { GlobalProvider } from '../../provider/globalprovider';
import { ApplicationRef } from '@angular/core';
import { AddressService } from '../../services/address.service';
import firebase from "firebase";
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ChangeDetectorRef } from '@angular/core';
import { State } from '../../models/state';

@IonicPage()
@Component({
  selector: 'page-manage-addresses',
  templateUrl: 'manage-addresses.html',
})
export class ManageAddressesPage {
  items: any;
  filters: any;
  matches: String[];
  isRecording = false;
  filtered = false;
  addrList = firebase.database().ref('state');
  is_speech =false;
  count: number = 0;
  isPressTrash : any = false;
  state = {} as State;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private plt: Platform, 
              public global: GlobalProvider,
              public appRef: ApplicationRef, 
              public addrListService: AddressService, 
              public speechRecognition: SpeechRecognition, 
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageAddressesPage');
  }

  ngAfterViewInit() {
    this.global.isShowMenu = true;
    this.global.isSupport = true;
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
              if (String(e.stateAddress).includes(String(data.search))) {                              
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
          duration: 7000,
          showCloseButton: false,
          dismissOnPageChange: true,
          cssClass: "toast-failed.scss",
        }).present();
        this.count = 1;
        setTimeout(() => prompt.present(), 7000);
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
          for (var m_item in matches) {            
            if (String(e.stateAddress).toLowerCase().includes(String(matches[m_item]).toLowerCase())) {
              this.filters.push(e);            
              return;
            }
          }        
        }, this); 
        this.cd.detectChanges();
      });
      this.isRecording = true;      
    }
  }

  getAllCatList() {    
    return new Promise((resolve, reject) => {
      this.addrList.on('value', (snapshot) => {
          let Catdata = snapshot.val();
          var temparr = [];
          for (var key in Catdata) {
            var state = Catdata [key];
            temparr.push({
              key: key,
              stateAddress: state.stateAddress,
              staff: state.staff
            });
          }
          resolve(temparr);
      });
    });
  }

  onTrash(event, item) {    
    this.isPressTrash = true;    
    this.addrListService.removeState(item).then(() => {      
      for (var index in this.items) {
        if (this.items [index].key == item.key) {
          this.items.splice(index, 1);
          return;
        }
      }
      for (var inc in this.filters) {
        if (this.filters [inc].key == item.key) {
          this.filters.splice(inc, 1);
          return;
        }
      }      
    }).then(()=> {
      this.appRef.tick();
      event.preventDefault();
      return false;
    });    
  }

  onAddItem() {
    let dialog = this.alertCtrl.create();
    dialog.present();
    dialog.setTitle('Add New Address');
    dialog.addInput({type: 'text', name: "address", placeholder: 'Input the address'});
    dialog.addInput({type: 'text', name: "staff", placeholder: 'Input the staff name'});
    dialog.addButton('Cancel');
    dialog.addButton({
      text: 'Save',
      handler: (data) => {        
        this.state.stateAddress = data.address;
        this.state.staff = data.staff;
        this.global.state = this.state;       
        this.addrListService.addState(this.global.state).then(()=> {
          this.getAllCatList().then((res)=>{
            this.filters = res;
            this.items = res;
            this.appRef.tick();            
          });
        });        
      }
    });
  }

  ShowOriginal () {    
    this.filters = this.items;
    this.appRef.tick();
  }

  itemTapped(event, item) {
    if (this.isPressTrash) {
      this.isPressTrash = false;
      return;
    }
    let dialog = this.alertCtrl.create();
    dialog.present();
    dialog.setTitle('Edit Address');
    dialog.addInput({type: 'text', name: "address", placeholder: 'Input the address', value: item.stateAddress});
    dialog.addInput({type: 'text', name: "staff", placeholder: 'Input the staff name', value: item.staff});
    dialog.addButton('Cancel');
    dialog.addButton({
      text: 'Save',
      handler: (data) => {        
        this.state.stateAddress = data.address;
        this.state.staff = data.staff;        
        this.global.state = this.state;
        this.global.state.key = item.key;
        this.addrListService.updateState(this.global.state).then(()=> {
          this.getAllCatList().then((res)=>{
            this.filters = res;
            this.items = res;
            this.appRef.tick();            
          });
        });        
      }
    });
  }
}