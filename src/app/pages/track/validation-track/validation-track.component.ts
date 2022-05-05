import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-validation-track',
  templateUrl: './validation-track.component.html',
  styleUrls: ['./validation-track.component.scss']
})
export class ValidationTrackComponent implements OnInit {


  validatingForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {

  this.initializaValidatingForm();
  }

  initializaValidatingForm() {
    this.validatingForm = this.formBuilder.group({
      territoryId: new FormControl("", [Validators.required]),
      campaignId: new FormControl("", [Validators.required]),
      name: new FormControl("", [Validators.required]),
      logo: new FormControl("", [Validators.required]),
      description: new FormControl(""),
      privacy: new FormControl(""),
      rules: new FormControl(""),
      means: new FormControl("", [Validators.required]),
      active: new FormControl("", [Validators.required]),
      dateFrom: new FormControl("", [Validators.required]),
      dateTo: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      gameId: new FormControl(""),
      startDayOfWeek: new FormControl("", [Validators.pattern("^[1-7]")]),
    });
  }


}
