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
import { Facebook } from '@ionic-native/facebook';

import { GlobalProvider } from '../../provider/globalprovider';
import { ManageAddressesPage } from '../manage-addresses/manage-addresses';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  splash = true;
  user = {
    name: '',
    picture: '',
    email: '',
    password: '',
    from: ''
  } as User;

  google = {
    name: '',
    profilePicture: '',
    email: ''
  }
  FB_APP_ID: number = 229144901207708;
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
              public nativeStorage: NativeStorage,
              public fb: Facebook) {
    this.splash = navParams.get('splash');
    if (this.splash == undefined) {
      this.splash = true;
    }
    
    this.imgHeight = "35%";
    platform.ready().then((readySource) => {
      this.imgHeight = platform.height() * 0.35 + "px";
    });
    // this.fb.browserInit(this.FB_APP_ID, "v2.8");
  }
  
  ngAfterViewInit() {
  }

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 4000);
  }

  async login(user: User) {
    this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      this.global.current_user = {
        email: data.user.email,
        password: user.password,
        name: data.user.displayName,
        picture: data.user.photoURL
      };
      this.loggedin = true;   
      if (this.global.current_user.email.match("support@snowlimitless.com")) {
        this.global.isSupport = true;        
        this.navCtrl.setRoot(ManageAddressesPage);    
      } else {        
        this.navCtrl.setRoot(ListPage);        
      }
    })
    .catch (error => {
      alert(error);
      this.toast.create({
        message: 'Could not find authentication details.',
        duration: 5000,
        showCloseButton: false,
        dismissOnPageChange: true,
        cssClass: "toast-failed.scss",
      }).present();
    })
  }

  signUp() {
    this.navCtrl.push(RegisterPage);
  }

  googleLogin() {   
    let env = this;
    let nav = this.navCtrl;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();	 
    this.googlePlus.login({
      'scopes': '',       
      'webClientId': '402830098374-t0grsirtjuot1sluav5p8ofq52u313ht.apps.googleusercontent.com',
      'offline': true,
      'prompt': 'select_account'
    })
    .then(function (user) {                
      loading.dismiss();
      env.loggedin = true;
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(user.idToken);
      firebase.auth().signInWithCredential(googleCredential).then( response => {
        console.log(response);        
      });      
      env.global.current_user = {
        email: user.email,
        password: "",
        name: user.displayName,
        picture: user.imageUrl
      };
      nav.setRoot(ListPage);
    }, function (error) {
      alert(error);
      loading.dismiss();
    });
  }

  facebookLogin() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();	 
    let permissions = new Array<string>();
    let nav = this.navCtrl;
	  let env = this;   
    permissions = ["public_profile"];
    this.fb.login(permissions)
    .then(function(response){     
      loading.dismiss(); 
      let userId = response.authResponse.userID;
      let params = new Array<string>();
     
      env.fb.api("/me?fields=name,gender", params)
      .then(function(user) {        
        env.loggedin = true;
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";        
        env.global.current_user = {
          email: user.email,
          password: "",
          name: user.name,
          picture: user.picture
        };
        nav.setRoot(ListPage);        
      })
    }, function(error){
      loading.dismiss();
      alert(error);
    });
  }
}
