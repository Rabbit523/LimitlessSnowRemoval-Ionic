import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;
  registerForm:FormGroup;
  email:AbstractControl;
  password:AbstractControl;

  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private toast: ToastController) {
    this.registerForm = formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(7)
      ]))
    });

    this.email = this.registerForm.controls['email'];
    this.password = this.registerForm.controls['password'];
  }

  async register(user: User) {
    alert(JSON.stringify(user));
    this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
    .then(data => {      
      this.navCtrl.push(LoginPage, {splash: false});
    })
    .catch (error => {
      alert(JSON.stringify(error));
      this.toast.create({
        message: 'Could not find authentication details.',
        duration: 3000,
        cssClass: "toast-failed.scss",
      }).present();
    }) 
  }
}
