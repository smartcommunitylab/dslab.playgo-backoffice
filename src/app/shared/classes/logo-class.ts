import { Image } from "src/app/core/api/generated/model/image";

export class Logo implements Image{

    contentType?: string;
    image?: string; //| ArrayBuffer | Uint8Array
}