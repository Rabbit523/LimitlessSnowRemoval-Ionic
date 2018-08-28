import { Injectable } from '@angular/core';
import { Address } from "../models/address";
import { State } from "../models/state";
import { ImageData } from '../models/imagedata';
import { User } from '../models/user';

@Injectable()
export class GlobalProvider {
  public address = {} as Address;
  public state = {} as State;
  public image:ImageData;
  public isShowMenu:boolean;
  public current_user:User;
  public isSupport:boolean;
}