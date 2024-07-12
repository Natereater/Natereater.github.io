import pandas
from colorama import Fore
import pandas as pd
from tabulate import tabulate
import sys


class Biome:
    """
    The biome which the Deep Dive variant takes place in.
    """
    CRYSTALLINE_CAVERNS = "Crystalline Caverns"
    SALT_PITS = "Salt Pits"
    FUNGUS_BOGS = "Fungus Bogs"
    RADIOACTIVE_EXCLUSION_ZONE = "Radioactive Exclusion Zone"
    DENSE_BIOZONE = "Dense Biozone"
    GLACIAL_STRATA = "Glacial Strata"
    HOLLOW_BOUGH = "Hollow Bough"
    AZURE_WEALD = "Azure Weald"
    MAGMA_CORE = "Magma Core"
    SANDBLASTED_CORRIDORS = "Sandblasted Corridors"

    ALL_LIST = [CRYSTALLINE_CAVERNS, SALT_PITS, FUNGUS_BOGS, RADIOACTIVE_EXCLUSION_ZONE, DENSE_BIOZONE, 
                GLACIAL_STRATA, HOLLOW_BOUGH, AZURE_WEALD, MAGMA_CORE, SANDBLASTED_CORRIDORS]

    DIFFICULTIES = {
        CRYSTALLINE_CAVERNS: 3,
        SALT_PITS: 0,
        FUNGUS_BOGS: 12,
        RADIOACTIVE_EXCLUSION_ZONE: 10,
        DENSE_BIOZONE: 11,
        GLACIAL_STRATA: 17,
        HOLLOW_BOUGH: 13,
        AZURE_WEALD: 4,
        MAGMA_CORE: 23,
        SANDBLASTED_CORRIDORS: 5,
    }

    BIOMES_COLORS = {
        'Fungus Bogs': Fore.LIGHTGREEN_EX,
        'Hollow Bough': Fore.RED,
        'Crystalline Caverns': Fore.LIGHTMAGENTA_EX,
        'Glacial Strata': Fore.LIGHTBLUE_EX,
        'Salt Pits': Fore.LIGHTRED_EX,
        'Dense Biozone': Fore.CYAN,
        'Radioactive Exclusion Zone': Fore.GREEN,
        'Magma Core': Fore.YELLOW,
        'Sandblasted Corridors': Fore.LIGHTYELLOW_EX,
        'Azure Weald': Fore.MAGENTA
    }




class Anomaly:
    """
    An anomaly that can appear in a Deep Dive stage.
    """
    BLOOD_SUGAR = "Blood Sugar"
    CRITICAL_WEAKNESS = "Critical Weakness"
    DOUBLE_XP = "Double XP"
    GOLD_RUSH = "Gold Rush"
    GOLDEN_BUGS = "Golden Bugs"
    LOW_GRAVITY = "Low Gravity"
    MINERAL_MANIA = "Mineral Mania"
    RICH_ATMOSPHERE = "Rich Atmosphere"
    SECRET_SECONDARY = "Secret Secondary"
    VOLATILE_GUTS = "Volatile Guts"
    NONE = "None"

    ALL_LIST = [BLOOD_SUGAR, CRITICAL_WEAKNESS, DOUBLE_XP, GOLD_RUSH, GOLDEN_BUGS, 
                LOW_GRAVITY, MINERAL_MANIA, RICH_ATMOSPHERE, SECRET_SECONDARY, VOLATILE_GUTS]

    DIFFICULTIES = {
        BLOOD_SUGAR: 0.950,
        CRITICAL_WEAKNESS: 0.945,
        DOUBLE_XP: 1,
        GOLD_RUSH: 0.995,
        GOLDEN_BUGS: 0.985,
        LOW_GRAVITY: 0.970,
        MINERAL_MANIA: 1,
        RICH_ATMOSPHERE: 0.975,
        SECRET_SECONDARY: 1,
        VOLATILE_GUTS: 1.010,
        NONE: 1
    }


