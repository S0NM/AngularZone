import { Component, OnInit } from '@angular/core';

import { Customer } from './customer';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { debounceTime, throwIfEmpty } from 'rxjs/operators'

//3-1 Email Comparison Validation
function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmEmailControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmEmailControl.value) {
    return null;
  }
  return { 'match': true };
}

//2-1. Custom Validation Functin
function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null) {
      if (isNaN(c.value) || c.value < min || c.value > max) {
        return { 'range': true }
      }
    }
    return null;//return null when formcontrol is valid
  };
}


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();
  emailMessage: string;

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses');
  }

  private validationMessages = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address'
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      //lastName: {value:'n/a', disabled: true},
      lastName: ['', [Validators.required, Validators.maxLength(50)]],

      //2.Nested Form Group
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required]
      }, { validator: emailMatcher }), //3-2 emailMatcher 

      phone: '',
      notification: 'email',
      rating: [null, ratingRange(1, 5)],//2-2.Custom Validation Function
      sendCatalog: true,

      //Address Nested FormGroup
      addresses: this.fb.array([this.builAddress()])

    });

    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    )

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(debounceTime(1000)).subscribe(
      value => this.setMessage(emailControl)
    )
  }

  populateTestData(): void {
    this.customerForm.setValue({
      firstName: 'Jack',
      lastName: "Harkness",
      email: 'jack@torchwood.com',
      sendCatalog: false
    })
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    //Check if the input element was touched or dirty and the FormControl has validation errors
    if ((c.touched || c.dirty) && c.errors) {
      console.log(c.errors)
      this.emailMessage = Object.keys(c.errors).map(
        key => this.emailMessage += this.validationMessages[key]).join(' ');
    }
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  addAddress(): void {
    this.addresses.push(this.builAddress());
  }

  builAddress():FormGroup{
    return this.fb.group({
      addressType: 'Home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    })
  }

}
