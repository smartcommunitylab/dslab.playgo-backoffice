import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CopiedComponent, HandleUsersComponent } from "./handle-users.component";
import { HandleUsersRouting } from "./handle-users.routing";

@NgModule({
  imports: [
    SharedModule,
    HandleUsersRouting
  ],
  declarations: [HandleUsersComponent,CopiedComponent],
})
export class HandleUsersModule {}
