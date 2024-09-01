
// Source: Influence SDK - "src/lib/building.js"
const BUILDING_TYPE = {
    EMPTY_LOT: 0,
    WAREHOUSE: 1,
    EXTRACTOR: 2,
    REFINERY: 3,
    BIOREACTOR: 4,
    FACTORY: 5,
    SHIPYARD: 6,
    SPACEPORT: 7,
    MARKETPLACE: 8,
    HABITAT: 9,
    TANK_FARM: 10,
};

// Source: Influence SDK - "src/lib/crewmate.js"
const CLASS_IDS = {
    UNDECIDED: 0,
    PILOT: 1,
    ENGINEER: 2,
    MINER: 3,
    MERCHANT: 4,
    SCIENTIST: 5,
};

// Source: Influence SDK - "src/lib/crewmate.js"
const CLASS_NAMES_BY_ID = {
    [CLASS_IDS.UNDECIDED]: 'Undecided',
    [CLASS_IDS.PILOT]: 'Pilot',
    [CLASS_IDS.ENGINEER]: 'Engineer',
    [CLASS_IDS.MINER]: 'Miner',
    [CLASS_IDS.MERCHANT]: 'Merchant',
    [CLASS_IDS.SCIENTIST]: 'Scientist',
};  

// Source: Influence SDK - "src/lib/entity.js"
const ENTITY_IDS = {
    CREW: 1,
    CREWMATE: 2,
    ASTEROID: 3,
    LOT: 4,
    BUILDING: 5,
    SHIP: 6,
    DEPOSIT: 7,
    DELIVERY: 9,
    SPACE: 10,
};

// Source: Influence SDK - "src/lib/inventory.js"
const INVENTORY_IDS = {
    WAREHOUSE_SITE: 1,
    EXTRACTOR_SITE: 2,
    REFINERY_SITE: 3,
    BIOREACTOR_SITE: 4,
    FACTORY_SITE: 5,
    SHIPYARD_SITE: 6,
    SPACEPORT_SITE: 7,
    MARKETPLACE_SITE: 8,
    HABITAT_SITE: 9,
    WAREHOUSE_PRIMARY: 10,
    PROPELLANT_TINY: 11,
    PROPELLANT_SMALL: 12,
    PROPELLANT_MEDIUM: 13,
    PROPELLANT_LARGE: 14,
    CARGO_SMALL: 15,
    CARGO_MEDIUM: 16,
    CARGO_LARGE: 17,
    TANK_FARM_SITE: 18,
    TANK_FARM_PRIMARY: 19,
};

