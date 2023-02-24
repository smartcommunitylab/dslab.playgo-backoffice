import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../../constants/constants';
import { FeatureGroup, icon, latLng, LeafletMouseEvent, Map, MapOptions, marker, tileLayer } from 'leaflet';
import * as L from 'leaflet';
import { MapPoint } from '../map-with-selector/map.model';
import { GameArea } from '../../classes/map-point';
import { fullScreenMap } from '../../full-screen/fullScreen';
@Component({
  selector: 'app-map-show',
  templateUrl: './map-show.component.html',
  styleUrls: ['./map-show.component.scss']
})
export class MapShowComponent implements OnInit {
  mapOptions: MapOptions;
  map: Map;
  lastLayer: any;
  _mapArea: GameArea;
  @Input() set mapArea(value : GameArea){
    // console.log("My point inside map", value);
      if(this._mapArea === undefined){
        // undefined
        this._mapArea = new GameArea();
        this._mapArea.latitude = 123123123;
        this._mapArea.longitude = 123123123;
        this._mapArea.radius = 123123123;
      }
      if(this._mapArea.latitude !== value.latitude || this._mapArea.longitude !== value.longitude){
        //stop looping
        this._mapArea = value;
        this._ray = ''+value.radius;
        this.onInputCoords();
    }
  }
  layer: FeatureGroup;
  _ray: string;

  constructor() {}

  ngOnInit(): void {
  }

  drawCircle(){
    if(!this._mapArea || !this._mapArea.latitude || !this._mapArea.longitude){
      return;
    }
    if(this.layer!==undefined){
      if(!!this.map)
        this.map.removeLayer(this.layer);
    }
    const numberRay = +this._ray;
    this.layer = L.featureGroup(); 
    if( numberRay >0){
      if(this._mapArea.latitude){
        L.circle([this._mapArea.latitude,this._mapArea.longitude], numberRay).addTo(this.layer);
      }
    }
    if(!!this.map){
      this.map.addLayer(this.layer);
    }
  }

  public onInputCoords(): void {
    this.initializeMapOptions();
    this.createMarker();
    this.drawCircle();
    this.zoomingOnRay();
  }

  public initializeMap(map: Map): void {
    this.map = map;
    fullScreenMap({ id: 'map', position: 'topleft' }).addTo(this.map);
    this.onInputCoords();
  }

  private initializeMapOptions(): void {
    this.mapOptions = {
      center: latLng(this._mapArea.latitude, this._mapArea.longitude),
      zoom: this.zoomResult(this._mapArea.radius),
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data © OpenStreetMap contributors'
        })
      ]
    };
  }

  private createMarker(): void {
    this.clearMap();
    if (this._mapArea) {
      const mapIcon = this.getDefaultIcon();
      if(!!this._mapArea.latitude && !!this._mapArea.longitude){
        const coordinates = latLng([this._mapArea.latitude, this._mapArea.longitude]);
        if(!!this.map){
          this.lastLayer = marker(coordinates)
          .setIcon(mapIcon)
          .addTo(this.map);
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
    if(!!!this.map || !!!this._mapArea){
      return;
    }else{
      this.map.flyTo([this._mapArea.latitude,this._mapArea.longitude],this.zoomResult(this._mapArea.radius));
    }
  }

}
