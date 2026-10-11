declare module 'qrcode' {
  export interface QRCodeToDataURLOptions {
    type?: string;
    rendererOpts?: any;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' | 'low' | 'medium' | 'quartile' | 'high';
    margin?: number;
    scale?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  export function toDataURL(
    text: string | any[],
    options?: QRCodeToDataURLOptions
  ): Promise<string>;

  export function toDataURL(
    text: string | any[],
    callback: (error: any, url: string) => void
  ): void;

  export function toDataURL(
    text: string | any[],
    options: QRCodeToDataURLOptions,
    callback: (error: any, url: string) => void
  ): void;

  export function toFile(
    path: string,
    text: string | any[],
    options?: any
  ): Promise<any>;

  export function toCanvas(
    canvasElement: any,
    text: string | any[],
    options?: any
  ): Promise<any>;
}
