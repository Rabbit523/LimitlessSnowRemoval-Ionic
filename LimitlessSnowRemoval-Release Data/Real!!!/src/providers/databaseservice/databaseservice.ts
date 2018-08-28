import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DatabaseserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseserviceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DatabaseserviceProvider Provider');
  }

}
