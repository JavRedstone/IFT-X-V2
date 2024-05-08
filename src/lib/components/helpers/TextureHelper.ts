import { Texture, TextureLoader } from "three";
import { uiMessages } from "../stores/ui-store";

export class TextureHelper {
    public static loadTexture = (url: string) => {
        return new Promise<Texture>((resolve, reject) => {
            new TextureLoader().load(url, resolve, undefined, reject);
            uiMessages.update((value) => {
                value.numTexturesLoaded++;
                return value;
            });
        });
    };
}