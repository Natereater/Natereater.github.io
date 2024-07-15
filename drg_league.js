
const MISSION_TYPES = [
    "Mining Expedition",
    "Egg Hunt",
    "On-Site Refining",
    "Salvage Operation",
    "Point Extraction",
    "Escort Duty",
    "Elimination",
    "Industrial Sabotage",
    "Deep Scan"
];


async function get_json(filename)
{
    let retrieved_json = await fetch("http://Natereater.github.io/" + filename);
    return await retrieved_json.json();
}


function load_standings()
{
    
    console.log("Running load_standings()");
    console.log(this.MISSION_TYPES);


    let standings_table = document.getElementById("standings");
    let build_string = "<tr><th>PLACE</th><th>NAME</th><th>SCORE</th>";
    for (mission_type of this.MISSION_TYPES)
    {
        build_string += "<th>" + mission_type + "</th>";
    }
    build_string += "</tr>";

    const league_results = get_json('drg_assets/league_results.json');
    const personal_results = get_json("drg_assets/playable_team_results.json");
    console.log("league_results");
    console.log(league_results);
    console.log("personal_results");
    console.log(personal_results);

    let N_RUNS = personal_results["scores"].length;

    let all_participants = [...league_results];
    all_participants.push(personal_results);

    let sorted_participants = [];


    // sort teams
    while(all_participants.length > 0)
    {
        let best = 0;
        let max_score = 0;
        for (let j = 0; j < all_participants.length; j++)
        {
            if (all_participants["cumulative_score"][N_RUNS] > max_score)
            {
                best = j;
                max_score = all_participants["cumulative_score"][N_RUNS];
            }
        }

        sorted_participants.push(all_participants[best]);
        all_participants.splice(best, 1);
    }

    
    // populate the main rows
    for (let team = 0; team < all_participants.length; team++)
    {
        // Set standing number
        build_string += "<tr>";
        if (team > 0 && sorted_participants[team - 1]["cumulative_score"][N_RUNS] > sorted_participants[team]["cumulative_score"][N_RUNS])
        {
            build_string += "<td>" + String(team + 1) + "</td>";
        }
        else
        {
            build_string += "<td></td>";
        }

        // name and score
        build_string += "<td>" + sorted_participants[team]["name"] + "</td>";
        build_string += "<td>" + sorted_participants[team]["cumulative_score"][N_RUNS] + "</td>";
        
        // mission scores
        const first_n_missions = [...sorted_participants[team]["missions"]].slice(0, N_RUNS);
        let mission_list = {};
        for (each_mission of first_n_missions)
        {
            mission_list[each_mission["Mission Type"]] = each_mission;
        }

        for (mission_type of this.MISSION_TYPES)
        {
            if (mission_type in mission_list)
            {
                build_string += "<td>" + mission_list[mission_type]["Score"] + "</td>";
            }
            else
            {
                build_string += "<td></td>";
            }
        }

        build_string += "</tr>";
    }


    standings_table.innerHTML = build_string;
    console.log("Done with load_standings()");
}




window.onload = function() {
    load_standings();
  };