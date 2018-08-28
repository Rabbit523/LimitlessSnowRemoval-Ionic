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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public global: GlobalProvider,
              public googlePlus: GooglePlus) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {     
      this.googlePlus.trySilentLogin({
        'scopes': '', 
        'webClientId': '870313874706-edch2jec3d1qfjv5vhdpv1o3okeccg5c.apps.googleusercontent.com', 
        'offline': true
      })
      .then((data) => {
        this.nav.setRoot(ListPage);
        this.splashScreen.hide();
      }, (error) => {
        this.nav.setRoot(LoginPage);
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
  
  logout() {
    setTimeout(() => {
      this.global.isShowMenu = false;
      this.nav.setRoot(LoginPage, {splash: false});
    }, 500);
  }
}
