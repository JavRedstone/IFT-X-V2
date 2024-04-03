export class Gimbal {
    public radius: number;
    public angle: number;

    public constructor(radius: number, angle: number, speed: number = 0) {
        this.radius = radius;
        this.angle = angle;
    }

    public tickTowardsTarget(targetRadius: number, targetAngle: number, delta: number): void {
        if (this.radius == 0) {
            this.angle = targetAngle;
        }
        this.radius += (targetRadius - this.radius) * delta;
        if (targetRadius > 0) {
            targetAngle %= 2 * Math.PI;
            if (targetAngle < 0) {
                targetAngle += 2 * Math.PI;
            }
            if (Math.abs(targetAngle - this.angle) > Math.PI) {
                if (targetAngle > this.angle) {
                    targetAngle -= 2 * Math.PI;
                } else {
                    targetAngle += 2 * Math.PI;
                }
            }
            this.angle += (targetAngle - this.angle) * delta;
        }
    }
}