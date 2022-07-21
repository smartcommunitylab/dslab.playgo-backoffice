export class MapPoint {
    name: string;
    latitude: number;
    longitude: number;

    constructor(lat?,long?){
      this.latitude = lat;
      this.longitude = long;
    }

  }

export class GameArea{
  latitude: number;
  longitude: number;
  radius: number;

}