// Source: Influence SDK - "src/lib/inventory.js"
const INVENTORY_TYPES = {
    [INVENTORY_IDS.WAREHOUSE_SITE]: {
        // i: IDS.WAREHOUSE_SITE,
        name: 'Warehouse Site',
        massConstraint: Infinity,
        volumeConstraint: Infinity,
        // modifiable: false,
        // productConstraints: Process.TYPES[Process.IDS.WAREHOUSE_CONSTRUCTION].inputs,
        // category: CATEGORIES.SITE
    },
    [INVENTORY_IDS.EXTRACTOR_SITE]: {
        // i: IDS.EXTRACTOR_SITE,
        name: 'Extractor Site',
        massConstraint: Infinity,
        volumeConstraint: Infinity,
        // modifiable: false,
        // productConstraints: Process.TYPES[Process.IDS.EXTRACTOR_CONSTRUCTION].inputs,
        // category: CATEGORIES.SITE
    },
    [INVENTORY_IDS.REFINERY_SITE]: {
        // i: IDS.REFINERY_SITE,
        name: 'Refinery Site',
        massConstraint: Infinity,
        volumeConstraint: Infinity,
        // modifiable: false,
        // productConstraints: Process.TYPES[Process.IDS.REFINERY_CONSTRUCTION].inputs,
        // category: CATEGORIES.SITE
    },
    [INVENTORY_IDS.BIOREACTOR_SITE]: {
        // i: IDS.BIOREACTOR_SITE,
        name: 'Bioreactor Site',
        massConstraint: Infinity,
        volumeConstraint: Infinity,
        // modifiable: false,
        // productConstraints: Process.TYPES[Process.IDS.BIOREACTOR_CONSTRUCTION].inputs,
        // category: CATEGORIES.SITE
    },
    [INVENTORY_IDS.FACTORY_SITE]: {
        // i: IDS.FACTORY_SITE,
        name: 'Factory Site',
        massConstraint: Infinity,
        volumeConstraint: Infinity,
        // modifiable: false,
        // productConstraints: Process.TYPES[Process.IDS.FACTORY_CONSTRUCTION].inputs,
        // category: CATEGORIES.SITE
    },
    [INVENTORY_IDS.SHIPYARD_SITE]: {
        // i: IDS.SHIPYARD_SITE,
        name: 'Shipyard Site',
        massConstraint: Infinity,
        volumeConstraint: Infinity,
        // modifiable: false,
        // productConstraints: Process.TYPES[Process.IDS.SHIPYARD_CONSTRUCTION].inputs,
        // category: CATEGORIES.SITE
    },
    [INVENTORY_IDS.SPACEPORT_SITE]: {
        // i: IDS.SPACEPORT_SITE,
        name: 'Spaceport Site',
        massConstraint: Infinity,
        volumeConstraint: Infinity,
        // modifiable: false,
        // productConstraints: Process.TYPES[Process.IDS.SPACEPORT_CONSTRUCTION].inputs,
        // category: CATEGORIES.SITE
    },
    [INVENTORY_IDS.MARKETPLACE_SITE]: {
        // i: IDS.MARKETPLACE_SITE,
        name: 'Marketplace Site',
        massConstraint: Infinity,
        volumeConstraint: Infinity,
        // modifiable: false,
        // productConstraints: Process.TYPES[Process.IDS.MARKETPLACE_CONSTRUCTION].inputs,
        // category: CATEGORIES.SITE
    },
    [INVENTORY_IDS.HABITAT_SITE]: {
        // i: IDS.HABITAT_SITE,
        name: 'Habitat Site',
        massConstraint: Infinity,
        volumeConstraint: Infinity,
        // modifiable: false,
        // productConstraints: Process.TYPES[Process.IDS.HABITAT_CONSTRUCTION].inputs,
        // category: CATEGORIES.SITE
    },
    [INVENTORY_IDS.WAREHOUSE_PRIMARY]: {
        // i: IDS.WAREHOUSE_PRIMARY,
        name: 'Warehouse Storage',
        massConstraint: 1500000e6,
        volumeConstraint: 75000e6,
        // modifiable: true,
        // productConstraints: null,
        // category: CATEGORIES.PRIMARY
    },
    [INVENTORY_IDS.PROPELLANT_TINY]: {
        // i: IDS.PROPELLANT_TINY,
        name: 'Tiny Propellant Tank',
        massConstraint: 200e6,
        volumeConstraint: 2660e6,
        // modifiable: true,
        // productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 },
        // category: CATEGORIES.PROPELLANT
    },
    [INVENTORY_IDS.PROPELLANT_SMALL]: {
        // i: IDS.PROPELLANT_SMALL,
        name: 'Small Propellant Tank',
        massConstraint: 2000e6,
        volumeConstraint: 26600e6,
        // modifiable: true,
        // productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 },
        // category: CATEGORIES.PROPELLANT
    },
    [INVENTORY_IDS.PROPELLANT_MEDIUM]: {
        // i: IDS.PROPELLANT_MEDIUM,
        name: 'Medium Propellant Tank',
        massConstraint: 4000e6,
        volumeConstraint: 53200e6,
        // modifiable: true,
        // productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 },
        // category: CATEGORIES.PROPELLANT
    },
    [INVENTORY_IDS.PROPELLANT_LARGE]: {
        // i: IDS.PROPELLANT_LARGE,
        name: 'Large Propellant Tank',
        massConstraint: 24000e6,
        volumeConstraint: 319200e6,
        // modifiable: true,
        // productConstraints: { [Product.IDS.HYDROGEN_PROPELLANT]: 0 },
        // category: CATEGORIES.PROPELLANT
    },
    [INVENTORY_IDS.CARGO_SMALL]: {
        // i: IDS.CARGO_SMALL,
        name: 'Small Cargo Hold',
        massConstraint: 50e6,
        volumeConstraint: 125e6,
        // modifiable: true,
        // productConstraints: null,
        // category: CATEGORIES.PRIMARY
    },
    [INVENTORY_IDS.CARGO_MEDIUM]: {
        // i: IDS.CARGO_MEDIUM,
        name: 'Medium Cargo Hold',
        massConstraint: 2000e6,
        volumeConstraint: 5000e6,
        // modifiable: true,
        // productConstraints: null,
        // category: CATEGORIES.PRIMARY
    },
    [INVENTORY_IDS.CARGO_LARGE]: {
        // i: IDS.CARGO_LARGE,
        name: 'Large Cargo Hold',
        massConstraint: 12000e6,
        volumeConstraint: 30000e6,
        // modifiable: true,
        // productConstraints: null,
        // category: CATEGORIES.PRIMARY
    },
    [INVENTORY_IDS.TANK_FARM_SITE]: {
        // i: IDS.TANK_FARM_SITE,
        name: 'Tank Farm Site',
        massConstraint: Infinity,
        volumeConstraint: Infinity,
        // modifiable: false,
        // productConstraints: Process.TYPES[Process.IDS.TANK_FARM_CONSTRUCTION].inputs,
        // category: CATEGORIES.SITE
    },
    [INVENTORY_IDS.TANK_FARM_PRIMARY]: {
        // i: IDS.TANK_FARM_PRIMARY,
        name: 'Tank Farm Storage',
        massConstraint: 75000e6,
        volumeConstraint: 997500e6,
        // modifiable: true,
        // productConstraints: {
        //     [Product.IDS.WATER]: 0,
        //     [Product.IDS.HYDROGEN]: 0,
        //     [Product.IDS.AMMONIA]: 0,
        //     [Product.IDS.NITROGEN]: 0,
        //     [Product.IDS.SULFUR_DIOXIDE]: 0,
        //     [Product.IDS.CARBON_DIOXIDE]: 0,
        //     [Product.IDS.CARBON_MONOXIDE]: 0,
        //     [Product.IDS.METHANE]: 0,
        //     [Product.IDS.OXYGEN]: 0,
        //     [Product.IDS.DEIONIZED_WATER]: 0,
        //     [Product.IDS.NAPHTHA]: 0,
        //     [Product.IDS.ACETYLENE]: 0,
        //     [Product.IDS.PROPYLENE]: 0,
        //     [Product.IDS.SILICA_POWDER]: 0,
        //     [Product.IDS.ACRYLONITRILE]: 0,
        //     [Product.IDS.CHLORINE]: 0,
        //     [Product.IDS.FLUORINE]: 0,
        //     [Product.IDS.TUNGSTEN_POWDER]: 0,
        //     [Product.IDS.HYDROGEN_PROPELLANT]: 0,
        //     [Product.IDS.PURE_NITROGEN]: 0,
        //     [Product.IDS.UNENRICHED_URANIUM_HEXAFLUORIDE]: 0,
        //     [Product.IDS.HIGHLY_ENRICHED_URANIUM_HEXAFLUORIDE]: 0,
        //     [Product.IDS.NEON]: 0
        // },
        // category: CATEGORIES.PRIMARY
    }
};
