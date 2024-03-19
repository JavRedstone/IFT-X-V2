import { Box3, Group, Object3D, Vector3 } from "three";
import { StarshipConstants } from "../constants/objects/StarshipConstants";
import { MathHelper } from "../helpers/MathHelper";
import { ObjectHelper } from "../helpers/ObjectHelper";

export class Starship {
    public nosecone: Group = new Group();
    public shipRing: Group = new Group();
    public forwardL: Group = new Group();
    public forwardR: Group = new Group();
    public aftL: Group = new Group();
    public aftR: Group = new Group();
    public rSeas: Object3D[] = [];
    public rVacs: Object3D[] = [];
    
    public group: Group = new Group();

    public hasSetupSingle: boolean = false;

    public options: any = {
        rSeaAngularOffset: StarshipConstants.R_SEA_ANGULAR_OFFSET,
        rVacAngularOffset: StarshipConstants.R_VAC_ANGULAR_OFFSET,
    };

    constructor() {
        this.setupMultiple();
    }

    public setupMultiple(): void {
        this.setupRSeas();
        this.setupRVacs();
    }

    public setupRSeas(): void {
        let rSeaPositions = MathHelper.getCircularPositions(StarshipConstants.NUM_R_SEAS, StarshipConstants.R_SEA_RADIUS, this.options.rSeaAngularOffset);
        let rSeaRotations = MathHelper.getCircularRotations(StarshipConstants.NUM_R_SEAS, this.options.rSeaAngularOffset);

        for (let i = 0; i < StarshipConstants.NUM_R_SEAS; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions[i]);
            rSea.rotation.copy(rSeaRotations[i]);
            rSea.scale.copy(StarshipConstants.R_SEA_SCALE);
            this.rSeas = [...this.rSeas, rSea];
        }
    }

    public setupRVacs(): void {
        let rVacPositions = MathHelper.getCircularPositions(StarshipConstants.NUM_R_VACS, StarshipConstants.R_VAC_RADIUS, this.options.rVacAngularOffset);
        let rVacRotations = MathHelper.getCircularRotations(StarshipConstants.NUM_R_VACS, this.options.rVacAngularOffset);

        for (let i = 0; i < StarshipConstants.NUM_R_VACS; i++) {
            let rVac = new Object3D();
            rVac.position.copy(rVacPositions[i]);
            rVac.rotation.copy(rVacRotations[i]);
            rVac.scale.copy(StarshipConstants.R_VAC_SCALE);
            this.rVacs = [...this.rVacs, rVac];
        }
    }

    public setupSingle(): void {
        if (this.nosecone != null && this.shipRing != null && this.forwardL != null && this.forwardR != null && this.aftL != null && this.aftR != null) {
            this.nosecone.scale.copy(StarshipConstants.NOSECONE_SCALE);
            this.shipRing.scale.copy(StarshipConstants.SHIP_RING_SCALE);
            this.forwardL.scale.copy(StarshipConstants.FORWARD_L_SCALE);
            this.forwardL.rotation.copy(StarshipConstants.FORWARD_L_ROTATION);
            this.forwardR.scale.copy(StarshipConstants.FORWARD_R_SCALE);
            this.forwardR.rotation.copy(StarshipConstants.FORWARD_R_ROTATION);
            this.aftL.scale.copy(StarshipConstants.AFT_L_SCALE);
            this.aftR.scale.copy(StarshipConstants.AFT_R_SCALE);
            this.hasSetupSingle = true;
        }    
    }

    public updateObjects(): void {
        this.nosecone.position.copy(this.shipRing.position.clone().add(new Vector3(0, ObjectHelper.getObjectDimensions(this.shipRing).y, 0)));
        console.log(this.nosecone.position);
    }

    public updateScene(delta: number): void {
        if (!this.hasSetupSingle) {
            this.setupSingle();
        }
        else {
            this.updateObjects();
        }
    }
}