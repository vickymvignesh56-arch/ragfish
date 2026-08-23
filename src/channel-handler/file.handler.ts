import type { ChannelHandler, ChannelProcess } from "./index.js";

export class FileHandler implements ChannelHandler{
    setupChannel(userId: string, appId: string, channelId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    processResource(resource: ChannelProcess): Promise<void> {
        throw new Error("Method not implemented.");
    }
    clearIndexPointsResource(userId: string, resourceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}