webpackJsonp([1],{

/***/ 171:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__inputaddr_inputaddr__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__provider_globalprovider__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_angular_navigation_nav_params__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__list_list__ = __webpack_require__(70);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, camera, alertCtrl, global, navParams, appRef) {
        this.navCtrl = navCtrl;
        this.camera = camera;
        this.alertCtrl = alertCtrl;
        this.global = global;
        this.navParams = navParams;
        this.appRef = appRef;
        this.isShowEdit = false;
        this.isCanCheck = false;
        this.isOnEdit = false;
        this.isMouseDown = false;
        this.isSavedImg = false;
        this.prevX = 0;
        this.prevY = 0;
        var item = navParams.get("item");
        if (item == undefined) {
            this.global.address = {};
            this.global.image = {};
        }
        else {
            this.global.address = item;
            this.global.image = {};
        }
    }
    HomePage.prototype.ngAfterViewInit = function () {
        this.canvas = this.imgCanvas.nativeElement;
        var ctx = this.canvas.getContext('2d');
        ctx.save();
        var item = this.navParams.get("item");
        if (item != undefined) {
            //Edit item
            this.myphoto = item.imagepath;
            this.isShowEdit = false;
            this.isCanCheck = true;
            this.isSavedImg = true;
            this.imagePath = this.myphoto;
        }
        else {
            this.photoTake();
        }
    };
    HomePage.prototype.photos = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_6__list_list__["a" /* ListPage */]);
    };
    HomePage.prototype.photoTake = function () {
        var _this = this;
        var options = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.myphoto = 'data:image/jpeg;base64,' + imageData;
            _this.isShowEdit = true;
            _this.isCanCheck = true;
            _this.isSavedImg = false;
            _this.appRef.tick();
            _this.drawImage(null, function (height) {
                _this.canvas.height = height;
            });
        }, function (err) {
            _this.navCtrl.pop();
        });
    };
    HomePage.prototype.drawImage = function (callback, resizeCallback) {
        var ctx = this.canvas.getContext('2d');
        ctx.restore();
        this.imagePath = this.myphoto;
        var img = new Image();
        img.src = this.myphoto;
        img.crossOrigin = "Anonymous"; //anonymous";  //https://firebasestorage.googleapis.com/";
        var canvas = this.canvas;
        img.onload = function () {
            if (resizeCallback != null)
                resizeCallback(canvas.width * img.height / img.width);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.width * img.height / img.width);
            if (callback != null)
                callback(img);
        };
    };
    HomePage.prototype.drawText = function (text, img) {
        var ctx = this.canvas.getContext('2d');
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(text, this.canvas.width / 2, this.canvas.width * img.height / img.width / 2);
    };
    HomePage.prototype.onMouseDown = function ($event) {
        if (!this.isShowEdit || !this.isOnEdit)
            return;
        this.isMouseDown = true;
        var touch = $event.touches[0] || $event.changedTouches[0];
        var canvasPosition = this.canvas.getBoundingClientRect();
        this.prevX = touch.clientX - canvasPosition.left;
        this.prevY = touch.clientY - canvasPosition.top;
    };
    HomePage.prototype.onMouseUp = function () {
        if (!this.isShowEdit || !this.isOnEdit)
            return;
        this.isMouseDown = false;
    };
    HomePage.prototype.onMouseMove = function ($event) {
        if (!this.isShowEdit || !this.isOnEdit)
            return;
        if (!this.isMouseDown)
            return;
        var touch = $event.touches[0] || $event.changedTouches[0];
        var canvasPosition = this.canvas.getBoundingClientRect();
        var x = touch.clientX - canvasPosition.left;
        var y = touch.clientY - canvasPosition.top;
        this.drawOnCanvas({ x: this.prevX, y: this.prevY }, { x: x, y: y });
        this.prevX = x;
        this.prevY = y;
    };
    HomePage.prototype.drawOnCanvas = function (prevPos, currentPos) {
        var ctx = this.canvas.getContext('2d');
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
    };
    HomePage.prototype.editClick = function () {
        this.isOnEdit = !this.isOnEdit;
    };
    HomePage.prototype.writeText = function () {
        var _this = this;
        this.isOnEdit = false;
        var prompt = this.alertCtrl.create({
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
                    handler: function (data) {
                    }
                },
                {
                    text: 'Save',
                    handler: function (data) {
                        _this.drawImage(function (img) {
                            _this.drawText(data.title, img);
                        }, function (height) {
                            _this.canvas.height = height;
                        });
                    }
                }
            ]
        });
        prompt.present();
    };
    HomePage.prototype.onPhotoAccept = function () {
        if (!this.isSavedImg) {
            var blob = this.dataURItoBlob(this.canvas.toDataURL("image/jpeg"));
            this.global.image.image = blob;
        }
        else {
            this.global.image.image = null;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__inputaddr_inputaddr__["a" /* InputaddrPage */]);
    };
    HomePage.prototype.dataURItoBlob = function (dataURI) {
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
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('imgCanvas'),
        __metadata("design:type", Object)
    ], HomePage.prototype, "imgCanvas", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])('size'),
        __metadata("design:type", Number)
    ], HomePage.prototype, "size", void 0);
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>Photo</ion-title>\n    <ion-buttons end>\n      <button ion-button (click)="writeText()" [ngClass]="{\'hide\' : !isShowEdit}">\n        <ion-icon name="logo-angular"></ion-icon>\n      </button>\n      <button ion-button (click)="editClick()" [ngClass]="{\'hide\' : !isShowEdit}">\n        <ion-icon name="create"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-item>\n    <p align="center">\n      <img src="{{ myphoto }}>" width="500px" [ngClass]="{\'hide\' : !isSavedImg}"/>\n      <canvas block #imgCanvas width="500px" height="500px" [ngClass]="{\'hide\' : isSavedImg}"\n          (touchstart)="onMouseDown($event)"\n          (touchend)="onMouseUp($event)"\n          (touchmove)="onMouseMove($event)"></canvas>\n    </p>\n  </ion-item>\n  <ion-buttons [ngClass]="{\'hide\' : !isCanCheck}" home-btn-group>\n    <button ion-button (click)="photoTake()" photo-take-btn>\n      <ion-icon name="camera"></ion-icon>\n    </button>\n    <button ion-button (click)="onPhotoAccept()" accept-btn>\n      <ion-icon name="checkmark"></ion-icon>\n    </button>\n  </ion-buttons>\n</ion-content>\n\n'/*ion-inline-end:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__provider_globalprovider__["a" /* GlobalProvider */],
            __WEBPACK_IMPORTED_MODULE_5_ionic_angular_navigation_nav_params__["a" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ApplicationRef */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 172:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Firebase__ = __webpack_require__(733);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_Firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__provider_globalprovider__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(387);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MapPage = /** @class */ (function () {
    function MapPage(navCtrl, navParams, platform, global, geolocation, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.platform = platform;
        this.global = global;
        this.geolocation = geolocation;
        this.alertCtrl = alertCtrl;
        this.markers = [];
        this.ref = __WEBPACK_IMPORTED_MODULE_2_Firebase__["database"]().ref('geolocations/');
        this.locationList = __WEBPACK_IMPORTED_MODULE_2_Firebase__["database"]().ref('state');
        this.locations = [];
        this.vicinities = [];
        platform.ready().then(function () {
            _this.getAllLocations().then(function (res) {
                _this.states = res;
                _this.initMap();
            });
        });
    }
    MapPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad MapPage');
    };
    MapPage.prototype.initMap = function () {
        var _this = this;
        var geoOptions = {
            timeout: 10000,
            enableHighAccuracy: true
        };
        this.geolocation.getCurrentPosition(geoOptions).then(function (position) {
            var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var options = { center: location, zoom: 17, mapTypeId: google.maps.MapTypeId.ROADMAP };
            _this.map = new google.maps.Map(_this.mapElement.nativeElement, options);
            var request = {
                location: location,
                rankby: 'distance',
                radius: '100'
                // types: ['vicinity']
            };
            var ref = _this;
            _this.service = new google.maps.places.PlacesService(_this.map).nearbySearch(request, function (results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        for (var j = i + 1; j < results.length; j++) {
                            if (results[i] != null
                                && results[j] != null
                                && results[i].vicinity.match(results[j].vicinity)) {
                                results[j] = null;
                            }
                        }
                    }
                    for (var k = 0; k < results.length; k++) {
                        if (results[k] == null)
                            continue;
                        ref.addMarkersToMap(results[k]);
                        ref.locations.push(results[k]);
                        ref.vicinities.push(results[k].vicinity);
                    }
                }
            });
        });
    };
    MapPage.prototype.onsetAddress = function () {
        var _this = this;
        alert(JSON.stringify(this.vicinities));
        var dialog = this.alertCtrl.create();
        dialog.present();
        dialog.setTitle('Choose the correct location');
        var isFound = false;
        for (var index in this.vicinities) {
            var location = this.vicinities[index];
            for (var key in this.states) {
                var state = this.states[key].stateAddress;
                if (location.indexOf(state) != -1) {
                    dialog.addInput({ type: 'radio', label: location, value: index });
                    isFound = true;
                    break;
                }
            }
            if (isFound)
                break;
        }
        if (!isFound) {
            dialog.setTitle("No locations in 1km around!");
        }
        dialog.addButton('Cancel');
        dialog.addButton({
            text: 'OK',
            handler: function (data) {
                dialog.dismiss();
                // alert(JSON.stringify(this.locations[data].geometry.location));
                // alert(JSON.stringify(this.locations[data].vicinity));
                var address = {};
                _this.getAddress(_this.locations[data].geometry.location).then(function (resp) {
                    address = resp;
                }).then(function () {
                    _this.setDetailAddress(_this.locations[data].geometry.location, address);
                });
            }
        });
    };
    MapPage.prototype.getAddress = function (latLng) {
        var geocoder = new google.maps.Geocoder();
        return new Promise(function (resolve, reject) {
            geocoder.geocode({ 'location': latLng }, function (results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        resolve(results[0]);
                    }
                    else {
                        reject('No results found');
                    }
                }
                else {
                    reject('Geocoder failed due to: ' + status);
                }
            });
        });
    };
    MapPage.prototype.setDetailAddress = function (latLng, address) {
        var getAddressWithType = function (address, type) {
            var newAddr = "";
            address.address_components.forEach(function (component) {
                if (component.types.indexOf(type) != -1)
                    newAddr = component.long_name;
            });
            return newAddr;
        };
        this.global.address.latitude = latLng.lat;
        this.global.address.longtitude = latLng.lng;
        this.global.address.zipcode = getAddressWithType(address, "postal_code");
        this.global.address.street = getAddressWithType(address, "street_number");
        this.global.address.state = getAddressWithType(address, "route");
        this.global.address.city = getAddressWithType(address, "locality");
        this.global.address.country = getAddressWithType(address, "country");
        this.navCtrl.pop();
    };
    MapPage.prototype.addMarkersToMap = function (place) {
        this.infoWindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: place.geometry.location
        });
        var ref = this;
        google.maps.event.addListener(marker, 'click', function () {
            ref.infoWindow.setContent(place.vicinity);
            ref.infoWindow.open(this.map, this);
        });
    };
    MapPage.prototype.getAllLocations = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.locationList.on('value', function (snapshot) {
                var Catdata = snapshot.val();
                var temparr = [];
                for (var key in Catdata) {
                    var state = Catdata[key];
                    if (String(state.staff).toLowerCase().match(String(_this.global.current_user.email).toLowerCase())) {
                        temparr.push({
                            key: key,
                            stateAddress: state.stateAddress,
                            staff: state.staff
                        });
                    }
                }
                resolve(temparr);
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('map'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], MapPage.prototype, "mapElement", void 0);
    MapPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-map',template:/*ion-inline-start:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\map\map.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>map</ion-title>\n    <ion-buttons end>\n      <button ion-button (click)="onsetAddress()" style="color:white;">\n        <ion-icon name="checkmark-circle-outline"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content padding>\n    <div #map id="map"></div>\n</ion-content>\n'/*ion-inline-end:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\map\map.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_3__provider_globalprovider__["a" /* GlobalProvider */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], MapPage);
    return MapPage;
}());

