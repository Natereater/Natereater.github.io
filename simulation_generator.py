import pandas as pd
import drg_scoring
import json
import sys
import random


# SIMULATION SUCCESS PROBABILITY
# percent_chance = 102 - 2 ^ (score / p_value) + score / (p_value / 2)
# p_value should be between 500 and 2500
# desmos: y=102\ -\ 2^{\frac{x}{c}}+\frac{x}{\frac{c}{2}}

class LeagueName:
    DIRT_DIGGERS = ("The Dirt Diggers League", "DDL")
    CAVE_CRAWLERS = ("The Cave Crawlers League", "CCL")
    MIGHTY_MINERS = ("The Mighty Miners League", "MML")
    IMU_CHAMPS = ("The Interplanetary Miners Union Championships", "IMUC")
    HOXXES_CHALLENGERS = ("The Hoxxes Challengers League", "HCL")
    FORTMOON = ("The Fortmoon League", "14ML")
    CREUS_CHAMPS = ("The Creus Championship Series", "CCS")


BONUS_OBJECTIVE_PROB = 0.15
ANOMALY_PROB = 0.1

SAVE_TO = 'drg_assets/league_results.json'
SAVE_TO = 'drg_assets/temp_results.json'


def get_hazard(haz, haz_dev) -> float:
    base = haz + (random.random() * 2 - 1) * haz_dev

    if base < 1.5:
        return 1
    elif base < 2.5:
        return 2
    elif base < 3.5:
        return 3
    elif base < 4.5:
        return 4
    elif base < 5.125:
        return 5
    elif base < 5.375:
        return 5.25
    elif base < 5.625:
        return 5.5
    elif base < 5.875:
        return 5.75
    elif base < 6.125:
        return 6
    elif base < 6.375:
        return 6.25
    elif base < 6.625:
        return 6.5
    elif base < 6.875:
        return 6.75
    else:
        return 7


# Best 5 scores + 1/2 of 6th best score and 1/4 of 7th best
def get_cumulative_score(scores) -> int:
    copy_of_scores: list = scores.copy()
    copy_of_scores.sort(reverse=True)

    i = 0
    cumulative = 0
    while i < 5 and i < len(copy_of_scores):
        cumulative += copy_of_scores[i]
        i += 1
    
    if len(copy_of_scores) >= 6:
        cumulative += 0.5 * copy_of_scores[5]
    
    if len(copy_of_scores) >= 7:
        cumulative += 0.25 * copy_of_scores[6]
    
    return int(cumulative)



class League:
    
    def __init__(self, league_name):
        self.league_name = league_name
        random.seed()
        
        all_teams = pd.read_csv("drg_assets/all_league_teams.csv")
        self.league_teams: pd.DataFrame = all_teams[all_teams["league"] == league_name]
    

    def generate_league_results(self):
        
        final_json = []

        for i, row in self.league_teams.iterrows():
            current_team = {}

            current_team["name"] = row["name"]
            current_team["missions"] = []
            current_team["cumulative_score"] = [0]
            current_team["scores"] = []

            # Shuffled order of missions
            shuffled_missions = drg_scoring.MissionType.ALL_LIST.copy()
            random.shuffle(shuffled_missions)

            # Fill out all 9 missions
            for mission_type in shuffled_missions:
                current_mission = {}

                # =============
                # BUILD THE MISSION
                current_mission["Mission Type"] = mission_type
                current_mission["Biome"] = drg_scoring.Biome.ALL_LIST[random.randint(0, len(drg_scoring.Biome.ALL_LIST) - 1)]

                options = drg_scoring.MissionType.OPTIONS_PER_TYPE[mission_type]
                picked_option = options[random.randint(0, len(options) - 1)]

                current_mission["Length"] = picked_option[0]
                current_mission["Complexity"] = picked_option[1]

                current_mission["Hazard"] = get_hazard(row["haz"], row["haz_dev"])

                if random.random() < ANOMALY_PROB:
                    current_mission["Anomaly"] = drg_scoring.Anomaly.ALL_LIST[random.randint(0, len(drg_scoring.Anomaly.ALL_LIST) - 1)]
                else:
                    current_mission["Anomaly"] = "None"

                if random.random() < row["warning_prob"]:
                    current_mission["Warning-1"] = drg_scoring.Warning.ALL_LIST[random.randint(0, len(drg_scoring.Warning.ALL_LIST) - 1)]
                else:
                    current_mission["Warning-1"] = "None"

                if random.random() < row["warning_prob"]:
                    current_mission["Warning-2"] = drg_scoring.Warning.ALL_LIST[random.randint(0, len(drg_scoring.Warning.ALL_LIST) - 1)]
                else:
                    current_mission["Warning-2"] = "None"

                time = drg_scoring.MissionType.EXPECTED_TIME[(mission_type, current_mission["Length"], current_mission["Complexity"])]
                time += row["time_diff"] + (random.random() * 2 - 1) * row["time_dev"]

                current_mission["Time"] = str(int(time)) + ":" + str(int((time - float(int(time))) * 60))
                current_mission["Credits"] = int(row["credits"] + ((random.random() * 2 - 1) * row["credits_dev"]))

                current_mission["Secondary"] = "False"
                if random.random() < row["secondary_prob"]:
                    current_mission["Secondary"] = "True"
                
                current_mission["Success"] = "True"

                current_mission["Bonus Objectives"] = "None"
                if random.random() < BONUS_OBJECTIVE_PROB:
                    # Can't be None or Doretta Head
                    current_mission["Bonus Objectives"] = list(drg_scoring.BONUS_OBJECTIVES.keys())[random.randint(0,len(drg_scoring.BONUS_OBJECTIVES.keys()) - 3)]
                
                # =============
                # SCORING

                score = drg_scoring.get_mission_score(pd.Series(current_mission))

                # determine whether this is a success
                # percent_chance = 102 - 2 ^ (score / p_value) + score / (p_value / 2)
                percent_success = 102 - 2 ** (score / row["p_value"]) + score / (row["p_value"] / 2)
                if random.random() * 100 > percent_success:
                    current_mission["Success"] = "False"
                    score = 0
                
                current_mission["Score"] = score

                current_team["scores"].append(score)
                current_team["cumulative_score"].append(get_cumulative_score(current_team["scores"]))
                current_team["missions"].append(current_mission)
            
            final_json.append(current_team)
        
        with open(SAVE_TO, 'w') as f:
            json.dump(final_json, f)



if __name__ == "__main__":
    if len(sys.argv) > 1:
        league = League(sys.argv[1])
        league.generate_league_results()
    else:
        print("requires a parameter of league name")
    









