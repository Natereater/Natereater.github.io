

function get_json(filename)
{
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://natereater.github.io/" + filename, false);
    xhr.send();
    if (xhr.status == 200)
    {
        return JSON.parse(xhr.responseText);
    }

    // let retrieved_json = await fetch("http://Natereater.github.io/" + filename);
}


function load_standings()
{

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

    
    console.log("Running load_standings()");

    let standings_table = document.getElementById("standings");
    let build_string = "<tr><th>PLACE</th><th>NAME</th><th>SCORE</th>";
    for (mission_type of MISSION_TYPES)
    {
        build_string += "<th>" + '<img src="drg_assets/images/' + mission_type + '_icon.webp" alt="'  + mission_type + '" width="40" height="40">' + "</th>";
    }
    build_string += "</tr>";

    const league_results = get_json('drg_assets/league_results.json');
    const personal_results = get_json("drg_assets/playable_team_results.json");
    console.log("league_results");
    console.log(league_results);
    console.log("personal_results");
    console.log(personal_results);
    console.log(personal_results["scores"]);

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
            if (all_participants[j]["cumulative_score"][N_RUNS] > max_score)
            {
                best = j;
                max_score = all_participants[j]["cumulative_score"][N_RUNS];
            }
        }

        sorted_participants.push(all_participants[best]);
        all_participants.splice(best, 1);
    }

    
    // populate the main rows
    for (let team = 0; team < sorted_participants.length; team++)
    {
        // Set standing number
        build_string += "<tr>";
        if (team == 0)
        {
            build_string += "<td>1</td>";
        }
        else if (sorted_participants[team - 1]["cumulative_score"][N_RUNS] > sorted_participants[team]["cumulative_score"][N_RUNS])
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

        for (mission_type of MISSION_TYPES)
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





function load_results()
{
    let FIELDS_LIST =["Score","Biome","Success","Length","Complexity","Hazard","Anomaly","Warning-1","Warning-2","Credits","Secondary","Time","Bonus Objectives"];
    let results_div = document.getElementById("results");
    let build_string = "";

    const league_results = get_json('drg_assets/league_results.json');
    const personal_results = get_json("drg_assets/playable_team_results.json");
    let N_RUNS = personal_results["scores"].length;

    let all_teams = [...league_results];
    all_teams.splice(0, 0, personal_results);


    for (each_team of all_teams)
    {
        // Mission Type,Biome,Success,Length,Complexity,Hazard,Anomaly,Warning-1,Warning-2,Credits,Secondary,Time,Bonus Objectives
        build_string += "<br><h4>" + each_team["name"] + "</h4><table><tr>";
        build_string += "<th>#</th>";
        build_string += "<th>Mission Type</th>";
        for (field of FIELDS_LIST)
        {
            build_string += "<th>" + field + "</th>";
        }
        build_string += "</tr>";

        for (let i = 0; i < N_RUNS; i++)
        {
            build_string += "<tr><td>" + String(i + 1) + "</td>";
            build_string += "<td style=\"text-align:center;\">" + '<img src="drg_assets/images/' + each_team["missions"][i]["Mission Type"] + '_icon.webp" alt="'  + each_team["missions"][i]["Mission Type"] + '" width="32" height="32">' + "</td>";
            for (field of FIELDS_LIST)
            {
                build_string += "<td>" + each_team["missions"][i][field] + "</td>";
            }
            build_string += "</tr>";
        }
        build_string += "</table>";
    }

    results_div.innerHTML = build_string;
}




window.onload = function() {
    load_standings();
    load_results();
  };