//# sourceMappingURL=map.js.map

/***/ }),

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__register_register__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__list_list__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_google_plus__ = __webpack_require__(174);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_native_storage__ = __webpack_require__(391);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_facebook__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__provider_globalprovider__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__manage_addresses_manage_addresses__ = __webpack_require__(96);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};












var LoginPage = /** @class */ (function () {
    function LoginPage(afAuth, toast, navCtrl, loadingCtrl, navParams, global, platform, googlePlus, nativeStorage, fb) {
        var _this = this;
        this.afAuth = afAuth;
        this.toast = toast;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.global = global;
        this.platform = platform;
        this.googlePlus = googlePlus;
        this.nativeStorage = nativeStorage;
        this.fb = fb;
        this.splash = true;
        this.user = {
            name: '',
            picture: '',
            email: '',
            password: '',
            from: ''
        };
        this.google = {
            name: '',
            profilePicture: '',
            email: ''
        };
        this.FB_APP_ID = 229144901207708;
        this.loggedin = false;
        this.splash = navParams.get('splash');
        if (this.splash == undefined) {
            this.splash = true;
        }
        this.imgHeight = "35%";
        platform.ready().then(function (readySource) {
            _this.imgHeight = platform.height() * 0.35 + "px";
        });
        // this.fb.browserInit(this.FB_APP_ID, "v2.8");
    }
    LoginPage.prototype.ngAfterViewInit = function () {
    };
    LoginPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        setTimeout(function () { return _this.splash = false; }, 4000);
    };
    LoginPage.prototype.login = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
                    .then(function (data) {
                    _this.global.current_user = {
                        email: data.user.email,
                        password: user.password,
                        name: data.user.displayName,
                        picture: data.user.photoURL
                    };
                    _this.loggedin = true;
                    if (_this.global.current_user.email.match("support@snowlimitless.com")) {
                        _this.global.isSupport = true;
                        _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_10__manage_addresses_manage_addresses__["a" /* ManageAddressesPage */]);
                    }
                    else {
                        _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__list_list__["a" /* ListPage */]);
                    }
                })
                    .catch(function (error) {
                    alert(error);
                    _this.toast.create({
                        message: 'Could not find authentication details.',
                        duration: 5000,
                        showCloseButton: false,
                        dismissOnPageChange: true,
                        cssClass: "toast-failed.scss",
                    }).present();
                });
                return [2 /*return*/];
            });
        });
    };
    LoginPage.prototype.signUp = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__register_register__["a" /* RegisterPage */]);
    };
    LoginPage.prototype.googleLogin = function () {
        var env = this;
        var nav = this.navCtrl;
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.googlePlus.login({
            'scopes': '',
            'webClientId': '402830098374-t0grsirtjuot1sluav5p8ofq52u313ht.apps.googleusercontent.com',
            'offline': true,
            'prompt': 'select_account'
        })
            .then(function (user) {
            loading.dismiss();
            env.loggedin = true;
            var googleCredential = __WEBPACK_IMPORTED_MODULE_4_firebase__["auth"].GoogleAuthProvider.credential(user.idToken);
            __WEBPACK_IMPORTED_MODULE_4_firebase__["auth"]().signInWithCredential(googleCredential).then(function (response) {
                console.log(response);
            });
            env.global.current_user = {
                email: user.email,
                password: "",
                name: user.displayName,
                picture: user.imageUrl
            };
            nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__list_list__["a" /* ListPage */]);
        }, function (error) {
            alert(error);
            loading.dismiss();
        });
    };
    LoginPage.prototype.facebookLogin = function () {
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        var permissions = new Array();
        var nav = this.navCtrl;
        var env = this;
        permissions = ["public_profile"];
        this.fb.login(permissions)
            .then(function (response) {
            loading.dismiss();
            var userId = response.authResponse.userID;
            var params = new Array();
            env.fb.api("/me?fields=name,gender", params)
                .then(function (user) {
                env.loggedin = true;
                user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
                env.global.current_user = {
                    email: user.email,
                    password: "",
                    name: user.name,
                    picture: user.picture
                };
                nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__list_list__["a" /* ListPage */]);
            });
        }, function (error) {
            loading.dismiss();
            alert(error);
        });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\login\login.html"*/'<div id="custom-overlay" [style.display]="splash ? \'flex\' : \'none\'">\n  <div class="flb">\n    <div class="Aligner-itm Aligner-item-top"></div>\n    <img src="assets/imgs/logo.png">\n    <div class="Aligner-itm Aligner-item-bottom"></div>\n  </div>\n</div>\n\n<ion-content padding style="background-image:url(assets/imgs/back2.png);background-size:cover; height: 100%">\n  <ion-item [ngStyle]="{\'background\': \'transparent\', \'height\': imgHeight}">\n      <img src="assets/imgs/logo2.png">\n  </ion-item>\n  <ion-item style="background: rgba(255, 255, 255, 0.6);color: black;">\n    <ion-icon name="mail" item-left primary class="icon" style="color:#0b9444;"></ion-icon>\n    <ion-input type="text" [(ngModel)]="user.email" placeholder="Email"></ion-input>\n  </ion-item>\n\n  <ion-item style="margin-top:15px;background: rgba(255, 255, 255, 0.6);color: black;">\n    <ion-icon name="lock" item-left primary class="icon" style="color:#0b9444;"></ion-icon>\n    <ion-input type="password" [(ngModel)]="user.password" placeholder="Password"></ion-input>\n  </ion-item>\n\n  <div>\n    <button ion-button (click)="login(user)" style="width:100%;margin:auto;margin-top:15px;background-color:#47bff4;height:45px;">Login</button>\n    <button ion-button (click)="signUp()" style="margin:auto;margin-top:10px;margin-bottom:15px;width:100%;height:45px;"color="secondary">Sign Up</button>\n  </div>\n\n  <div style="text-align:center;margin:auto;">\n    <a style="color:white;font-size:25px;">Forgot password?</a>\n  </div>\n\n  <div>\n    <button ion-button color="secondary" icon-right (click)="googleLogin()" style="background:#ff3131;margin:auto;margin-top:15px;margin-bottom:15px;width:100%;height:45px;">\n      <ion-icon name="logo-googleplus" style="color:white;padding-right:7px;"></ion-icon>Login via Google\n    </button>\n    <button ion-button icon-right (click)="facebookLogin()" style="background:#2473ff;margin:auto;width:100%;height:45px;">\n      <ion-icon name="logo-facebook" style="color:white;padding-right:7px;"></ion-icon>Login via Facebook\n    </button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_9__provider_globalprovider__["a" /* GlobalProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_google_plus__["a" /* GooglePlus */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_native_storage__["a" /* NativeStorage */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_facebook__["a" /* Facebook */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 186:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 186;

