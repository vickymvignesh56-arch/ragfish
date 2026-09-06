export interface ChannelProcess {
  userId: string;
  channelId: string;
  resourceId: string;
  ingestPoint(text: string, fileName: string, filePath: string): Promise<void>;
  clearIndexPointsResource(): Promise<void>;
}

export interface ChannelHandler {
  processResource(resource: ChannelProcess): Promise<void>;

  clearIndexPointsResource(userId: string, resourceId: string): Promise<void>;
}
