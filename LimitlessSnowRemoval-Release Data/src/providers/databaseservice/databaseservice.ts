import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DatabaseserviceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DatabaseserviceProvider Provider');
  }

}
