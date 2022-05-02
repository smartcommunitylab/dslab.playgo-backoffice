import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Account } from '../../user/account.model';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})
export class AccountDialogComponent implements OnInit {

  changePasswordVar: boolean = false;
  validatingForm: FormGroup;
  hidePassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  account: Account;
  
  constructor(    public dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.account = this.authService.getAccount();
    console.log(this.account);
    
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  changePassword(event: any){
    this.validatingForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.maxLength(40)]), 
      newPassword: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    });
    this.changePasswordVar = true;
  }

  logout(event: any){
    this.authService.logout();
  }

  confirmPasswordChange(event: any){
    if(this.validatingForm.valid){
      if(this.validatingForm.get("newPassword") === this.validatingForm.get("confirmPassword")){
        console.log("Password changed!");
      }else{
        console.log("Password don't match");
      }
    }
  }

}
