
const INT_MAX = 2147000000;
const BYE = "##$!BYE##$!";

const WIN_COLOR = "#EFB34C";
const LOSS_COLOR = "#194A40";

const WIN_TEXT = "#70490A";
const LOSS_TEXT = "white";

const SELECT_CLASS = "selected";
const UNSELECTED_CLASS = "unselected";


// Main tourney for page
var main_tourney = null;





// Moves tape for round robin scheduling algorithm
function array_leave_one_out_vtape(array)
{
    let last = array[array.length - 1];
    for (let i = array.length - 1; i > 1; i--)
    {
        array[i] = array[i - 1];
    }
    array[1] = last;

    return array;
}





class Tourney 
{
    constructor(participants, rounds)
    {
        this.participants = participants;
        this.wins = new Map();
        this.losses = new Map();
        this.rounds = rounds;

        for (let i = 0; i < this.participants.length; i++)
        {
            this.wins.set(this.participants[i], 0);
            this.losses.set(this.participants[i], 0);
        }
    }

    // Update the standings table
    set_standings = function()
    {
        let standings_table = document.getElementById("standings");
        let build_string = "<tr><th>Place</th><th>Name</th><th>Wins</th><th>Losses</th></tr>";
        let sorted_participants = [];
        let temp_participants = [...this.participants];

        while(temp_participants.length > 0)
        {
            let best = 0;
            let max_wins = 0;
            let losses = INT_MAX;
            for (let j = 0; j < temp_participants.length; j++)
            {
                if (this.wins.get(temp_participants[j]) > max_wins || 
                    (this.wins.get(temp_participants[j]) == max_wins && 
                    this.losses.get(temp_participants[j]) < losses))
                {
                    best = j;
                    max_wins = this.wins.get(temp_participants[j]);
                    losses = this.losses.get(temp_participants[j]);
                }
            }

            sorted_participants.push(temp_participants[best]);
            temp_participants.splice(best, 1);
        }


        let placements = [];
        for (let i = 0; i < sorted_participants.length; i++)
        {
            placements[i] = 0;
        }
        placements[0] = 1;
    
        for (let i = 0; i < sorted_participants.length; i++)
        {
            build_string += "<tr>";
            if (i > 0 && 
                this.wins.get(sorted_participants[i]) == this.wins.get(sorted_participants[i - 1])
                && this.losses.get(sorted_participants[i]) == this.losses.get(sorted_participants[i - 1]))
            {
                placements[i] = placements[i - 1];
            }
            else
            {
                placements[i] = (i + 1);
            }

            build_string += "<td>" + placements[i] + "</td>";
            build_string += "<td>" + sorted_participants[i] + "</td>";
            build_string += "<td>" + this.wins.get(sorted_participants[i]) + "</td>";
            build_string += "<td>" + this.losses.get(sorted_participants[i]) + "</td>";
            build_string += "</tr>";
        }
    
        standings_table.innerHTML = build_string;
    }





    // Update the list of matches
    set_matches = function()
    {
        let matches_div = document.getElementById("matches_div");
        let temp_participants = [...this.participants];

        // If odd number of participants, add a bye
        if(temp_participants.length % 2 == 1)
        {
            temp_participants.push(BYE);
        }
        
        let string_builder = "";


        for (let round = 0; round < this.rounds; round++)
        {
            for(let subround = 0; subround < temp_participants.length - 1; subround++)
            {
                // start new subround in stringbuilder
                string_builder += "<h3>Round #" + (subround + 1 + round * (temp_participants.length - 1)) + "</h3><table>" + 
                "<tr><th class=\"white\"></th><th></th><th class=\"black\"></tr>";

                for (let match = 0; match < temp_participants.length / 2; match++)
                {
                    // get 2 participants
                    let first = temp_participants[match];
                    let second = temp_participants[(temp_participants.length - 1) - match];
                    
                    // swap on odd rounds to get alternating ordering
                    if (round % 2 == 1)
                    {
                        let third = first;
                        first = second;
                        second = third;
                    }

                    // swap first match on even subrounds
                    if (match == 0 && subround % 2 == 0)
                    {
                        let third = first;
                        first = second;
                        second = third;
                    }
                    
                    // If neither is the bye, then it is real match
                    if (first != BYE && second != BYE)
                    {
                        string_builder += "<tr><td onclick=\"clicked_participant(this)\">" + first + 
                        "</td><td onclick=\"clicked_participant(this)\"> -- </td><td onclick=\"clicked_participant(this)\">" 
                        + second + "</td></tr>";
                    }
                }
                
                // close subround
                string_builder += "</table>";
                temp_participants = array_leave_one_out_vtape(temp_participants);
            }


        }

        // finally update the innerHTML
        matches_div.innerHTML = string_builder;
    }





    // Add and sutract wins / losses from a given participant
    add_draw = function(participant)
    {
        this.wins.set(participant, this.wins.get(participant) + 0.5);
        this.losses.set(participant, this.losses.get(participant) + 0.5);
    }

    sub_draw = function(participant)
    {
        this.wins.set(participant, this.wins.get(participant) - 0.5);
        this.losses.set(participant, this.losses.get(participant) - 0.5);
    }

    add_win = function(participant)
    {
        console.log(participant);
        this.wins.set(participant, this.wins.get(participant) + 1);
    }

    sub_win = function(participant)
    {
        this.wins.set(participant, this.wins.get(participant) - 1);
    }