/***/ }),

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/manage-addresses/manage-addresses.module": [
		739,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 231;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlobalProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var GlobalProvider = /** @class */ (function () {
    function GlobalProvider() {
        this.address = {};
        this.state = {};
    }
    GlobalProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
    ], GlobalProvider);
    return GlobalProvider;
}());

//# sourceMappingURL=globalprovider.js.map

/***/ }),

/***/ 386:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InputaddrPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_map__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__provider_globalprovider__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_common_http__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_http__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_address_service__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__list_list__ = __webpack_require__(70);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var InputaddrPage = /** @class */ (function () {
    function InputaddrPage(navCtrl, alertCtrl, global, addrListService, http, jsonp) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.global = global;
        this.addrListService = addrListService;
        this.http = http;
        this.jsonp = jsonp;
        this.addr = {};
    }
    InputaddrPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        var address = this.global.address;
        if (address.country == ""
            || address.country == undefined)
            return;
        this.addr = address;
        this.isMapSelected = true;
        var headers = new __WEBPACK_IMPORTED_MODULE_6__angular_common_http__["c" /* HttpHeaders */]();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('Accept', 'application/json');
        headers.append('content-type', 'application/json');
        var proxy = 'https://cors-anywhere.herokuapp.com/';
        var url = 'https://api.darksky.net/forecast/22529da26a830db484b9941df203cc1c/' + address.latitude + ',' + address.longtitude + '?units=si';
        this.http.get(proxy + url, { headers: headers }).subscribe(function (data) {
            _this.addr.weather = data["currently"]["temperature"] + "°C, " + data["currently"]["summary"];
        });
    };
    InputaddrPage.prototype.onUsingMap = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__map_map__["a" /* MapPage */]);
    };
    InputaddrPage.prototype.onAcceptAddress = function () {
        var _this = this;
        if (this.global.image.image == null) {
            //Use original image.
            this.addrListService.updateAddress(this.global.address).then(function (ref) {
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_9__list_list__["a" /* ListPage */]);
            });
        }
        else {
            if (this.global.address.key) {
                //Delete Original Image
                try {
                    this.addrListService
                        .deleteImage(this.global.address.imagepath)
                        .subscribe(function () { });
                }
                catch (e) { }
            }
            //Upload new image
            var upload_1 = this.addrListService.addImage(this.global.image.image);
            upload_1.then().then(function (ref) {
                upload_1.task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    _this.global.address.imagepath = downloadURL;
                    _this.global.address.user_info = _this.global.current_user.email;
                    if (_this.global.address.key)
                        _this.addrListService.updateAddress(_this.global.address).then(function (ref) {
                            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_9__list_list__["a" /* ListPage */]);
                        });
                    else {
                        _this.addrListService.addAddress(_this.global.address).then(function (ref) {
                            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_9__list_list__["a" /* ListPage */]);
                        });
                    }
                });
            });
        }
    };
    InputaddrPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-inputaddr',template:/*ion-inline-start:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\inputaddr\inputaddr.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="arrow-back"></ion-icon>\n    </button>\n    <ion-title>Input Information</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <button ion-button (click)="onUsingMap()" input-addr-top-btn>\n      <ion-icon name="globe" style="font-size:18px; padding-right:10px;"></ion-icon>Using Map</button>\n    <button ion-button (click)="onAcceptAddress()" input-addr-top-btn>\n      <ion-icon name="checkmark-circle-outline" style="font-size:18px; padding-right:10px;"></ion-icon>Accept</button>\n    <ion-list>\n      <ion-item>\n        <ion-label fixed>Street</ion-label>\n        <ion-input type="text" [(ngModel)]="addr.street" value=""></ion-input>\n      </ion-item>\n\n      <ion-item>\n          <ion-label fixed>State</ion-label>\n          <ion-input type="text" [(ngModel)]="addr.state" value="" readonly></ion-input>\n      </ion-item>\n\n      <ion-item>\n          <ion-label fixed>City</ion-label>\n          <ion-input type="text" [(ngModel)]="addr.city" value="" readonly></ion-input>\n      </ion-item>\n\n      <ion-item>\n          <ion-label fixed>Country</ion-label>\n          <ion-input type="text" [(ngModel)]="addr.country" value="" readonly></ion-input>\n      </ion-item>\n\n      <ion-item>\n          <ion-label fixed>Zipcode</ion-label>\n          <ion-input type="text" [(ngModel)]="addr.zipcode" value="" readonly></ion-input>\n      </ion-item>\n\n      <ion-item>\n        <ion-label fixed>Weather</ion-label>\n        <ion-input type="text" [(ngModel)]="addr.weather" value="" readonly></ion-input>\n      </ion-item>\n      \n      <ion-item>\n          <ion-label fixed>Tag</ion-label>\n          <ion-input type="text" [(ngModel)]="addr.tag" value=""></ion-input>\n      </ion-item>\n    \n    </ion-list>    \n</ion-content>\n'/*ion-inline-end:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\inputaddr\inputaddr.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__provider_globalprovider__["a" /* GlobalProvider */],
            __WEBPACK_IMPORTED_MODULE_8__services_address_service__["a" /* AddressService */],
            __WEBPACK_IMPORTED_MODULE_6__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_7__angular_http__["a" /* Jsonp */]])
    ], InputaddrPage);
    return InputaddrPage;
}());

