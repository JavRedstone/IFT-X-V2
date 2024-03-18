import { Texture, TextureLoader } from "three";

export class TextureHelper {
    public static loadTexture = (url: string) => {
        return new Promise<Texture>((resolve, reject) => {
            new TextureLoader().load(url, resolve, undefined, reject);
        });
    };
}