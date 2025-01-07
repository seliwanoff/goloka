declare module "lamejs" {
  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, bitRate: number);
    encodeBuffer(buffer: Int16Array): Uint8Array;
    flush(): Uint8Array;
  }
}