//# sourceMappingURL=inputaddr.js.map

/***/ }),

/***/ 389:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(173);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var RegisterPage = /** @class */ (function () {
    function RegisterPage(afAuth, navCtrl, navParams, formBuilder, toast) {
        this.afAuth = afAuth;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.toast = toast;
        this.user = {};
        this.registerForm = formBuilder.group({
            email: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["b" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["g" /* Validators */].compose([
                __WEBPACK_IMPORTED_MODULE_3__angular_forms__["g" /* Validators */].required,
                __WEBPACK_IMPORTED_MODULE_3__angular_forms__["g" /* Validators */].pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            password: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["b" /* FormControl */]('', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["g" /* Validators */].compose([
                __WEBPACK_IMPORTED_MODULE_3__angular_forms__["g" /* Validators */].required,
                __WEBPACK_IMPORTED_MODULE_3__angular_forms__["g" /* Validators */].minLength(7)
            ]))
        });
        this.email = this.registerForm.controls['email'];
        this.password = this.registerForm.controls['password'];
    }
    RegisterPage.prototype.register = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                alert(JSON.stringify(user));
                this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
                    .then(function (data) {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */], { splash: false });
                })
                    .catch(function (error) {
                    alert(JSON.stringify(error));
                    _this.toast.create({
                        message: 'Could not find authentication details.',
                        duration: 3000,
                        cssClass: "toast-failed.scss",
                    }).present();
                });
                return [2 /*return*/];
            });
        });
    };
    RegisterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register',template:/*ion-inline-start:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\register\register.html"*/'<ion-content padding style="background-image:url(assets/imgs/back2.png);background-size:cover;">\n  <ion-card style="background:transparent;-webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.0);box-shadow: 0 1px 2px rgba(0, 0, 0, 0.0);margin-top: 30%;">\n    <img src="assets/imgs/logo.png">\n  </ion-card>\n  <form [formGroup]="registerForm" style="position:relative;margin-top:25%;">\n    <ion-item style="background-color:rgba(255,255,255,0.6);color:black;">\n      <ion-icon name="mail" item-left primary class="icon" style="color:#0b9444;"></ion-icon>\n      <ion-input formControlName="email" type="email" [(ngModel)]="user.email" placeholder="Email" required></ion-input>\n    </ion-item>\n    <span *ngIf="email.errors" style="color:red;margin-top:-30px;">\n      <span *ngIf="email.hasError(required) && email.touched">\n        <ion-label class="email_error"> Email is required </ion-label>\n      </span>\n      <span *ngIf="email.errors.pattern">\n        <ion-label class="email_error"> Please enter a valid email </ion-label>\n      </span>\n    </span>\n    <ion-item style="margin-top:10px;background-color:rgba(255,255,255,0.6);color:black;">\n      <ion-icon name="lock" item-left primary class="icon" style="color:#0b9444;"></ion-icon>\n      <ion-input type="password" formControlName="password" [(ngModel)]="user.password" placeholder="Password" required></ion-input>\n    </ion-item>\n    <span *ngIf="password.hasError(\'required\') && password.touched">\n      <ion-label style="color:red;margin-top:-30px;position:absolute;right:0;display:table;"> Password is required</ion-label>\n    </span>\n    <button ion-button (click)="register(user)" [disabled]="!registerForm.valid" style="margin-top:15px;margin-bottom:5px;width:100%;" color="secondary">Sign Up</button>\n  </form>\n</ion-content>\n  \n'/*ion-inline-end:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\register\register.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */]])
    ], RegisterPage);
    return RegisterPage;
}());

