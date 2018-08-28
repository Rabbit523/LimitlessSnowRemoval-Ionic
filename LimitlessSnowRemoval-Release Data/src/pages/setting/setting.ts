import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../provider/globalprovider';
import { User } from '../../models/user';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  user: User;
  constructor(public navCtrl: NavController, public global: GlobalProvider, public navParams: NavParams) {
    this.user = global.current_user;    
    if (global.current_user.name == null) {
      this.user.name = "to Limitless Snow Removal";
      this.user.picture = "assets/imgs/logo.png";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  ionViewCanEnter(){
  }
}
