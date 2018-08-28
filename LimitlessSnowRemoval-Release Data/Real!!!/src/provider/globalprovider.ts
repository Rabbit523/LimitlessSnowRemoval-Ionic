import { Injectable } from '@angular/core';
import { Address } from "../models/address";
import { ImageData } from '../models/imagedata';
/*
  Generated class for the GlobalProvider provider.
*/
@Injectable()
export class GlobalProvider {
  public address = {} as Address;
  public image:ImageData;
  public isShowMenu:boolean;
}