//# sourceMappingURL=register.js.map

/***/ }),

/***/ 392:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__provider_globalprovider__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SettingPage = /** @class */ (function () {
    function SettingPage(navCtrl, global, navParams) {
        this.navCtrl = navCtrl;
        this.global = global;
        this.navParams = navParams;
        this.user = global.current_user;
        if (global.current_user.name == null) {
            this.user.name = "to Limitless Snow Removal";
            this.user.picture = "assets/imgs/logo.png";
        }
    }
    SettingPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SettingPage');
    };
    SettingPage.prototype.ionViewCanEnter = function () {
    };
    SettingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-setting',template:/*ion-inline-start:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\setting\setting.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu" style="color:white;"></ion-icon>\n    </button>\n    <ion-title>Setting</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content padding>\n  <ion-card>\n    <img [src]="user.picture"/>\n    <ion-card-content>\n      <ion-card-title>\n        Welcome {{user.name}}!\n        </ion-card-title>\n      <p>\n        Your email is: {{user.email}}\n      </p>\n    </ion-card-content>\n  </ion-card>\n</ion-content>\n'/*ion-inline-end:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\setting\setting.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__provider_globalprovider__["a" /* GlobalProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */]])
    ], SettingPage);
    return SettingPage;
}());

//# sourceMappingURL=setting.js.map

/***/ }),

/***/ 393:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(398);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 398:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(732);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_home_home__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_login_login__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_register_register__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_map_map__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_setting_setting__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_inputaddr_inputaddr__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_list_list__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_manage_addresses_manage_addresses__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_angularfire2__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_angularfire2_database__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_angularfire2_storage__ = __webpack_require__(335);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_angularfire2_auth__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__app_firebase_config__ = __webpack_require__(737);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_native_geolocation__ = __webpack_require__(387);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_native_device__ = __webpack_require__(738);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_camera__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__provider_globalprovider__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__services_address_service__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ionic_native_speech_recognition__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__angular_common_http__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ionic_native_facebook__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ionic_native_google_plus__ = __webpack_require__(174);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ionic_native_native_storage__ = __webpack_require__(391);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






























