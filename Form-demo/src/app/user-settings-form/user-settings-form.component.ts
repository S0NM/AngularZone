import { Component, OnInit } from '@angular/core';
import { IUserSettings } from '../data/user-settings';
import { NgForm, NgModel } from '@angular/forms';
import { DataService } from '../data/data.service';
import { Observable } from 'rxjs';
import { Time } from '@angular/common';

@Component({
  selector: 'app-user-settings-form',
  templateUrl: './user-settings-form.component.html',
  styleUrls: ['./user-settings-form.component.css']
})
export class UserSettingsFormComponent implements OnInit {

  originalUserSettings: IUserSettings = {
    name: '',
    emailOffers: true,
    interfaceStyle: 'dark',
    subscriptionType: 'Annual',
    notes: 'here are some notes....'
  }

  singleModel = "On";

  startDate: Date;
  startTime: Time;
  userSettings : IUserSettings = {...this.originalUserSettings}
  postError = false;
  postErrorMessage = '';
  subscriptionType: Observable<string[]>;

  //Bootstrap service
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.subscriptionType = this.dataService.getSubscriptionTypes();
    this.startDate = new Date();
    
  }

  onHttpError(errorResponse: any){
    console.log('error:',errorResponse);
    this.postError = true;
    this.postErrorMessage = errorResponse.error.errorMessage;
  }

  onSubmit(form: NgForm){
    console.log('in onSubmit: ', form.valid);
    
    if (form.valid){
      this.dataService.postUserSettingsForm(this.userSettings).subscribe(
        result => console.log('success: ', result),
        error => this.onHttpError(error)
      );
    } else {
      this.postError = true;
      this.postErrorMessage = "Please fix the above errors"
    }
    
  }

 

  onBlur(field: NgModel){
    console.log(' in onBlur: ', field.valid);
  }
}
