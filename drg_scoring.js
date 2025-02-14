


const NONE = "None"


// -----------------------------
//            MISSIONS
// -----------------------------
const MINING = "Mining Expedition"
const EGG_HUNT = "Egg Hunt"
const ON_SITE_REFINING = "On-Site Refining"
const SALVAGE_OPERATION = "Salvage Operation"
const POINT_EXTRACTION = "Point Extraction"
const ESCORT_DUTY = "Escort Duty"
const ELIMINATION = "Elimination"
const INDUSTRIAL_SABOTAGE = "Industrial Sabotage"
const DEEP_SCAN = "Deep Scan"

// type, length, complexity
const DIFFICULTIES = {
    MINING: {
        1: {
            1: 300 // 200 morkite
        },
        2: {
            1: 315, // 225 morkite
            2: 330  // 250 morkite
        },
        3: {
            2: 355, // 325 morkite
            3: 380  // 400 morkite
        }
    },

    EGG_HUNT: {
        1: {
            1: 300 // 4 eggs
        },
        2: {
            2: 340 // 6 eggs
        },
        3: {
            2: 375 // 8 eggs
        }
    },

    ON_SITE_REFINING: {
        2: {
            2: 350,
            3: 365
        }
    },

    SALVAGE_OPERATION: {
        2: {
            2: 340 // 2 mules
        },
        3: {
            3: 360 // 3 mules
        }
    },

    POINT_EXTRACTION: {
        2: {
            3: 335 // 7 aquarqs
        },
        3: {
            3: 370 // 10 aquarqs
        }
    },

    ESCORT_DUTY: {
        2: {
            2: 360, // 1 refuel
            3: 370  // 1 refuel
        },
        3: {
            2: 385, // 2 refuels
            3: 395  // 2 refuels
        }
    },

    ELIMINATION: {
        2: {
            2: 335 // 2 dreadnoughts
        },
        3: {
            3: 380 // 3 dreadnoughts
        }
    },

    INDUSTRIAL_SABOTAGE: {
        2: {
            1: 390, // 2 power stations
            2: 400  // 2 power stations
        }
    },

    DEEP_SCAN: {
        1: {
            2: 325 // 3 scans
        },
        2: {
            3: 350 // 5 scans
        }
    }
}



// type, length, complexity
const EXPECTED_TIME = {
    MINING: {
        1: {
            1: 16 // 200 morkite
        },
        2: {
            1: 18, // 225 morkite
            2: 20  // 250 morkite
        },
        3: {
            2: 25, // 325 morkite
            3: 30  // 400 morkite
        }
    },

    EGG_HUNT: {
        1: {
            1: 16 // 4 eggs
        },
        2: {
            2: 23 // 6 eggs
        },
        3: {
            2: 30 // 8 eggs
        }
    },

    ON_SITE_REFINING: {
        2: {
            2: 23,
            3: 27
        }
    },

    SALVAGE_OPERATION: {
        2: {
            2: 25 // 2 mules
        },
        3: {
            3: 28 // 3 mules
        }
    },

    POINT_EXTRACTION: {
        2: {
            3: 19 // 7 aquarqs
        },
        3: {
            3: 26 // 10 aquarqs
        }
    },

    ESCORT_DUTY: {
        2: {
            2: 27, // 1 refuel
            3: 29  // 1 refuel
        },
        3: {
            2: 35, // 2 refuels
            3: 37  // 2 refuels
        }
    },

    ELIMINATION: {
        2: {
            2: 23 // 2 dreadnoughts
        },
        3: {
            3: 31 // 3 dreadnoughts
        }
    },

    INDUSTRIAL_SABOTAGE: {
        2: {
            1: 34, // 2 power stations
            2: 38  // 2 power stations
        }
    },

    DEEP_SCAN: {
        1: {
            2: 21 // 3 scans
        },
        2: {
            3: 27 // 5 scans
        }
    }
}


