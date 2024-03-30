import { Group, Object3D, Vector3 } from "three";
import { StarshipConstants } from "../constants/objects/StarshipConstants";
import { MathHelper } from "../helpers/MathHelper";
import { ObjectHelper } from "../helpers/ObjectHelper";
import { starshipSettings } from "../ui-stores/ui-store";

export class Starship {
    public nosecone: Group = new Group();
    public shipRing: Group = new Group();
    public forwardL: Group = new Group();
    public forwardR: Group = new Group();
    public aftL: Group = new Group();
    public aftR: Group = new Group();
    public thrustPuck: Group = new Group();
    public rSeas: Object3D[] = [];
    public rSeaObjs: Group[] = [];
    public rVacs: Object3D[] = [];
    public rVacObjs: Group[] = [];
    
    public group: Group = null;

    public hasSetupSingle: boolean = false;
    public hasUpdatedAABB: boolean = false;

    public options: any = {
        rSeaAngularOffset: StarshipConstants.R_SEA_ANGULAR_OFFSET,
        rVacAngularOffset: StarshipConstants.R_VAC_ANGULAR_OFFSET,

        bodyHeightScale: 1,

        forwardLHeightScale: 1,
        forwardLWidthScale: 1,
        forwardRHeightScale: 1,
        forwardRWidthScale: 1,

        aftLHeightScale: 1,
        aftLWidthScale: 1,
        aftRHeightScale: 1,
        aftRWidthScale: 1,

        rSeaRadius: StarshipConstants.R_SEA_RADIUS,
        numRSeas: StarshipConstants.NUM_R_SEAS,
        rVacRadius: StarshipConstants.R_VAC_RADIUS,
        numRVacs: StarshipConstants.NUM_R_VACS
    };

    constructor() {
        this.setupMultiple();
        this.setupUpdator();
    }

    public setupMultiple(): void {
        this.rSeas = [];
        this.rSeaObjs = [];
        this.rVacs = [];
        this.rVacObjs = [];
        this.setupRSeas();
        this.setupRVacs();
    }

    public setupUpdator(): void {
        starshipSettings.subscribe((value) => {
            this.options.rSeaAngularOffset = value.rSeaAngularOffset;
            this.options.rVacAngularOffset = value.rVacAngularOffset;

            this.options.bodyHeightScale = value.bodyHeightScale;

            this.options.forwardLHeightScale = value.forwardLHeightScale;
            this.options.forwardLWidthScale = value.forwardLWidthScale;
            this.options.forwardRHeightScale = value.forwardRHeightScale;
            this.options.forwardRWidthScale = value.forwardRWidthScale;
            this.options.aftLHeightScale = value.aftLHeightScale;
            this.options.aftLWidthScale = value.aftLWidthScale;
            this.options.aftRHeightScale = value.aftRHeightScale;
            this.options.aftRWidthScale = value.aftRWidthScale;

            this.options.rSeaRadius = value.rSeaRadius;
            this.options.numRSeas = value.numRSeas;
            this.options.rVacRadius = value.rVacRadius;
            this.options.numRVacs = value.numRVacs;

            this.rSeas = [];
            this.rVacs = [];

            this.setupMultiple();
            this.hasSetupSingle = false;
        });
    }