var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_13__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_map_map__["a" /* MapPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_setting_setting__["a" /* SettingPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_inputaddr_inputaddr__["a" /* InputaddrPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_manage_addresses_manage_addresses__["a" /* ManageAddressesPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* JsonpModule */],
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/manage-addresses/manage-addresses.module#ManageAddressesPageModule', name: 'ManageAddressesPage', segment: 'manage-addresses', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_15_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_19__app_firebase_config__["a" /* FIREBASE_CONFIG */]),
                __WEBPACK_IMPORTED_MODULE_18_angularfire2_auth__["b" /* AngularFireAuthModule */],
                __WEBPACK_IMPORTED_MODULE_16_angularfire2_database__["b" /* AngularFireDatabaseModule */],
                __WEBPACK_IMPORTED_MODULE_17_angularfire2_storage__["b" /* AngularFireStorageModule */],
                __WEBPACK_IMPORTED_MODULE_26__angular_common_http__["b" /* HttpClientModule */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_13__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_map_map__["a" /* MapPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_setting_setting__["a" /* SettingPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_inputaddr_inputaddr__["a" /* InputaddrPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_manage_addresses_manage_addresses__["a" /* ManageAddressesPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_22__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_20__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_21__ionic_native_device__["a" /* Device */],
                __WEBPACK_IMPORTED_MODULE_25__ionic_native_speech_recognition__["a" /* SpeechRecognition */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_23__provider_globalprovider__["a" /* GlobalProvider */],
                __WEBPACK_IMPORTED_MODULE_24__services_address_service__["a" /* AddressService */],
                __WEBPACK_IMPORTED_MODULE_27__ionic_native_facebook__["a" /* Facebook */],
                __WEBPACK_IMPORTED_MODULE_28__ionic_native_google_plus__["a" /* GooglePlus */],
                __WEBPACK_IMPORTED_MODULE_29__ionic_native_native_storage__["a" /* NativeStorage */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__provider_globalprovider__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_address_service__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__home_home__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_speech_recognition__ = __webpack_require__(148);
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var ListPage = /** @class */ (function () {
    function ListPage(navCtrl, appRef, global, addrListService, speechRecognition, plt, cd, alertCtrl, toast) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.appRef = appRef;
        this.global = global;
        this.addrListService = addrListService;
        this.speechRecognition = speechRecognition;
        this.plt = plt;
        this.cd = cd;
        this.alertCtrl = alertCtrl;
        this.toast = toast;
        this.isRecording = false;
        this.filtered = false;
        this.addrList = __WEBPACK_IMPORTED_MODULE_4_firebase___default.a.database().ref('address');
        this.is_speech = false;
        this.count = 0;
        this.isPressTrash = false;
        this.items = [];
        this.filters = [];
        this.getAllCatList().then(function (res) {
            _this.items = res;
            _this.filters = res;
            _this.appRef.tick();
        });
    }
    ListPage.prototype.ngAfterViewInit = function () {
        this.global.isShowMenu = true;
    };
    ListPage.prototype.isIos = function () {
        return this.plt.is('ios');
    };
    ListPage.prototype.stopListening = function () {
        var _this = this;
        this.speechRecognition.stopListening().then(function () {
            _this.isRecording = false;
        });
    };
    ListPage.prototype.getPermission = function () {
        var _this = this;
        this.speechRecognition.hasPermission()
            .then(function (hasPermission) {
            if (!hasPermission) {
                _this.speechRecognition.requestPermission();
            }
        });
    };
    ListPage.prototype.startListening = function () {
        var _this = this;
        var prompt = this.alertCtrl.create({
            title: 'Search',
            message: "Enter the name of city or country",
            inputs: [
                {
                    name: 'search',
                    placeholder: 'search'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                    }
                },
                {
                    text: 'Search',
                    handler: function (data) {
                        _this.filters = [];
                        _this.items.forEach(function (e) {
                            if (String(e.address.city).toLowerCase() == String(data.search).toLowerCase() ||
                                String(e.address.country).toLowerCase() == String(data.search).toLowerCase() ||
                                String(e.address.tag).toLowerCase() == String(data.search).toLowerCase()) {
                                this.filters.push(e);
                                return;
                            }
                        }, _this);
                        _this.cd.detectChanges();
                    }
                }
            ]
        });
        if (this.plt.is('android') && Number(this.plt.version().str) >= 7.1) {
            if (this.count != 1) {
                this.is_speech = true;
                this.toast.create({
                    message: "Your phone is android v7.1.1 +. Currently released Ionic frameworks support android v7.1.0 in maximum. And the speech recognition plugin works under android v7.0.0.",
                    duration: 5000,
                    showCloseButton: false,
                    dismissOnPageChange: true,
                    cssClass: "toast-failed.scss",
                }).present();
                this.count = 1;
                setTimeout(function () { return prompt.present(); }, 5000);
            }
            else if (this.count == 1) {
                prompt.present();
            }
        }
        else {
            var options = {
                language: 'en-US'
            };
            this.speechRecognition.startListening(options).subscribe(function (matches) {
                _this.matches = matches;
                _this.filters = [];
                _this.items.forEach(function (e) {
                    for (var item in e.address) {
                        for (var m_item in matches) {
                            if (String(e.address[item]).toLowerCase() == String(matches[m_item]).toLowerCase()) {
                                this.filters.push(e);
                                return;
                            }
                        }
                    }
                }, _this);
                _this.cd.detectChanges();
            });
            this.isRecording = true;
        }
    };
    ListPage.prototype.ShowOriginal = function () {
        this.filters = this.items;
        this.appRef.tick();
    };
    ListPage.prototype.getAllCatList = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.addrList.on('value', function (snapshot) {
                var Catdata = snapshot.val();
                var temparr = [];
                for (var key in Catdata) {
                    var address = Catdata[key];
                    if (address.user_info == _this.global.current_user.email) {
                        temparr.push({
                            title: address.city + ", " + address.country,
                            note: address.street + ", " + address.city + ", " + address.country,
                            imagepath: address.imagepath,
                            address: __assign({ key: key }, address),
                            show: true
                        });
                    }
                    resolve(temparr);
                }
            });
        });
    };
    ListPage.prototype.itemTapped = function (event, item) {
        // That's right, we're pushing to ourselves!
        if (this.isPressTrash) {
            this.isPressTrash = false;
            return;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__home_home__["a" /* HomePage */], {
            item: item.address
        });
    };
    ListPage.prototype.onTrash = function (event, item) {
        this.isPressTrash = true;
        //Delete Original Image
        try {
            this.addrListService
                .deleteImage(item.address.imagepath)
                .subscribe(function () { });
        }
        catch (e) { }
        this.addrListService.removeAddress(item.address);
        for (var index in this.items) {
            if (this.items[index].address.key == item.address.key) {
                this.items.splice(index, 1);
                return;
            }
        }
        for (var inc in this.filters) {
            if (this.filters[inc].address.key == item.address.key) {
                this.filters.splice(inc, 1);
                return;
            }
        }
        this.appRef.tick();
        event.preventDefault();
        return false;
    };
    ListPage.prototype.onAddItem = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__home_home__["a" /* HomePage */]);
    };
    ListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-list',template:/*ion-inline-start:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\list\list.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu" style="color:white;"></ion-icon>\n    </button>\n    <ion-title>Photo library</ion-title>\n    <ion-buttons end>\n      <button ion-button (click)="onAddItem()" style="color:white;">\n        <ion-icon name="add"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <button ion-button (click)="startListening()" list-top-btn>\n    <ion-icon name="mic" style="font-size:18px; padding-right:10px;"></ion-icon>Search\n  </button>\n\n  <button ion-button (click)="stopListening()" list-top-btn *ngIf="isIos()">\n    <ion-icon name="mic-off" style="font-size:18px;padding-right:10px;"></ion-icon>Stop\n  </button>\n\n  <button ion-button (click)="ShowOriginal()" list-top-btn item-right>\n    <ion-icon name="arrow-round-back" style="font-size:18px;padding-right:10px;"></ion-icon>Back\n  </button>\n  \n  <ion-list >\n    <ion-item value=[item] *ngFor="let item of filters" \n              (click)="itemTapped($event, item)">\n      <ion-thumbnail item-start>\n        <img src="{{ item.imagepath }}">\n      </ion-thumbnail>\n      <h2>{{item.title}}</h2>\n      <p>{{item.note}}</p>\n      <ion-buttons end item-right btn-trash>\n        <button ion-button clear (click)="onTrash($event, item)">\n          <ion-icon name="trash" item-right></ion-icon>\n        </button>\n      </ion-buttons>\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\list\list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ApplicationRef */],
            __WEBPACK_IMPORTED_MODULE_2__provider_globalprovider__["a" /* GlobalProvider */],
            __WEBPACK_IMPORTED_MODULE_3__services_address_service__["a" /* AddressService */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_speech_recognition__["a" /* SpeechRecognition */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* ChangeDetectorRef */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */]])
    ], ListPage);
    return ListPage;
}());

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 732:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_login_login__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_map_map__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_setting_setting__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_list_list__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_google_plus__ = __webpack_require__(174);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__provider_globalprovider__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_manage_addresses_manage_addresses__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angularfire2_auth__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_facebook__ = __webpack_require__(175);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var MyApp = /** @class */ (function () {
    function MyApp(afAuth, platform, statusBar, splashScreen, global, googlePlus, fb) {
        this.afAuth = afAuth;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.global = global;
        this.googlePlus = googlePlus;
        this.fb = fb;
        this.initializeApp();
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.googlePlus.trySilentLogin({
                'webClientId': '402830098374-t0grsirtjuot1sluav5p8ofq52u313ht.apps.googleusercontent.com'
            })
                .then(function (data) {
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_8__pages_list_list__["a" /* ListPage */];
                _this.splashScreen.hide();
            }, function (error) {
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */];
                _this.splashScreen.hide();
            });
            _this.statusBar.styleDefault();
        });
    };
    MyApp.prototype.goToList = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_8__pages_list_list__["a" /* ListPage */]);
    };
    MyApp.prototype.goToHome = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */]);
    };
    MyApp.prototype.goToMap = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_6__pages_map_map__["a" /* MapPage */]);
    };
    MyApp.prototype.goToSetting = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_setting_setting__["a" /* SettingPage */]);
    };
    MyApp.prototype.goToService = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_11__pages_manage_addresses_manage_addresses__["a" /* ManageAddressesPage */]);
    };
    MyApp.prototype.logout = function () {
        var _this = this;
        this.afAuth.auth.signOut();
        this.googlePlus.logout().then(function () {
            _this.googlePlus.disconnect();
        });
        this.fb.getLoginStatus().then(function (data) {
            if (data.status == 'connected') {
                _this.fb.logout();
            }
        });
        this.global.current_user = {
            email: '',
            password: '',
            name: '',
            picture: ''
        };
        setTimeout(function () {
            _this.global.isShowMenu = false;
            _this.global.isSupport = false;
            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */], { splash: false });
        }, 500);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\app\app.html"*/'<ion-menu [content]="content" *ngIf="this.global.isShowMenu">\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>MENU</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n      <ion-item >\n          <img src="assets/imgs/logo.png" style="margin-top:15px;padding-right:15px;height:70px;">\n      </ion-item>\n      <button ion-item menuClose (click)="goToList()" *ngIf="!this.global.isSupport">\n        <ion-icon name="images" item-start style="color:#0b9444;"></ion-icon>\n          Photo Library\n      </button>\n      <button ion-item menuClose (click)="goToService()" *ngIf="this.global.isSupport">\n          <ion-icon name="cog" item-start style="color:#0b9444;"></ion-icon>\n            Manage Services\n      </button>\n      <button ion-item menuClose (click)="goToSetting()">\n        <ion-icon name="settings" item-start style="color:#0b9444;"></ion-icon>\n          Setting\n      </button>\n      \n    </ion-list>\n    <ion-footer>\n      <button (click)="logout()" ion-item menuClose>\n        <ion-icon name="log-out" color="danger" item-start></ion-icon>\n          <span style="color:red;">Logout</span> \n      </button>\n    </ion-footer>\n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>'/*ion-inline-end:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_12_angularfire2_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_10__provider_globalprovider__["a" /* GlobalProvider */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_google_plus__["a" /* GooglePlus */],
            __WEBPACK_IMPORTED_MODULE_13__ionic_native_facebook__["a" /* Facebook */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 737:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FIREBASE_CONFIG; });
