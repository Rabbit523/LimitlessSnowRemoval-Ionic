import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserModel } from './user.model';
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  user: UserModel = new UserModel();

  constructor(public navCtrl: NavController, public navParams: NavParams, public nativeStorage: NativeStorage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  ionViewCanEnter(){
    this.nativeStorage.getItem('user')
    .then((data) => {
      alert(data);
      this.user = {
        name: data.name,
        email: data.email,
        picture: data.picture
      };
    }, (error) => {
      console.log(error);
    });
  }

}