// -----------------------------
//              BIOMES
// -----------------------------
const CRYSTALLINE_CAVERNS = "Crystalline Caverns"
const SALT_PITS = "Salt Pits"
const FUNGUS_BOGS = "Fungus Bogs"
const RADIOACTIVE_EXCLUSION_ZONE = "Radioactive Exclusion Zone"
const DENSE_BIOZONE = "Dense Biozone"
const GLACIAL_STRATA = "Glacial Strata"
const HOLLOW_BOUGH = "Hollow Bough"
const AZURE_WEALD = "Azure Weald"
const MAGMA_CORE = "Magma Core"
const SANDBLASTED_CORRIDORS = "Sandblasted Corridors"

const BIOME_DIFFICULTY = {
    CRYSTALLINE_CAVERNS: 2,
    SALT_PITS: 0,
    FUNGUS_BOGS: 11,
    RADIOACTIVE_EXCLUSION_ZONE: 9,
    DENSE_BIOZONE: 10,
    GLACIAL_STRATA: 16,
    HOLLOW_BOUGH: 13,
    AZURE_WEALD: 4,
    MAGMA_CORE: 21,
    SANDBLASTED_CORRIDORS: 6,
}


// -----------------------------
//            ANOMALIES
// -----------------------------
const BLOOD_SUGAR = "Blood Sugar"
const CRITICAL_WEAKNESS = "Critical Weakness"
const DOUBLE_XP = "Double XP"
const GOLD_RUSH = "Gold Rush"
const GOLDEN_BUGS = "Golden Bugs"
const LOW_GRAVITY = "Low Gravity"
const MINERAL_MANIA = "Mineral Mania"
const RICH_ATMOSPHERE = "Rich Atmosphere"
const SECRET_SECONDARY = "Secret Secondary"
const VOLATILE_GUTS = "Volatile Guts"


const ANOMALY_MULTIPLIERS = {
    BLOOD_SUGAR: 0.950,
    CRITICAL_WEAKNESS: 0.945,
    DOUBLE_XP: 1,
    GOLD_RUSH: 0.995,
    GOLDEN_BUGS: 0.985,
    LOW_GRAVITY: 0.970,
    MINERAL_MANIA: 1,
    RICH_ATMOSPHERE: 0.975,
    SECRET_SECONDARY: 0.995,
    VOLATILE_GUTS: 1.010,
    NONE: 1
}



// -----------------------------
//            WARNINGS
// -----------------------------
const CAVE_LEECH_CLUSTER = "Cave Leech Cluster"
const DUCK_AND_COVER= "Duck and Cover"
const EBONITE_OUTBREAK = "Ebonite Outbreak"
const ELITE_THREAT = "Elite Threat"
const EXPLODER_INFESTATION = "Exploder Infestation"
const HAUNTED_CAVE = "Haunted Cave"
const LETHAL_ENEMIES = "Lethal Enemies"
const LOW_OXYGEN = "Low Oxygen"
const MACTERA_PLAGUE = "Mactera Plague"
const PARASITES = "Parasites"
const REGENERATIVE_BUGS = "Regenerative Bugs"
const RIVAL_PRESENCE = "Rival Presence"
const SHIELD_DISRUPTION = "Shield Disruption"
const SWARMAGEDDON = "Swarmageddon"
const LITHOPHAGE_OUTBREAK = "Lithophage Outbreak"

const WARNING_MULTIPLIERS = {
    CAVE_LEECH_CLUSTER: 1.065,
    DUCK_AND_COVER: 1.125,
    EBONITE_OUTBREAK: 1.145,
    ELITE_THREAT: 1.160,
    EXPLODER_INFESTATION: 1.075,
    HAUNTED_CAVE: 1.215,
    LETHAL_ENEMIES: 1.185,
    LOW_OXYGEN: 1.195,
    MACTERA_PLAGUE: 1.090,
    PARASITES: 1.080,
    REGENERATIVE_BUGS: 1.045,
    RIVAL_PRESENCE: 1.170,
    SHIELD_DISRUPTION: 1.245,
    SWARMAGEDDON: 1.180,
    LITHOPHAGE_OUTBREAK: 1.170,
    NONE: 1
}



