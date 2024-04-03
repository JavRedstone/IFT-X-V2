export class Gimbal {
    public gimbalAngle: number;
    public angleY: number;
    public tGimbalAngle: number;
    public tAngleY: number;

    public constructor() {
        this.gimbalAngle = 0;
        this.angleY = 0;
        this.tGimbalAngle = 0;
        this.tAngleY = 0;
    }

    public setTarget(tGimbalAngle: number, tAngleY: number): void {
        this.tGimbalAngle = tGimbalAngle;
        this.tAngleY = tAngleY;
    }

    public update(delta: number): void {
        let targetAngleY: number = this.tAngleY;

        if (this.gimbalAngle == 0) {
            this.angleY = targetAngleY;
        }
        this.gimbalAngle += (this.tGimbalAngle - this.gimbalAngle) * delta;
        if (this.tGimbalAngle > 0) {
            targetAngleY %= 2 * Math.PI;
            if (targetAngleY < 0) {
                targetAngleY += 2 * Math.PI;
            }
            if (Math.abs(targetAngleY - this.angleY) > Math.PI) {
                if (targetAngleY > this.angleY) {
                    targetAngleY -= 2 * Math.PI;
                } else {
                    targetAngleY += 2 * Math.PI;
                }
            }
            this.angleY += (targetAngleY - this.angleY) * delta;
        }
    }
}