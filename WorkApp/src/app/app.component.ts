import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SettingPage } from '../pages/setting/setting';
import { ListPage } from '../pages/list/list';
import { GooglePlus } from '@ionic-native/google-plus';
import { GlobalProvider } from '../provider/globalprovider';
import { ManageAddressesPage } from '../pages/manage-addresses/manage-addresses';
import { AngularFireAuth } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  constructor(private afAuth: AngularFireAuth,
              public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public global: GlobalProvider,
              public googlePlus: GooglePlus,
              public fb: Facebook) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {           
      this.googlePlus.trySilentLogin({ 
        'webClientId': '402830098374-t0grsirtjuot1sluav5p8ofq52u313ht.apps.googleusercontent.com'       
      })
      .then((data) => {        
        this.rootPage = ListPage;
        this.splashScreen.hide();
      }, (error) => {        
        this.rootPage = LoginPage;
        this.splashScreen.hide();
      });
      this.statusBar.styleDefault();      
    });
  }

  goToList() {
    this.nav.setRoot(ListPage);
  }

  goToHome () {
    this.nav.setRoot(HomePage);
  }

  goToMap () {
    this.nav.setRoot(MapPage);
  }

  goToSetting () {
    this.nav.setRoot(SettingPage);
  }
  
  goToService() {
    this.nav.setRoot(ManageAddressesPage);
  }
  
  logout() {
    this.afAuth.auth.signOut();
    this.googlePlus.logout().then( () => {
      this.googlePlus.disconnect();
    });
    this.fb.getLoginStatus().then( data=>{
      if (data.status =='connected'){
        this.fb.logout();
      }
    });
    this.global.current_user = {
      email: '',
      password: '',
      name: '',
      picture: ''
    };
    setTimeout(() => {
      this.global.isShowMenu = false;
      this.global.isSupport = false;
      this.nav.setRoot(LoginPage, {splash: false});
    }, 500);
  }
}
