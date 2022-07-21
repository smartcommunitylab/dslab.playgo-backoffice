// /// <reference lib="webworker" />
// import { HttpClient, HttpXhrBackend } from "@angular/common/http";
// import { ConsoleControllerService } from "src/app/core/api/generated/controllers/consoleController.service";
// import { RoleService } from "../../shared/services/role.service";

// addEventListener('message', async ({ data }) => {
//   const httpClient = new HttpClient(new HttpXhrBackend({ 
//     build: () => new XMLHttpRequest() 
// }));
//   var p = new RoleService(new ConsoleControllerService(httpClient));
//   while(true){
//     console.log("here");
//     p.getInitializedJustOncePerUserSecond().subscribe((res)=>{
//       postMessage(res);
//     });
//     await new Promise(r => setTimeout(r, 2000));
//   }
// });
