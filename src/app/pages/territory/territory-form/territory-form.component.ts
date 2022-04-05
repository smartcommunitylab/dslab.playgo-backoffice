import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-territory-form',
  templateUrl: './territory-form.component.html',
  styleUrls: ['./territory-form.component.scss']
})
export class TerritoryFormComponent implements OnInit {

  validatingForm: FormGroup;
  controlName: string;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({});
  }

  validate(){}

}