var FIREBASE_CONFIG = {
    apiKey: "AIzaSyBRPMvBrF04ilIhgXwTqDxnUkZGJZu5xHA",
    authDomain: "limitlesssnowremoval-208512.firebaseapp.com",
    databaseURL: "https://limitlesssnowremoval-208512.firebaseio.com",
    projectId: "limitlesssnowremoval-208512",
    storageBucket: "limitlesssnowremoval-208512.appspot.com",
    messagingSenderId: "402830098374"
};
//# sourceMappingURL=app.firebase.config.js.map

/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddressService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_storage__ = __webpack_require__(335);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__provider_globalprovider__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AddressService = /** @class */ (function () {
    function AddressService(db, afStorage, global) {
        this.db = db;
        this.afStorage = afStorage;
        this.global = global;
        this.addressListRef = this.db.list('address');
        this.addressStateRef = this.db.list('state');
    }
    AddressService.prototype.getAddressList = function () {
        return this.addressListRef;
    };
    AddressService.prototype.getAddressState = function () {
        return this.addressStateRef;
    };
    AddressService.prototype.addAddress = function (address) {
        return this.addressListRef.push(address);
    };
    AddressService.prototype.addState = function (state) {
        return this.addressStateRef.push(state);
    };
    AddressService.prototype.updateAddress = function (address) {
        return this.addressListRef.update(address.key, address);
    };
    AddressService.prototype.updateState = function (state) {
        return this.addressStateRef.update(state.key, state);
    };
    AddressService.prototype.removeAddress = function (address) {
        return this.addressListRef.remove(address.key);
    };
    AddressService.prototype.removeState = function (state) {
        return this.addressStateRef.remove(state.key);
    };
    AddressService.prototype.addImage = function (image) {
        var imgName = "files/" + new Date().getTime() + ".png";
        return this.afStorage.ref(imgName).put(image);
    };
    AddressService.prototype.deleteImage = function (orgImgName) {
        var pathStart = orgImgName.indexOf("files%2F");
        var pathEnd = orgImgName.indexOf(".png") + 4;
        var path = orgImgName.substring(pathStart, pathEnd);
        path = path.replace("%2F", "/");
        return this.afStorage.ref(path).delete();
    };
    AddressService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */], __WEBPACK_IMPORTED_MODULE_2_angularfire2_storage__["a" /* AngularFireStorage */], __WEBPACK_IMPORTED_MODULE_3__provider_globalprovider__["a" /* GlobalProvider */]])
    ], AddressService);
    return AddressService;
}());

//# sourceMappingURL=address.service.js.map

/***/ }),

