import { Injectable } from "@nestjs/common";
import { callbackManager } from "./callbackManager.interface";

@Injectable()
export class callbackManagerProd implements callbackManager {
    onInsert(): Promise<void> { return }
}