class Warning:
    """
    A warning that can appear in a Deep Dive stage.
    """
    CAVE_LEECH_CLUSTER = "Cave Leech Cluster"
    DUCK_AND_COVER= "Duck and Cover"
    EBONITE_OUTBREAK = "Ebonite Outbreak"
    ELITE_THREAT = "Elite Threat"
    EXPLODER_INFESTATION = "Exploder Infestation"
    HAUNTED_CAVE = "Haunted Cave"
    LETHAL_ENEMIES = "Lethal Enemies"
    LOW_OXYGEN = "Low Oxygen"
    MACTERA_PLAGUE = "Mactera Plague"
    PARASITES = "Parasites"
    REGENERATIVE_BUGS = "Regenerative Bugs"
    RIVAL_PRESENCE = "Rival Presence"
    SHIELD_DISRUPTION = "Shield Disruption"
    SWARMAGEDDON = "Swarmageddon"
    LITHOPHAGE_OUTBREAK = "Lithophage Outbreak"
    NONE = "None"

    ALL_LIST = [CAVE_LEECH_CLUSTER, DUCK_AND_COVER, EBONITE_OUTBREAK, ELITE_THREAT, EXPLODER_INFESTATION, 
                HAUNTED_CAVE, LETHAL_ENEMIES, LOW_OXYGEN, MACTERA_PLAGUE, PARASITES, REGENERATIVE_BUGS, 
                RIVAL_PRESENCE, SHIELD_DISRUPTION, SWARMAGEDDON, LITHOPHAGE_OUTBREAK]

    DIFFICULTIES = {
        CAVE_LEECH_CLUSTER: 1.065,
        DUCK_AND_COVER: 1.125,
        EBONITE_OUTBREAK: 1.145,
        ELITE_THREAT: 1.160,
        EXPLODER_INFESTATION: 1.075,
        HAUNTED_CAVE: 1.220,
        LETHAL_ENEMIES: 1.185,
        LOW_OXYGEN: 1.200,
        MACTERA_PLAGUE: 1.090,
        PARASITES: 1.080,
        REGENERATIVE_BUGS: 1.045,
        RIVAL_PRESENCE: 1.170,
        SHIELD_DISRUPTION: 1.245,
        SWARMAGEDDON: 1.175,
        LITHOPHAGE_OUTBREAK: 1.175,
        NONE: 1
    }




