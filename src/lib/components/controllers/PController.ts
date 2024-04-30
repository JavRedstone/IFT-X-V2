export class PController {
    public KP: number = 0;
    public target: number = 0;
    public error: number = 0;
    public output: number = 0;

    public constructor(target: number, KP: number) {
        this.target = target;
        this.KP = KP;
    }

    public update(current: number): void {
        this.error = this.target - current;
        this.output = this.KP * this.error;
    }
}