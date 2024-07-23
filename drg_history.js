

function get_json(filename)
{
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://natereater.github.io/" + filename, false);
    xhr.send();
    if (xhr.status == 200)
    {
        return JSON.parse(xhr.responseText);
    }
}





function load_results()
{
    let FIELDS_LIST =["Score","Biome","Success","Length","Complexity","Hazard","Anomaly","Warning-1","Warning-2","Credits","Secondary","Time","Bonus Objectives"];
    let results_div = document.getElementById("results");
    let build_string = "";

    let history = get_json("drg_assets/history.json");
    console.log(history);
    let N_RUNS = history.length;


    // Mission Type,Biome,Success,Length,Complexity,Hazard,Anomaly,Warning-1,Warning-2,Credits,Secondary,Time,Bonus Objectives
    build_string += "<table><tr>";
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
        build_string += "<td style=\"text-align:center;\">" + '<img src="drg_assets/images/' + history[i]["Mission Type"] + '_icon.webp" alt="'  + history[i]["Mission Type"] + '" width="32" height="32">' + "</td>";
        for (field of FIELDS_LIST)
        {
            if (field == "Length")
            {
                build_string += "<td style=\"text-align:center;\">" + '<img src="drg_assets/images/length_' + String(history[i]["Length"]) + '.webp" alt="'  + String(history[i]["Length"]) + '" width="60" height="24">' + "</td>";
            }
            else if (field == "Complexity")
            {
                build_string += "<td style=\"text-align:center;\">" + '<img src="drg_assets/images/complexity_' + String(history[i]["Complexity"]) + '.webp" alt="'  + String(history[i]["Complexity"]) + '" width="60" height="24">' + "</td>";
            }
            else
            {
                build_string += "<td>" + history[i][field] + "</td>";
            }
        }
        build_string += "</tr>";
    }
    build_string += "</table>";

    results_div.innerHTML = build_string;
}




window.onload = function() {
    load_results();
  };