    add_loss = function(participant)
    {
        this.losses.set(participant, this.losses.get(participant) + 1);
    }

    sub_loss = function(participant)
    {
        this.losses.set(participant, this.losses.get(participant) - 1);
    }
}




// Function that sets everything up, called when generate button is hit
function generate()
{
    let input_text = document.getElementById("input_box").value.split("\n");
    let index = 0;

    while (index < input_text.length)
    {
        if (input_text[index].length < 1)
        {
            input_text.splice(index, 1);
            index--;
        }
        index++;
    }

    let num_rounds = Math.floor(document.getElementById("num_rounds").value);
    main_tourney = new Tourney(input_text, num_rounds);

    main_tourney.set_standings();
    main_tourney.set_matches();
}








// Handle a piece of a match being clicked
function clicked_participant(element)
{
    let table_row = element.parentElement;


    // player 1
    if (table_row.children[0] == element)
    {
        if (element.className == SELECT_CLASS)
        {
            element.style.backgroundColor = LOSS_COLOR;
            element.style.color = LOSS_TEXT;
            element.className = UNSELECTED_CLASS;
            main_tourney.sub_win(element.innerHTML);
            main_tourney.sub_loss(table_row.children[2].innerHTML);
        }
        else
        {
            element.style.backgroundColor = WIN_COLOR;
            element.style.color = WIN_TEXT;
            element.className = SELECT_CLASS;
            main_tourney.add_win(element.innerHTML);
            main_tourney.add_loss(table_row.children[2].innerHTML);
            table_row.children[1].style.backgroundColor = LOSS_COLOR;
            table_row.children[2].style.backgroundColor = LOSS_COLOR;
            table_row.children[1].style.color = LOSS_TEXT;
            table_row.children[2].style.color = LOSS_TEXT;
            if (table_row.children[1].className == SELECT_CLASS)
            {
                main_tourney.sub_draw(element.innerHTML);
                main_tourney.sub_draw(table_row.children[2].innerHTML);
            }
            else if (table_row.children[2].className == SELECT_CLASS)
            {
                main_tourney.sub_win(table_row.children[2].innerHTML);
                main_tourney.sub_loss(element.innerHTML);
            }
            table_row.children[1].className = UNSELECTED_CLASS;
            table_row.children[2].className = UNSELECTED_CLASS;
        }
    }

    // player 2
    else if (table_row.children[2] == element)
    {
        if (element.className == SELECT_CLASS)
        {
            element.style.backgroundColor = LOSS_COLOR;
            element.style.color = LOSS_TEXT;
            element.className = UNSELECTED_CLASS;
            main_tourney.sub_win(element.innerHTML);
            main_tourney.sub_loss(table_row.children[0].innerHTML);
        }
        else
        {
            element.style.backgroundColor = WIN_COLOR;
            element.style.color = WIN_TEXT;
            element.className = SELECT_CLASS;
            main_tourney.add_win(element.innerHTML);
            main_tourney.add_loss(table_row.children[0].innerHTML);
            table_row.children[0].style.backgroundColor = LOSS_COLOR;
            table_row.children[1].style.backgroundColor = LOSS_COLOR;
            table_row.children[0].style.color = LOSS_TEXT;
            table_row.children[1].style.color = LOSS_TEXT;
            if (table_row.children[1].className == SELECT_CLASS)
            {
                main_tourney.sub_draw(element.innerHTML);
                main_tourney.sub_draw(table_row.children[0].innerHTML);
            }
            else if (table_row.children[0].className == SELECT_CLASS)
            {
                main_tourney.sub_win(table_row.children[0].innerHTML);
                main_tourney.sub_loss(element.innerHTML);
            }
            table_row.children[0].className = UNSELECTED_CLASS;
            table_row.children[1].className = UNSELECTED_CLASS;
        }
    }

    // draw button
    else
    {
        if (element.className == SELECT_CLASS)
        {
            element.style.backgroundColor = LOSS_COLOR;
            element.style.color = LOSS_TEXT;
            element.className = UNSELECTED_CLASS;
            main_tourney.sub_draw(table_row.children[0].innerHTML);
            main_tourney.sub_draw(table_row.children[2].innerHTML);
        }
        else
        {
            element.style.backgroundColor = WIN_COLOR;
            element.style.color = WIN_TEXT;
            element.className = SELECT_CLASS;
            main_tourney.add_draw(table_row.children[0].innerHTML);
            main_tourney.add_draw(table_row.children[2].innerHTML);
            table_row.children[0].style.backgroundColor = LOSS_COLOR;
            table_row.children[2].style.backgroundColor = LOSS_COLOR;
            table_row.children[0].style.color = LOSS_TEXT;
            table_row.children[2].style.color = LOSS_TEXT;
            if (table_row.children[0].className == SELECT_CLASS)
            {
                main_tourney.sub_win(table_row.children[0].innerHTML);
                main_tourney.sub_loss(table_row.children[2].innerHTML);
            }
            else if (table_row.children[2].className == SELECT_CLASS)
            {
                main_tourney.sub_win(table_row.children[2].innerHTML);
                main_tourney.sub_loss(table_row.children[0].innerHTML);
            }
            table_row.children[0].className = UNSELECTED_CLASS;
            table_row.children[2].className = UNSELECTED_CLASS;
        }
    }


    main_tourney.set_standings();
}