    public setupRSeas(): void {
        let rSeaPositions = MathHelper.getCircularPositions(this.options.numRSeas, this.options.rSeaRadius * StarshipConstants.STARSHIP_SCALE.x, this.options.rSeaAngularOffset);
        let rSeaRotations = MathHelper.getCircularRotations(this.options.numRSeas, this.options.rSeaAngularOffset);

        for (let i = 0; i < this.options.numRSeas; i++) {
            let rSea = new Object3D();
            rSea.position.copy(rSeaPositions[i].clone().add(new Vector3(0, StarshipConstants.R_SEA_HEIGHT * StarshipConstants.STARSHIP_SCALE.y, 0)));
            rSea.rotation.copy(rSeaRotations[i]);
            rSea.scale.copy(StarshipConstants.R_SEA_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE));

            this.rSeas = [...this.rSeas, rSea];
        }
    }

    public setupRVacs(): void {
        let rVacPositions = MathHelper.getCircularPositions(this.options.numRVacs, this.options.rVacRadius * StarshipConstants.STARSHIP_SCALE.x, this.options.rVacAngularOffset);
        let rVacRotations = MathHelper.getCircularRotations(this.options.numRVacs, this.options.rVacAngularOffset);

        for (let i = 0; i < this.options.numRVacs; i++) {
            let rVac = new Object3D();
            rVac.position.copy(rVacPositions[i].clone().add(new Vector3(0, StarshipConstants.R_VAC_HEIGHT * StarshipConstants.STARSHIP_SCALE.y, 0)));
            rVac.rotation.copy(rVacRotations[i]);
            rVac.scale.copy(StarshipConstants.R_VAC_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE));

            this.rVacs = [...this.rVacs, rVac];
        }
    }

    public setupSingle(): void {
        if (this.nosecone != null && this.shipRing != null && this.forwardL != null && this.forwardR != null && this.aftL != null && this.aftR != null) {
            this.nosecone.userData.aabb = null;
            this.shipRing.userData.aabb = null;
            this.forwardL.userData.aabb = null;
            this.forwardR.userData.aabb = null;
            this.aftL.userData.aabb = null;
            this.aftR.userData.aabb = null;
            this.thrustPuck.userData.aabb = null;
            this.hasUpdatedAABB = false;

            this.nosecone.scale.copy(StarshipConstants.NOSECONE_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE));
            this.shipRing.scale.copy(StarshipConstants.SHIP_RING_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.bodyHeightScale, 1)));
            this.forwardL.scale.copy(StarshipConstants.FORWARD_L_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.forwardLHeightScale, this.options.forwardLWidthScale)));
            this.forwardL.rotation.copy(StarshipConstants.FORWARD_L_ROTATION);
            this.forwardR.scale.copy(StarshipConstants.FORWARD_R_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.forwardRHeightScale, this.options.forwardRWidthScale)));
            this.forwardR.rotation.copy(StarshipConstants.FORWARD_R_ROTATION);
            this.aftL.scale.copy(StarshipConstants.AFT_L_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.aftLHeightScale, this.options.aftLWidthScale)));
            this.aftR.scale.copy(StarshipConstants.AFT_R_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE).multiply(new Vector3(1, this.options.aftRHeightScale, this.options.aftRWidthScale)));
            this.thrustPuck.scale.copy(StarshipConstants.THRUST_PUCK_SCALE.clone().multiply(StarshipConstants.STARSHIP_SCALE));
            this.thrustPuck.position.copy(this.shipRing.position.clone().add(new Vector3(0, StarshipConstants.THRUST_PUCK_HEIGHT * StarshipConstants.STARSHIP_SCALE.y, 0)));
            this.hasSetupSingle = true;
        }    
    }

    public updateAABB(): void {
        if (this.nosecone != null && this.shipRing != null && this.forwardL != null && this.forwardR != null && this.aftL != null && this.aftR != null && this.thrustPuck != null) {
            if (this.nosecone.userData.aabb == null || this.shipRing.userData.aabb == null || this.forwardL.userData.aabb == null || this.forwardR.userData.aabb == null || this.aftL.userData.aabb == null || this.aftR.userData.aabb == null || this.thrustPuck.userData.aabb == null ||
                this.nosecone.userData.aabb.getSize(new Vector3).length() == 0 || this.shipRing.userData.aabb.getSize(new Vector3).length() == 0 || this.forwardL.userData.aabb.getSize(new Vector3).length() == 0 || this.forwardR.userData.aabb.getSize(new Vector3).length() == 0 || this.aftL.userData.aabb.getSize(new Vector3).length() == 0 || this.aftR.userData.aabb.getSize(new Vector3).length() == 0 || this.thrustPuck.userData.aabb.getSize(new Vector3).length() == 0) {
                this.nosecone.userData.aabb = ObjectHelper.getAabb(this.nosecone);
                this.shipRing.userData.aabb = ObjectHelper.getAabb(this.shipRing);
                this.forwardL.userData.aabb = ObjectHelper.getAabb(this.forwardL);
                this.forwardR.userData.aabb = ObjectHelper.getAabb(this.forwardR);
                this.aftL.userData.aabb = ObjectHelper.getAabb(this.aftL);
                this.aftR.userData.aabb = ObjectHelper.getAabb(this.aftR);
                this.thrustPuck.userData.aabb = ObjectHelper.getAabb(this.thrustPuck);
            }
        }
        for (let i = 0; i < this.rSeas.length; i++) {
            if (this.rSeas[i].userData.aabb == null || this.rSeas[i].userData.aabb.getSize(new Vector3).length() == 0) {
                this.rSeas[i].userData.aabb = ObjectHelper.getAabb(this.rSeas[i]);
            }
        }
        for (let i = 0; i < this.rVacs.length; i++) {
            if (this.rVacs[i].userData.aabb == null || this.rVacs[i].userData.aabb.getSize(new Vector3).length() == 0) {
                this.rVacs[i].userData.aabb = ObjectHelper.getAabb(this.rVacs[i]);
            }
        }
    }

    public updateObjects(): void {
        if (this.nosecone != null && this.shipRing != null && this.forwardL != null && this.forwardR != null && this.aftL != null && this.aftR != null && this.nosecone.userData.aabb.getSize(new Vector3).length() != 0 && this.shipRing.userData.aabb.getSize(new Vector3).length() != 0 && this.forwardL.userData.aabb.getSize(new Vector3).length() != 0 && this.forwardR.userData.aabb.getSize(new Vector3).length() != 0 && this.aftL.userData.aabb.getSize(new Vector3).length() != 0 && this.aftR.userData.aabb.getSize(new Vector3).length() != 0) {
            this.nosecone.position.copy(this.shipRing.position.clone().add(new Vector3(0, this.shipRing.userData.aabb.getSize(new Vector3).y, 0)));
            this.forwardL.position.copy(this.shipRing.position.clone().add(new Vector3(0, this.shipRing.userData.aabb.getSize(new Vector3).y, -StarshipConstants.STARSHIP_SCALE.z)));
            this.forwardR.position.copy(this.shipRing.position.clone().add(new Vector3(0, this.shipRing.userData.aabb.getSize(new Vector3).y, StarshipConstants.STARSHIP_SCALE.z)));
            this.aftL.position.copy(this.shipRing.position.clone().add(new Vector3(0, 0, -StarshipConstants.STARSHIP_SCALE.z)));
            this.aftR.position.copy(this.shipRing.position.clone().add(new Vector3(0, 0, StarshipConstants.STARSHIP_SCALE.z)));
            this.hasUpdatedAABB = true;
        }
    }

    public updateScene(delta: number): void {
        if (!this.hasSetupSingle) {
            this.setupSingle();
        }
        else {
            this.updateAABB();
            this.updateObjects();
        }
    }
}