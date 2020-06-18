import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalServiceService {

  constructor( private http: HttpClient ) { }

  public globalPost(type:string,url:string,bd?:any,obs?:any):Observable <any>{
    try {
        return this.http.request(type,url,{ body:bd?bd:null,observe:obs?obs:'body' })
    } catch (error) {
        return error
    }
  }

}
