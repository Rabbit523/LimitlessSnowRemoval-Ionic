import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageAddressesPage } from './manage-addresses';

@NgModule({
  declarations: [
    ManageAddressesPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageAddressesPage),
  ],
})
export class ManageAddressesPageModule {}
