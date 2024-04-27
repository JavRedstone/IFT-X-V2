export class PDController {
    public KP: number = 0;
    public KD: number = 0;
    public target: number = 0;
    public error: number = 0;
    public prevError: number = 0;
    public output: number = 0;

    public constructor(target: number, KP: number, KD: number) {
        this.target = target;
        this.KP = KP;
        this.KD = KD;
    }

    public update(current: number, multiplier: number, delta: number): void {
        let actualKP = this.KP * multiplier;
        let actualKD = this.KD * multiplier;
        this.error = this.target - current;
        this.output = actualKP * this.error + actualKD * (this.error - this.prevError) / delta;
        this.prevError = this.error;
    }
}