class MissionType:
    """
    The Mission type
    https://deeprockgalactic.fandom.com/wiki/Missions
    """
    MINING = "Mining Expedition"
    EGG_HUNT = "Egg Hunt"
    ON_SITE_REFINING = "On-Site Refining"
    SALVAGE_OPERATION = "Salvage Operation"
    POINT_EXTRACTION = "Point Extraction"
    ESCORT_DUTY = "Escort Duty"
    ELIMINATION = "Elimination"
    INDUSTRIAL_SABOTAGE = "Industrial Sabotage"
    DEEP_SCAN = "Deep Scan"

    ALL_LIST = [MINING, EGG_HUNT, ON_SITE_REFINING, SALVAGE_OPERATION, POINT_EXTRACTION,
                ESCORT_DUTY, ELIMINATION, INDUSTRIAL_SABOTAGE, DEEP_SCAN]


    DIFFICULTIES = {
        (MINING, 1, 1): 295, # 200 morkite
        (MINING, 2, 1): 315, # 225 morkite
        (MINING, 2, 2): 330, # 250 morkite
        (MINING, 3, 2): 360, # 325 morkite
        (MINING, 3, 3): 390, # 400 morkite

        (EGG_HUNT, 1, 1): 295, # 4 eggs
        (EGG_HUNT, 2, 2): 340, # 6 eggs
        (EGG_HUNT, 3, 2): 375, # 8 eggs

        (ON_SITE_REFINING, 2, 2): 350,
        (ON_SITE_REFINING, 2, 3): 370,

        (SALVAGE_OPERATION, 2, 2): 340,  # 2 mules
        (SALVAGE_OPERATION, 3, 3): 365,  # 3 mules

        (POINT_EXTRACTION, 2, 3): 335,  # 7 aquarqs
        (POINT_EXTRACTION, 3, 3): 375,  # 10 aquarqs

        (ESCORT_DUTY, 2, 2): 360,  # 1 refuel
        (ESCORT_DUTY, 2, 3): 370,  # 1 refuel
        (ESCORT_DUTY, 3, 2): 395,  # 2 refuels
        (ESCORT_DUTY, 3, 3): 405,  # 2 refuels

        (ELIMINATION, 2, 2): 335,  # 2 Dreadnoughts
        (ELIMINATION, 3, 3): 385,  # 3 Dreadnoughts

        (INDUSTRIAL_SABOTAGE, 2, 1): 405,  # 2 power stations
        (INDUSTRIAL_SABOTAGE, 2, 2): 430,  # 2 power stations

        (DEEP_SCAN, 1, 2): 325,  # 3 scans
        (DEEP_SCAN, 2, 3): 355,  # 5 scans
    }



    OPTIONS_PER_TYPE = {
        MINING: [(1,1), (2,1), (2,2), (3,2), (3,3)],
        EGG_HUNT: [(1,1), (2,2), (3,2)],
        ON_SITE_REFINING: [(2,2), (2,3)],
        SALVAGE_OPERATION: [(2,2), (3,3)],
        POINT_EXTRACTION: [(2,3), (3,3)],
        ESCORT_DUTY: [(2,2), (2,3), (3,2), (3,3)],
        ELIMINATION: [(2,2), (3,3)],
        INDUSTRIAL_SABOTAGE: [(2,1), (2,2)],
        DEEP_SCAN: [(1,2), (2,3)]
    }


    EXPECTED_TIME = {
        (MINING, 1, 1): 16,  # 200 morkite
        (MINING, 2, 1): 18,  # 225 morkite
        (MINING, 2, 2): 20,  # 250 morkite
        (MINING, 3, 2): 25,  # 325 morkite
        (MINING, 3, 3): 30,  # 400 morkite

        (EGG_HUNT, 1, 1): 16,  # 4 eggs
        (EGG_HUNT, 2, 2): 23,  # 6 eggs
        (EGG_HUNT, 3, 2): 30,  # 8 eggs

        (ON_SITE_REFINING, 2, 2): 23,
        (ON_SITE_REFINING, 2, 3): 27,

        (SALVAGE_OPERATION, 2, 2): 25,  # 2 mules
        (SALVAGE_OPERATION, 3, 3): 28,  # 3 mules

        (POINT_EXTRACTION, 2, 3): 19,  # 7 aquarqs
        (POINT_EXTRACTION, 3, 3): 26,  # 10 aquarqs

        (ESCORT_DUTY, 2, 2): 27,  # 1 refuel
        (ESCORT_DUTY, 2, 3): 29,  # 1 refuel
        (ESCORT_DUTY, 3, 2): 35,  # 2 refuels
        (ESCORT_DUTY, 3, 3): 37,  # 2 refuels

        (ELIMINATION, 2, 2): 23,  # 2 Dreadnoughts
        (ELIMINATION, 3, 3): 31,  # 3 Dreadnoughts

        (INDUSTRIAL_SABOTAGE, 2, 1): 34,  # 2 power stations
        (INDUSTRIAL_SABOTAGE, 2, 2): 38,  # 2 power stations

        (DEEP_SCAN, 1, 2): 21,  # 3 scans
        (DEEP_SCAN, 2, 3): 27,  # 5 scans
    }



SECONDARY_VALUE = 77

BONUS_OBJECTIVES = {
    "Korlok": 67,
    "Corruptor": 62,
    "BETC": 27,
    "Machine Event": 50,
    "Core Stone": 52,
    "Rock Cracker": 48,
    "Data Cell": 35,
    "Nemesis": 30,
    "Doretta Head": 6,
    "None": 0
}


