import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../../constants/constants';
import { FeatureGroup, icon, latLng, LeafletMouseEvent, Map, MapOptions, marker, tileLayer } from 'leaflet';
import { MapPoint } from './map.model';
import * as L from 'leaflet';
import { fullScreenMap } from '../../full-screen/fullScreen';

@Component({
  selector: 'jhi-app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit,OnChanges {
  mapOptions: MapOptions;
  map: Map;
  lastLayer: any;
  _mapPoint: MapPoint;
  @Input() set mapPoint(value : MapPoint){
    // console.log("My point inside map", value);
      if(this._mapPoint === undefined){
        // undefined
        this._mapPoint = new MapPoint();
        this._mapPoint.latitude = 123123123;
        this._mapPoint.longitude = 123123123;
      }
      if(this._mapPoint.latitude !== value.latitude || this._mapPoint.longitude !== value.longitude){
        //stop looping
        this._mapPoint = value;
        this.onInputCoords(value);
    }
  }
  layer: FeatureGroup;
  _ray: string;
  @Input() set ray(value: string) {
    // console.log("ray from map", value);
    this._ray = value;
    this.drawCircle(); 
 }

  @Output() mapPointOutput: EventEmitter<MapPoint> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    //console.log("here");
    this.initializeMapOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.drawCircle();
    this.zoomingOnRay();
  }

  drawCircle(){
    if(!this._mapPoint || !this._mapPoint.latitude || !this._mapPoint.longitude){
      return;
    }
    if(this.layer!==undefined){
      if(!!this.map)
        this.map.removeLayer(this.layer);
    }
    const numberRay = +this._ray;
    this.layer = L.featureGroup(); 
    if( numberRay >0){
      if(this._mapPoint.latitude){
        L.circle([this._mapPoint.latitude,this._mapPoint.longitude], numberRay).addTo(this.layer);
      }
    }
    if(!!this.map){
      this.map.addLayer(this.layer);
    }
  }


  public onMapClick(e: LeafletMouseEvent): void {
    this.clearMap();
    this.updateMapPoint(e.latlng.lat, e.latlng.lng, '');
    this.createMarker();
    this.drawCircle();
  }

  public onInputCoords(e: MapPoint): void {
    this.clearMap();
    this.updateMapPoint(e.latitude, e.longitude, '');
    this.createMarker();
    this.drawCircle();
  }

  public initializeMap(map: Map): void {
    this.map = map;
    //fullScreenMap({ id: 'map', position: 'topleft' }).addTo(this.map);
    this.createMarker();
  }
  private initializeMapOptions(): void {
    this.mapOptions = {
      center: latLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
      zoom: 7,
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data © OpenStreetMap contributors'
        })
      ]
    };
  }

  private updateMapPoint(latitude: number, longitude: number, name: string): void {
    if (!this._mapPoint) {
      this._mapPoint = {
        name: '',
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE
      };
    }
    this._mapPoint = {
      latitude,
      longitude,
      name: name ? name : ''
    };
    this.mapPointOutput.emit(this._mapPoint);
  }

  private createMarker(): void {
    this.clearMap();
    if (this._mapPoint) {
      const mapIcon = this.getDefaultIcon();
      if(!!this._mapPoint.latitude && !!this._mapPoint.longitude){
        const coordinates = latLng([this._mapPoint.latitude, this._mapPoint.longitude]);
        if(!!this.map){
          this.lastLayer = marker(coordinates)
          .setIcon(mapIcon)
          .addTo(this.map);
        this.lastLayer
          .bindPopup(
            (this._mapPoint.name ? '<b>Indirizzo</b>: ' + this._mapPoint.name : '') +
              '<br><b>lat</b>: ' +
              this._mapPoint.latitude +
              '<br><b>long:</b> ' +
              this._mapPoint.longitude
          )
          .openPopup();
        this.map.setView(coordinates, this.map.getZoom());
        }
      }
    }
  }

  private getDefaultIcon(): any {
    return icon({
      iconSize: [41, 41],
      iconAnchor: [21, 41],
      popupAnchor: [0, -30],
      iconUrl: 'assets/images/marker-icon.png'
    });
  }

  private clearMap(): void {
    if(!!this.map){
      if (this.map.hasLayer(this.lastLayer)) this.map.removeLayer(this.lastLayer);
    }
  }

  zoomResult(ray: number): number{
    var newZoom = this.map.getZoom();
    const defaultZoom = 7;
    const baseVal = 160000;
    const baseVal2 = 40000
    const k = +this._ray;
    //0 - 40'000 , 40'001 - 80'000, 80'001 - 120'000, 120'001 - 160'000, 
    //  9                 8                7                  6
    //160'001 - 320'000,320'001 - oo 
    //        5                 4
    if(k<=baseVal2){
      return 9;
    }
    if(k>baseVal2 && k<=2*baseVal2){
      return 8;
    }
    if(k>2*baseVal2 && k<=baseVal){
      return 7;
    }
    if(k>baseVal && k<=2*baseVal){
      return 6;
    }
    if(k>2*baseVal && k<=4*baseVal){
      return 5;
    }
    if(k>4*baseVal && k<=6*baseVal){
      return 4;
    }
    if(k>6*baseVal && k<=8*baseVal){
      return 3;
    }  
    if(k>8*baseVal){
      return 1;
    }
  }


  zoomingOnRay(){
    if(!!!this.map || !!!this._ray){
      return;
    }else{
      this.map.flyTo([this._mapPoint.latitude,this._mapPoint.longitude],this.zoomResult(+this._ray));
    }
  }

}
