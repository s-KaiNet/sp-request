declare module "http" {
  export interface IncomingMessage {
    body: any;
  }
}