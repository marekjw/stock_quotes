export interface callbackManager {
    onInsert: (...args: any[]) => Promise<void>
}