// -----------------------------
//        BONUS OBJECTIVES
// -----------------------------
const BONUS_OBJECTIVES = {
    "select_korlok": 67,
    "select_corruptor": 64,
    "select_betc": 27,
    "select_machine_event": 50,
    "select_core_stone": 54,
    "select_rock_cracker": 48,
    "select_data_cell": 35,
    "select_nemesis": 30,
    "select_doretta_head": 6
}


// -----------------------------
//        OTHER CONSTANTS
// -----------------------------
const SECONDARY_VALUE = 77
const PER_MINUTE_SCORE = 12
const BASE_TIME_SCORE = 300
const FAILURE_MULTIPLIER = 0
const CREDITS_PER_POINT = 20


// -----------------------------
//        GLOBAL VARS
// -----------------------------
var global_run_list = [];


function parse_time(time_string)
{
    const [minutes, seconds] = time_string.split(':').map(Number);
    return minutes + (seconds / 60);
}

function get_bonus_obj_score()
{
    let total_points = 0;
    for (const key in BONUS_OBJECTIVES) {
        if (document.getElementById(key).checked)
        {
            total_points += BONUS_OBJECTIVES[key];
        }
    }
    return total_points
}


function hazard_multiplier(hazard)
{
    return 1.5 ** (hazard - 1);
}


class RunList
{
    constructor()
    {
        this.all_runs = [];
    }

    add_run = function(run)
    {
        this.all_runs;
    }
}




class Run
{
    constructor()
    {
        this.mission_type = document.getElementById("select_mission_type").value;
        this.biome = document.getElementById("select_biome").value;
        this.success = document.getElementById("select_success").value == "true";
        this.length = parseInt(document.getElementById("select_length").value);
        this.complexity = parseInt(document.getElementById("select_complexity").value);
        this.hazard = parseFloat(document.getElementById("select_hazard").value);
        this.anomaly = document.getElementById("select_anomaly").value;
        this.warning_1 = document.getElementById("select_warning_1").value;
        this.warning_2 = document.getElementById("select_warning_2").value;
        this.time = parse_time(document.getElementById("enter_time").value);
        this.credits = parseInt(document.getElementById("enter_credits").value);
        this.secondary = document.getElementById("select_secondary").checked;
        this.bonus_obj = get_bonus_obj_score();

        this.score = this.get_score();
    }

    get_multiplier = function()
    {
        let multiplier = 1;

        // hazard
        multiplier *= hazard_multiplier(this.hazard);

        // anomaly
        multiplier *= ANOMALY_MULTIPLIERS[this.anomaly];

        //warnings
        multiplier *= WARNING_MULTIPLIERS[this.warning_1];
        multiplier *= WARNING_MULTIPLIERS[this.warning_2];

        // success vs failure
        if (!this.success)
        {
            multiplier *= FAILURE_MULTIPLIER;
        }

        return multiplier
    }

    get_additive_score = function()
    {
        let score = 0;

        // mission difficulty
        score += DIFFICULTIES[this.mission_type][this.length][this.complexity];
        
        // time completed
        let time_diff = EXPECTED_TIME[this.mission_type][this.length][this.complexity] - this.time;
        score += BASE_TIME_SCORE + (time_diff * PER_MINUTE_SCORE);

        // biome difficulty
        score += BIOME_DIFFICULTY[this.biome];

        // credits
        score += this.credits / CREDITS_PER_POINT;

        // secondary
        if (this.secondary)
        {
            score += SECONDARY_VALUE;
        }

        // bonus objectives
        score += this.bonus_obj

        return score

    }

    
    get_score = function()
    {
        return this.get_additive_score() * this.get_multiplier();
    }

    get_row_string = function()
    {
        build_string += "<tr>";
        build_string += '<td style="text-align:center;"><img src="drg_assets/images/' + this.mission_type + '_icon.webp" alt="'  + this.mission_type + '" width="32" height="32"></td>'
    }

}





// gets called when button pressed
function add_run()
{
    let new_run = new Run();

}