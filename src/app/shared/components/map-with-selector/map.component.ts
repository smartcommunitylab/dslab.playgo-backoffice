import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../../constants/constants';
import { icon, latLng, LeafletMouseEvent, Map, MapOptions, marker, tileLayer } from 'leaflet';
import { MapPoint } from './map.model';

@Component({
  selector: 'jhi-app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  mapOptions: MapOptions;
  map: Map;
  lastLayer: any;
  mapPoint: MapPoint;
  @Output() mapPointOutput: EventEmitter<MapPoint> = new EventEmitter();

  constructor() {}


  ngOnInit(): void {
    this.initializeMapOptions();
  }

  public onMapClick(e: LeafletMouseEvent): void {
    this.clearMap();
    this.updateMapPoint(e.latlng.lat, e.latlng.lng, '');
    this.createMarker();
  }

  public initializeMap(map: Map): void {
    this.map = map;
    this.createMarker();
  }
  private initializeMapOptions(): void {
    this.mapOptions = {
      center: latLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
      zoom: 12,
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data © OpenStreetMap contributors'
        })
      ]
    };
  }

  private updateMapPoint(latitude: number, longitude: number, name: string): void {
    if (!this.mapPoint) {
      this.mapPoint = {
        name: '',
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE
      };
    }
    this.mapPoint = {
      latitude,
      longitude,
      name: name ? name : ''
    };
    this.mapPointOutput.emit(this.mapPoint);
  }

  private createMarker(): void {
    this.clearMap();
    if (this.mapPoint) {
      const mapIcon = this.getDefaultIcon();
      const coordinates = latLng([this.mapPoint.latitude, this.mapPoint.longitude]);
      this.lastLayer = marker(coordinates)
        .setIcon(mapIcon)
        .addTo(this.map);
      this.lastLayer
        .bindPopup(
          (this.mapPoint.name ? '<b>Indirizzo</b>: ' + this.mapPoint.name : '') +
            '<br><b>lat</b>: ' +
            this.mapPoint.latitude +
            '<br><b>long:</b> ' +
            this.mapPoint.longitude
        )
        .openPopup();
      this.map.setView(coordinates, this.map.getZoom());
    }
  }

  private getDefaultIcon(): any {
    return icon({
      iconSize: [41, 41],
      iconAnchor: [21, 41],
      popupAnchor: [0, -30],
      iconUrl: 'assets/content/images/marker-icon.png'
    });
  }

  private clearMap(): void {
    if (this.map.hasLayer(this.lastLayer)) this.map.removeLayer(this.lastLayer);
  }

}
