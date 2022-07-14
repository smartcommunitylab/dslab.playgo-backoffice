export class ActionManagerClass {
    type?: TypeActionManager.TypeEnum;
    id?: string;
    email?: string;
}

export namespace TypeActionManager {
    export type TypeEnum = "modify" | "delete" | "add";
    export const TypeEnum = {
      Add: "add" as TypeEnum,
      Modify: "modify" as TypeEnum,
      Delete: "delete" as TypeEnum,
}
}