/***/ 96:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ManageAddressesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__provider_globalprovider__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_address_service__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_speech_recognition__ = __webpack_require__(148);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ManageAddressesPage = /** @class */ (function () {
    function ManageAddressesPage(navCtrl, navParams, plt, global, appRef, addrListService, speechRecognition, cd, alertCtrl, toast) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.plt = plt;
        this.global = global;
        this.appRef = appRef;
        this.addrListService = addrListService;
        this.speechRecognition = speechRecognition;
        this.cd = cd;
        this.alertCtrl = alertCtrl;
        this.toast = toast;
        this.isRecording = false;
        this.filtered = false;
        this.addrList = __WEBPACK_IMPORTED_MODULE_4_firebase___default.a.database().ref('state');
        this.is_speech = false;
        this.count = 0;
        this.isPressTrash = false;
        this.state = {};
        this.items = [];
        this.filters = [];
        this.getAllCatList().then(function (res) {
            _this.items = res;
            _this.filters = res;
            _this.appRef.tick();
        });
    }
    ManageAddressesPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ManageAddressesPage');
    };
    ManageAddressesPage.prototype.ngAfterViewInit = function () {
        this.global.isShowMenu = true;
        this.global.isSupport = true;
    };
    ManageAddressesPage.prototype.isIos = function () {
        return this.plt.is('ios');
    };
    ManageAddressesPage.prototype.stopListening = function () {
        var _this = this;
        this.speechRecognition.stopListening().then(function () {
            _this.isRecording = false;
        });
    };
    ManageAddressesPage.prototype.getPermission = function () {
        var _this = this;
        this.speechRecognition.hasPermission()
            .then(function (hasPermission) {
            if (!hasPermission) {
                _this.speechRecognition.requestPermission();
            }
        });
    };
    ManageAddressesPage.prototype.startListening = function () {
        var _this = this;
        var prompt = this.alertCtrl.create({
            title: 'Search',
            message: "Enter the name of city or country",
            inputs: [
                {
                    name: 'search',
                    placeholder: 'search'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                    }
                },
                {
                    text: 'Search',
                    handler: function (data) {
                        _this.filters = [];
                        _this.items.forEach(function (e) {
                            if (String(e.stateAddress).includes(String(data.search))) {
                                this.filters.push(e);
                                return;
                            }
                        }, _this);
                        _this.cd.detectChanges();
                    }
                }
            ]
        });
        if (this.plt.is('android') && Number(this.plt.version().str) >= 7.1) {
            if (this.count != 1) {
                this.is_speech = true;
                this.toast.create({
                    message: "Your phone is android v7.1.1 +. Currently released Ionic frameworks support android v7.1.0 in maximum. And the speech recognition plugin works under android v7.0.0.",
                    duration: 7000,
                    showCloseButton: false,
                    dismissOnPageChange: true,
                    cssClass: "toast-failed.scss",
                }).present();
                this.count = 1;
                setTimeout(function () { return prompt.present(); }, 7000);
            }
            else if (this.count == 1) {
                prompt.present();
            }
        }
        else {
            var options = {
                language: 'en-US'
            };
            this.speechRecognition.startListening(options).subscribe(function (matches) {
                _this.matches = matches;
                _this.filters = [];
                _this.items.forEach(function (e) {
                    for (var m_item in matches) {
                        if (String(e.stateAddress).toLowerCase().includes(String(matches[m_item]).toLowerCase())) {
                            this.filters.push(e);
                            return;
                        }
                    }
                }, _this);
                _this.cd.detectChanges();
            });
            this.isRecording = true;
        }
    };
    ManageAddressesPage.prototype.getAllCatList = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.addrList.on('value', function (snapshot) {
                var Catdata = snapshot.val();
                var temparr = [];
                for (var key in Catdata) {
                    var state = Catdata[key];
                    temparr.push({
                        key: key,
                        stateAddress: state.stateAddress,
                        staff: state.staff
                    });
                }
                resolve(temparr);
            });
        });
    };
    ManageAddressesPage.prototype.onTrash = function (event, item) {
        var _this = this;
        this.isPressTrash = true;
        this.addrListService.removeState(item).then(function () {
            for (var index in _this.items) {
                if (_this.items[index].key == item.key) {
                    _this.items.splice(index, 1);
                    return;
                }
            }
            for (var inc in _this.filters) {
                if (_this.filters[inc].key == item.key) {
                    _this.filters.splice(inc, 1);
                    return;
                }
            }
        }).then(function () {
            _this.appRef.tick();
            event.preventDefault();
            return false;
        });
    };
    ManageAddressesPage.prototype.onAddItem = function () {
        var _this = this;
        var dialog = this.alertCtrl.create();
        dialog.present();
        dialog.setTitle('Add New Address');
        dialog.addInput({ type: 'text', name: "address", placeholder: 'Input the address' });
        dialog.addInput({ type: 'text', name: "staff", placeholder: 'Input the staff name' });
        dialog.addButton('Cancel');
        dialog.addButton({
            text: 'Save',
            handler: function (data) {
                _this.state.stateAddress = data.address;
                _this.state.staff = data.staff;
                _this.global.state = _this.state;
                _this.addrListService.addState(_this.global.state).then(function () {
                    _this.getAllCatList().then(function (res) {
                        _this.filters = res;
                        _this.items = res;
                        _this.appRef.tick();
                    });
                });
            }
        });
    };
    ManageAddressesPage.prototype.ShowOriginal = function () {
        this.filters = this.items;
        this.appRef.tick();
    };
    ManageAddressesPage.prototype.itemTapped = function (event, item) {
        var _this = this;
        if (this.isPressTrash) {
            this.isPressTrash = false;
            return;
        }
        var dialog = this.alertCtrl.create();
        dialog.present();
        dialog.setTitle('Edit Address');
        dialog.addInput({ type: 'text', name: "address", placeholder: 'Input the address', value: item.stateAddress });
        dialog.addInput({ type: 'text', name: "staff", placeholder: 'Input the staff name', value: item.staff });
        dialog.addButton('Cancel');
        dialog.addButton({
            text: 'Save',
            handler: function (data) {
                _this.state.stateAddress = data.address;
                _this.state.staff = data.staff;
                _this.global.state = _this.state;
                _this.global.state.key = item.key;
                _this.addrListService.updateState(_this.global.state).then(function () {
                    _this.getAllCatList().then(function (res) {
                        _this.filters = res;
                        _this.items = res;
                        _this.appRef.tick();
                    });
                });
            }
        });
    };
    ManageAddressesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-manage-addresses',template:/*ion-inline-start:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\manage-addresses\manage-addresses.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu" style="color:white;"></ion-icon>\n    </button>\n    <ion-title>Manage Addresses</ion-title>\n    <ion-buttons end>\n      <button ion-button (click)="onAddItem()" style="color:white;">\n        <ion-icon name="add"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n  <button ion-button (click)="startListening()" list-top-btn>\n    <ion-icon name="mic" style="font-size:18px; padding-right:10px;"></ion-icon>Search\n  </button>\n\n  <button ion-button (click)="stopListening()" list-top-btn *ngIf="isIos()">\n    <ion-icon name="mic-off" style="font-size:18px;padding-right:10px;"></ion-icon>Stop\n  </button>\n\n  <button ion-button (click)="ShowOriginal()" list-top-btn item-right>\n    <ion-icon name="arrow-round-back" style="font-size:18px;padding-right:10px;"></ion-icon>Back\n  </button>\n  <ion-list>\n    <ion-item value=[item] *ngFor="let item of filters" (click)="itemTapped($event, item)">  \n      <h2>{{item.stateAddress}} <---> {{item.staff}} </h2>           \n      <ion-buttons end item-right btn-trash>\n        <button ion-button clear (click)="onTrash($event, item)">\n          <ion-icon name="trash" item-right></ion-icon>\n        </button>\n      </ion-buttons>\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"D:\Tasks\2018-5-30-Ionic\WorkApp622\src\pages\manage-addresses\manage-addresses.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__provider_globalprovider__["a" /* GlobalProvider */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ApplicationRef */],
            __WEBPACK_IMPORTED_MODULE_3__services_address_service__["a" /* AddressService */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_speech_recognition__["a" /* SpeechRecognition */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* ChangeDetectorRef */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */]])
    ], ManageAddressesPage);
    return ManageAddressesPage;
}());

//# sourceMappingURL=manage-addresses.js.map

/***/ })

},[393]);
//# sourceMappingURL=main.js.map