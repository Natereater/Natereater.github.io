import drg_scoring
import simulation_generator
import pandas as pd
import json

FILENAME = "drg_assets/playable_team_runs.csv"

TEAM_NAME = "The Drillbeards"


def jsonify_player_team_runs():
    df = pd.read_csv(FILENAME)

    final_json = {"name": TEAM_NAME,
                 "missions": [],
                 "scores": [],
                 "cumulative_score": [0]}
    
    for i, row in df.iterrows():
        this_mission = row.to_dict()
        this_score = drg_scoring.get_mission_score(row)
        this_mission["Score"] = this_score
        final_json["missions"].append(this_mission)

        final_json["scores"].append(this_score)
        current_cumulative_score = simulation_generator.get_cumulative_score(final_json["scores"])

        final_json["cumulative_score"].append(current_cumulative_score)
    
    with open('drg_assets/playable_team_results.json', 'w') as f:
            json.dump(final_json, f)

if __name__ == "__main__":
    jsonify_player_team_runs()