PER_MINUTE_SCORE = 12
BASE_TIME_ACHIEVEMENT_SCORE = 300

FAILURE_MULTIPLIER = 0

CREDITS_PER_POINT = 20

# Format for the file (order doesn't matter):
# Mission Type,Biome,Success,Length,Complexity,Hazard,Time,Anomaly,Warning-1,Warning-2,Credits,Secondary,Bonus Objectives
# eg
# Egg Hunt,Fungus Bogs,True,1,1,5.25,15:32,None,Parasites-Duck and Cover,5870,True,Machine Event-Core Stone


def get_mission_score(mission: pd.Series) -> int:
    base_score = 0
    multiplier = 1.0

    # ===============================
    # BASE SCORE
    # ===============================
    base_score += MissionType.DIFFICULTIES[(mission["Mission Type"], mission["Length"], mission["Complexity"])]
    base_score += Biome.DIFFICULTIES[mission["Biome"]]

    if str(mission["Secondary"]).lower() == "true":
        base_score += SECONDARY_VALUE

    for element in mission["Bonus Objectives"].split("-"):
        base_score += BONUS_OBJECTIVES[element]

    # Time Score
    # lose PER_MINUTE_SCORE from BASE_TIME_ACHIEVEMENT_SCORE for every
    # minute behind expected time (can also earn more for being faster than expected)
    base_time = MissionType.EXPECTED_TIME[(mission["Mission Type"], mission["Length"], mission["Complexity"])]
    min_and_sec = mission["Time"].split(":")
    mission_minutes = int(min_and_sec[0]) + (int(min_and_sec[1]) / 60)

    time_difference = base_time - mission_minutes
    time_score = BASE_TIME_ACHIEVEMENT_SCORE + (PER_MINUTE_SCORE * time_difference)
    if time_score < -50:
        time_score = -50
    base_score += time_score

    # 1/20th of the credits
    base_score += mission["Credits"] / CREDITS_PER_POINT


    # ===============================
    # MULTIPLIER
    # ===============================
    multiplier *= Anomaly.DIFFICULTIES[mission["Anomaly"]]
    multiplier *= Warning.DIFFICULTIES[mission["Warning-1"]]
    multiplier *= Warning.DIFFICULTIES[mission["Warning-2"]]

    # Set to 0 if failure, no points
    if str(mission["Success"]).lower() == "false":
        multiplier *= FAILURE_MULTIPLIER

    # biggest effect on multiplier is 1.5 ^ (haz - 1)
    multiplier *= 1.5 ** (mission["Hazard"] - 1)

    return int(base_score * multiplier)



def get_dataframe_scores(df: pd.DataFrame) -> pd.DataFrame:
    missions = []
    biomes = []
    hazards = []
    times = []
    successes = []
    scores = []

    for i, row in df.iterrows():
        missions.append(row["Mission Type"])
        biomes.append(row["Biome"])
        hazards.append(row["Hazard"])
        times.append(row["Time"])
        successes.append(row["Success"])

        scores.append(get_mission_score(row))

    return pd.DataFrame({
        "Mission Type": missions,
        "Biome": biomes,
        "Hazard": hazards,
        "Time": times,
        "Success": successes,
        "Score": scores
    })




def display_scores(filename: str) -> str:
    df = pandas.read_csv(filename)
    scored_df = get_dataframe_scores(df)
    return tabulate(scored_df, headers='keys', tablefmt='fancy_grid')


def get_scores_from_csv(filename: str) -> pd.DataFrame:
    df = pandas.read_csv(filename)
    return get_dataframe_scores(df)


def main():
    if len(sys.argv) > 1:
        print(display_scores(sys.argv[1]))
    else:
        print("requires a parameter of csv filename")



if __name__ == "__main__":
    main()