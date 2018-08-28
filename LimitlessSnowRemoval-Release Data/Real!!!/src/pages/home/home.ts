import { Component, ViewChild, Input } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { InputaddrPage } from '../inputaddr/inputaddr';
import { GlobalProvider } from '../../provider/globalprovider';
import { Address } from '../../models/address';
import { ImageData } from '../../models/imagedata';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ApplicationRef } from '@angular/core';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  location: Location;

  myphoto:any;
  isShowEdit:any;
  isCanCheck:any;
  isSavedImg:any;

  @ViewChild('imgCanvas') imgCanvas;  
  private canvas: any;
  @Input('size') size: number;
  
  isOnEdit:any;
  isMouseDown:any;
  
  prevX:any;
  prevY:any;

  imagePath:any;
  
  constructor(public navCtrl: NavController, 
              public camera: Camera,
              public alertCtrl: AlertController,
              public global: GlobalProvider,
              public navParams: NavParams,
              public appRef: ApplicationRef
            ) {

    this.isShowEdit = false;
    this.isCanCheck = false;
    this.isOnEdit = false;
    this.isMouseDown = false;
    this.isSavedImg = false;

    this.prevX = 0;
    this.prevY = 0;

    var item = navParams.get("item");
    if (item == undefined) {
      this.global.address = {} as Address;
      this.global.image = {} as ImageData;
    } else {
      this.global.address = item;
      this.global.image = {} as ImageData;
    }
  }
  ngAfterViewInit() {
    this.canvas = this.imgCanvas.nativeElement;
    let ctx = this.canvas.getContext('2d');
    ctx.save();

    var item = this.navParams.get("item");
    if (item != undefined) {
      //Edit item
        this.myphoto = item.imagepath;
        this.isShowEdit = false;
        this.isCanCheck = true;
        this.isSavedImg = true;
        this.imagePath = this.myphoto;
    } else {
      this.photoTake();
    }
  }

  photos() {
    this.navCtrl.setRoot(ListPage);
  }

  photoTake() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
      this.isShowEdit = true;
      this.isCanCheck = true;
      this.isSavedImg = false;

      this.appRef.tick();
      this.drawImage(null, (height) => {
        this.canvas.height = height;
      });
    }, (err) => {
      this.navCtrl.pop();
    });
  }

  drawImage(callback, resizeCallback) {
    let ctx = this.canvas.getContext('2d');
    ctx.restore();

    this.imagePath = this.myphoto;
    var img = new Image();
    img.src = this.myphoto;
    img.crossOrigin = "Anonymous";  //anonymous";  //https://firebasestorage.googleapis.com/";
    
    var canvas = this.canvas;

    img.onload = function() {
      if (resizeCallback != null)
        resizeCallback(canvas.width * img.height / img.width);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.width * img.height / img.width);
      if (callback != null)
        callback(img);
    }
  }

  drawText(text, img) {
    let ctx = this.canvas.getContext('2d');

    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(text, this.canvas.width / 2, this.canvas.width * img.height / img.width / 2); 
  }

  onMouseDown($event) {
    if (!this.isShowEdit || !this.isOnEdit) return;
    this.isMouseDown = true;
    var touch = $event.touches[0] || $event.changedTouches[0];
    var canvasPosition = this.canvas.getBoundingClientRect();
		this.prevX = touch.clientX - canvasPosition.left;
    this.prevY = touch.clientY - canvasPosition.top;
  }

  onMouseUp() {
    if (!this.isShowEdit || !this.isOnEdit) return;
    this.isMouseDown = false;
  }

  onMouseMove($event) {
    if (!this.isShowEdit || !this.isOnEdit) return;
    if (!this.isMouseDown) return;

    var touch = $event.touches[0] || $event.changedTouches[0];
    var canvasPosition = this.canvas.getBoundingClientRect();
		var x = touch.clientX - canvasPosition.left;
    var y = touch.clientY - canvasPosition.top;
    this.drawOnCanvas({x: this.prevX, y: this.prevY}, {x: x, y: y});
    this.prevX = x;
    this.prevY = y;
  }
  drawOnCanvas(
    prevPos: { x: number, y: number }, 
    currentPos: { x: number, y: number }
  ) {
    let ctx = this.canvas.getContext('2d');
    // start our drawing path
    ctx.beginPath();
  
    // we're drawing lines so we need a previous position
    if (prevPos) {
      ctx.strokeStyle = "#FF0000";
      ctx.lineWidth = 3;
      // sets the start point
      ctx.moveTo(prevPos.x, prevPos.y); // from
      // draws a line from the start pos until the current position
      ctx.lineTo(currentPos.x, currentPos.y);
      // strokes the current path with the styles we set earlier
      ctx.stroke();
    }
  }

  editClick() {
    this.isOnEdit = !this.isOnEdit;
  }

  writeText() {
    this.isOnEdit = false;
    const prompt = this.alertCtrl.create({
      title: 'Title',
      message: "Enter the title of this photo",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.drawImage((img) => {
              this.drawText(data.title, img);
            }, (height) => {
              this.canvas.height = height;
            });
            
          }
        }
      ]
    });
    prompt.present();
  }


  onPhotoAccept() {
    if (!this.isSavedImg) {
      var blob = this.dataURItoBlob(this.canvas.toDataURL("image/jpeg"));
      this.global.image.image = blob;
    } else {
      this.global.image.image = null;
    }
    this.navCtrl.push(InputaddrPage);
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
    }

    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView.buffer], { type: mimeString });
    return blob;
}
}
