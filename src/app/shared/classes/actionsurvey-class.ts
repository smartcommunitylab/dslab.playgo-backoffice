import { SurveyRequest } from "src/app/core/api/generated/model/surveyRequest";

export class ActionSurveyClass{
    type?: TypeActionSurvey.TypeEnum;
    survey?: SurveyRequest;
    id?: string;
}

export namespace TypeActionSurvey {
    export type TypeEnum = "add" | "delete" | "assign";
    export const TypeEnum = {
      Add: "add" as TypeEnum,
      Assign: "assign" as TypeEnum,
      Delete: "delete" as TypeEnum,
}
}