import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage, 
         AngularFireUploadTask } from 'angularfire2/storage';
import { Address } from '../models/address';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AddressService {

    private addressListRef = this.db.list<Address>('address');

    constructor(private db: AngularFireDatabase, private afStorage: AngularFireStorage) {}

    getAddressList() {
        return this.addressListRef;
    }

    addAddress(address: Address) {
        return this.addressListRef.push(address);
    }

    updateAddress(address: Address) {
        return this.addressListRef.update(address.key, address);
    }

    removeAddress(address: Address) {
        return this.addressListRef.remove(address.key);
    }

    addImage(image): AngularFireUploadTask {
        let imgName = `files/${new Date().getTime()}.png`;
        return this.afStorage.ref(imgName).put(image);
    }

    deleteImage(orgImgName): Observable<any> {    
        var pathStart = orgImgName.indexOf("files%2F")
        var pathEnd = orgImgName.indexOf(".png") + 4;
        var path = orgImgName.substring(pathStart, pathEnd);
        path = path.replace("%2F", "/")        
        return this.afStorage.ref(path).delete();
    }
}