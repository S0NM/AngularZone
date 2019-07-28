import { Injectable } from '@angular/core';
import { IUserSettings } from './user-settings';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  postUserSettingsForm(userSettings: IUserSettings) : Observable<any>{
    return this.http.post('https://putsreq.com/iiOOQbPdgi5BxotIwPLl', userSettings);
    //return of(userSettings)
  }

  getSubscriptionTypes() : Observable<string[]>{
    return of(['Monthly', 'Annual','Lifetime']); 
  }
}
