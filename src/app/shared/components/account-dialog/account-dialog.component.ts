import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PlayerRole } from 'src/app/core/api/generated/model/playerRole';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RoleService } from '../../services/role.service';
import { Account } from '../../user/account.model';
import {CONST_LANGUAGES_SUPPORTED, LANGUAGE_LOCAL_STORAGE} from '../../constants/constants';

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
  roles: PlayerRole[];
  languagesSelectable = CONST_LANGUAGES_SUPPORTED;
  selectedLanguage: string;
  
  constructor(    public dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private roleService: RoleService) { }

  ngOnInit(): void {
    this.selectedLanguage = this.translate.currentLang;
    this.account = this.authService.getAccount();
    this.roles = this.roleService.getRoles();
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

  changeLanguage(event){
    this.selectedLanguage = event;
    localStorage.setItem(LANGUAGE_LOCAL_STORAGE, event);
    this.translate.setDefaultLang(event);
    this.translate.use(event); //TODO get language from browser
    window.location.reload();
  }

}
