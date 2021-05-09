import { Injectable } from "@nestjs/common";
import { callbackManager } from "./callbackManager.interface";

@Injectable()
export class callbackManagerTest implements callbackManager {
    onInsert(sleepTime: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, sleepTime))
    }
}