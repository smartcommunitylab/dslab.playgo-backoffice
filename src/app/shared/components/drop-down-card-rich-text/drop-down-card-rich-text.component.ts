// import { Component, Input, OnInit, Output,EventEmitter } from "@angular/core";
// import { trigger, state, style, transition, animate } from '@angular/animations';
// import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

// @Component({
//   selector: "drop-down-card-rich-text",
//   templateUrl: "./drop-down-card-rich-text.component.html",
//   styleUrls: ["./drop-down-card-rich-text.component.scss"],
//   animations: [
//     trigger('bodyExpansion', [
//       state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
//       state('expanded', style({ height: '*', visibility: 'visible' })),
//       transition('expanded <=> collapsed, void => collapsed',
//         animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
//     ])
//   ]
// })
// export class DropDownCardRichTextComponent implements OnInit {
//   @Input() title:string;
//   @Output() validationOutput= new EventEmitter<FormControl>();
//   validatingForm: FormGroup;
//   state: string="collapsed";
//   constructor(private formBuilder: FormBuilder) {}

//   ngOnInit() {
//     this.validatingForm = this.formBuilder.group({
//         element: new FormControl("")
//     });
//   }

//   toggle(){
//     if(this.state==='collapsed'){
//       this.state = 'expanded';
//       /*setTimeout( ()=>{
//         if(this.state==='collapsed'){
//           const height =document.getElementById('content').offsetHeight;
//           this.heightAugment.emit("-"+height);
//         }else{
//           const height =document.getElementById('content').offsetHeight;
//           this.heightAugment.emit(height+"");
//         }
//       },1);*/
//     }else{
//       this.state = 'collapsed';
//     //   const height = document.getElementById('content').offsetHeight;
//     //   const res = height=== 0? height+'' : "-"+height;
//     //   this.heightAugment.emit(res);
//     }

//   }


//   get richControl() {
//     return this.validatingForm.controls.element as FormControl;
//   }

// }
