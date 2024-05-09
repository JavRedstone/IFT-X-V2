import { LoadingManager, Texture, TextureLoader } from "three";

export class TextureHelper {
    public static loadTexture = (url: string, manager: LoadingManager) => {
        return new Promise<Texture>((resolve, reject) => {
            new TextureLoader(manager).load(url, resolve, undefined, reject);
        });
    };
}