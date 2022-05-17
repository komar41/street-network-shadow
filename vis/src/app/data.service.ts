import { environment } from '../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {transform} from "ol/proj";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  projections: any;
  private update = new Subject<object>();

  constructor(private http: HttpClient) { }

  // getDistribution(arr: any []): Observable<any> {
  //   //
  //   return new Observable<any>();
  // }

  getDataUpdate(){
    return this.update.asObservable();
  }

  changeCoordinates(projections: any[]) {

    if (this.projections != projections){
      this.projections = projections
      let coordinates = []
      for (const projection of projections) {
        let coordinate = transform(projection, 'EPSG:3857', 'EPSG:4326')
        coordinates.push([coordinate[1], coordinate[0]])
         //console.log(coordinate[0])
         //console.log('\n')
         //console.log('\n')
         //console.log(coordinate[1])
      }

      this.http.post<{ message: string, distributions: any }>('http://localhost:8080/distribution', coordinates)
        .subscribe((responseData) => {
            // console.log(responseData.message)
            if (responseData.distributions != null) {
              this.update.next(responseData.distributions)
            }

          }
        );
    }
  }

}
