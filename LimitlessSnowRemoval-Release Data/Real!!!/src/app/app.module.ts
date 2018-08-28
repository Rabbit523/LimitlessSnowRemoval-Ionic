import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { MapPage } from '../pages/map/map';
import { SettingPage } from '../pages/setting/setting';
import { InputaddrPage } from '../pages/inputaddr/inputaddr';
import { ListPage } from '../pages/list/list';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { FIREBASE_CONFIG } from './app.firebase.config';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { Camera } from '@ionic-native/camera';

import { GlobalProvider } from '../provider/globalprovider';
import { AddressService } from '../services/address.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { HttpClientModule } from '@angular/common/http';

import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';

@NgModule({
  declarations: [
    MyApp,
    ListPage,
    HomePage,
    LoginPage,
    RegisterPage,
    MapPage,
    SettingPage,
    InputaddrPage
  ],
  imports: [
    JsonpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage,
    HomePage,
    LoginPage,
    RegisterPage,
    MapPage,
    SettingPage,
    InputaddrPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Geolocation,
    Device,
    SpeechRecognition,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalProvider,
    AddressService,
    GooglePlus,
    NativeStorage
  ]
})
export class AppModule {
}
