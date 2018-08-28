import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { User } from "../../models/user";
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { ListPage } from '../list/list';
import {Platform} from 'ionic-angular'; 
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';

import { GlobalProvider } from '../../provider/globalprovider';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  splash = true;
  user = {
    email: "",
    password: ""
  } as User;

  google = {
    name: '',
    profilePicture: '',
    email: ''
  }

  loggedin = false;

  imgHeight:any;

  constructor(private afAuth: AngularFireAuth, 
              private toast: ToastController, 
              public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public global: GlobalProvider,
              public platform: Platform,
              public googlePlus: GooglePlus,
              public nativeStorage: NativeStorage) {
    this.splash = navParams.get('splash');
    if (this.splash == undefined) {
      this.splash = true;
    }
    
    this.imgHeight = "35%";
    platform.ready().then((readySource) => {
      this.imgHeight = platform.height() * 0.35 + "px";
    });
  }
  
  ngAfterViewInit() {
  }

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 4000);
  }

  async login(user: User) {
    this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      this.navCtrl.setRoot(ListPage);
    })
    .catch (error => {      
      this.toast.create({
        message: 'Could not find authentication details.',
        duration: 5000,
        showCloseButton: false,
        dismissOnPageChange: true,
        cssClass: "toast-failed.scss",
      }).present();
    })   
  }

  logOut() {
    this.afAuth.auth.signOut();
    this.googlePlus.logout()
    .then(function (response) {
      this.nativeStorage.remove('user');
      this.navCtrl.setRoot(LoginPage);
    },function (error) {
      alert(error);
    });
    this.loggedin = false;
    this.navCtrl.setRoot(LoginPage);
  }
  signUp() {
    this.navCtrl.push(RegisterPage);
  }

  googleLogin() {    
    // this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    // .then (res => {
    //   alert(res);
    //   this.navCtrl.setRoot(ListPage);
    // })    
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();	 
    this.googlePlus.login({
      'scopes': '', 
      'webClientId': '870313874706-edch2jec3d1qfjv5vhdpv1o3okeccg5c.apps.googleusercontent.com',
      'offline': true
    })
    .then(function (user) {    
      alert("user"); 
      loading.dismiss();
      this.nativeStorage.setItem('user', {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl
      })
      .then(function(){        
        this.navCtrl.setRoot(ListPage);
        }, function (error) {
        alert(error);
      })
    }, function (error) {
      alert(error);
      loading.dismiss();
    });
  }

  facebookLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .then (res => {
        console.log(res);
        this.navCtrl.setRoot(ListPage);
    })
  }
}
