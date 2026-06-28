/* ============================================================
   DRG SCORING — logic + rendering
   Ported from drg_scoring.js / drg_scoring.py and extended.

   >>> NEW CONTENT IS MARKED WITH `// TODO:` — fill in your values. <<<
   ============================================================ */

const NONE = "None";

// -----------------------------
//            MISSIONS
// -----------------------------
const MINING = "Mining Expedition";
const EGG_HUNT = "Egg Hunt";
const ON_SITE_REFINING = "On-Site Refining";
const SALVAGE_OPERATION = "Salvage Operation";
const POINT_EXTRACTION = "Point Extraction";
const ESCORT_DUTY = "Escort Duty";
const ELIMINATION = "Elimination";
const INDUSTRIAL_SABOTAGE = "Industrial Sabotage";
const DEEP_SCAN = "Deep Scan";
const HEAVY_EXTRACTION = "Heavy Extraction"; // NEW (Season 06: Relics of Hoxxes)

// type -> length -> complexity -> difficulty score
const DIFFICULTIES = {
    [MINING]: {
        1: { 1: 300 }, // 200 morkite
        2: { 1: 315, 2: 330 }, // 225 / 250 morkite
        3: { 2: 355, 3: 380 }, // 325 / 400 morkite
    },
    [EGG_HUNT]: {
        1: { 1: 300 }, // 4 eggs
        2: { 2: 340 }, // 6 eggs
        3: { 2: 375 }, // 8 eggs
    },
    [ON_SITE_REFINING]: {
        2: { 2: 350, 3: 365 },
    },
    [SALVAGE_OPERATION]: {
        2: { 2: 340 }, // 2 mules
        3: { 3: 360 }, // 3 mules
    },
    [POINT_EXTRACTION]: {
        2: { 3: 335 }, // 7 aquarqs
        3: { 3: 370 }, // 10 aquarqs
    },
    [ESCORT_DUTY]: {
        2: { 2: 360, 3: 370 }, // 1 refuel
        3: { 2: 385, 3: 395 }, // 2 refuels
    },
    [ELIMINATION]: {
        2: { 2: 335 }, // 2 dreadnoughts
        3: { 3: 380 }, // 3 dreadnoughts
    },
    [INDUSTRIAL_SABOTAGE]: {
        2: { 1: 390, 2: 400 }, // 2 power stations
    },
    [DEEP_SCAN]: {
        1: { 2: 325 }, // 3 scans
        2: { 3: 350 }, // 5 scans
    },
    [HEAVY_EXTRACTION]: {
        2: { 2: 320, 3: 335 },
        3: { 2: 350, 3: 365 },
    },
};

// type -> length -> complexity -> expected completion time (minutes)
const EXPECTED_TIME = {
    [MINING]: {
        1: { 1: 16 },
        2: { 1: 18, 2: 20 },
        3: { 2: 25, 3: 30 },
    },
    [EGG_HUNT]: {
        1: { 1: 16 },
        2: { 2: 23 },
        3: { 2: 30 },
    },
    [ON_SITE_REFINING]: {
        2: { 2: 23, 3: 27 },
    },
    [SALVAGE_OPERATION]: {
        2: { 2: 25 },
        3: { 3: 28 },
    },
    [POINT_EXTRACTION]: {
        2: { 3: 19 },
        3: { 3: 26 },
    },
    [ESCORT_DUTY]: {
        2: { 2: 27, 3: 29 },
        3: { 2: 35, 3: 37 },
    },
    [ELIMINATION]: {
        2: { 2: 23 },
        3: { 3: 31 },
    },
    [INDUSTRIAL_SABOTAGE]: {
        2: { 1: 34, 2: 38 },
    },
    [DEEP_SCAN]: {
        1: { 2: 21 },
        2: { 3: 27 },
    },
    [HEAVY_EXTRACTION]: {
        2: { 2: 21, 3: 23 },
        3: { 2: 27, 3: 29 },
    },
};

// Fallbacks so an unconfigured length/complexity combo never crashes the score.
const TODO_DIFFICULTY = 350; // TODO: default difficulty when a combo is not yet defined
const TODO_TIME = 26;        // TODO: default expected time when a combo is not yet defined

// -----------------------------
//              BIOMES
// -----------------------------
const CRYSTALLINE_CAVERNS = "Crystalline Caverns";
const SALT_PITS = "Salt Pits";
const FUNGUS_BOGS = "Fungus Bogs";
const RADIOACTIVE_EXCLUSION_ZONE = "Radioactive Exclusion Zone";
const DENSE_BIOZONE = "Dense Biozone";
const GLACIAL_STRATA = "Glacial Strata";
const HOLLOW_BOUGH = "Hollow Bough";
const AZURE_WEALD = "Azure Weald";
const MAGMA_CORE = "Magma Core";
const SANDBLASTED_CORRIDORS = "Sandblasted Corridors";
const OSSUARY_DEPTHS = "Ossuary Depths"; // NEW (Season 06: Relics of Hoxxes)

const BIOME_DIFFICULTY = {
    [CRYSTALLINE_CAVERNS]: 2,
    [SALT_PITS]: 0,
    [FUNGUS_BOGS]: 11,
    [RADIOACTIVE_EXCLUSION_ZONE]: 9,
    [DENSE_BIOZONE]: 10,
    [GLACIAL_STRATA]: 16,
    [HOLLOW_BOUGH]: 13,
    [AZURE_WEALD]: 4,
    [MAGMA_CORE]: 21,
    [SANDBLASTED_CORRIDORS]: 6,
    [OSSUARY_DEPTHS]: 8,
};

// -----------------------------
//            ANOMALIES
// -----------------------------
const ANOMALY_MULTIPLIERS = {
    "Blood Sugar": 0.950,
    "Critical Weakness": 0.945,
    "Double XP": 1,
    "Gold Rush": 0.995,
    "Golden Bugs": 0.985,
    "Low Gravity": 0.970,
    "Mineral Mania": 1,
    "Rich Atmosphere": 0.975,
    "Secret Secondary": 0.995,
    "Volatile Guts": 1.010,
    [NONE]: 1,
};

// -----------------------------
//            WARNINGS
// -----------------------------
const WARNING_MULTIPLIERS = {
    "Cave Leech Cluster": 1.065,
    "Duck and Cover": 1.125,
    "Ebonite Outbreak": 1.145,
    "Elite Threat": 1.160,
    "Exploder Infestation": 1.075,
    "Haunted Cave": 1.215,
    "Lethal Enemies": 1.185,
    "Low Oxygen": 1.195,
    "Mactera Plague": 1.090,
    "Parasites": 1.080,
    "Regenerative Bugs": 1.045,
    "Rival Presence": 1.170,
    "Shield Disruption": 1.245,
    "Swarmageddon": 1.180,
    "Lithophage Outbreak": 1.170,
    "Core Corruption": 1.185,
    "Pit Jaw Colony": 1.110,
    "Scrab Nesting Grounds": 1.085,

    [NONE]: 1,
};

// Warnings that still need their multiplier tuned (shown with a TODO flag in the table).
const WARNINGS_TODO = new Set(["Core Corruption", "Pit Jaw Colony", "Scrab Nesting Grounds"]);

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
    "select_doretta_head": 6,
    "select_bone_collector": 38,
};

// -----------------------------
//        OTHER CONSTANTS
// -----------------------------
const SECONDARY_VALUE = 77;
const PER_MINUTE_SCORE = 12;
const BASE_TIME_SCORE = 300;
const MIN_TIME_SCORE = -50;
const FAILURE_MULTIPLIER = 0;
const CREDITS_PER_POINT = 20;

// -----------------------------
//        ICON MAPS
// -----------------------------
const MISSION_ICONS = {
    [MINING]: "assets/Mining Expedition_icon.webp",
    [EGG_HUNT]: "assets/Egg Hunt_icon.webp",
    [ON_SITE_REFINING]: "assets/On-Site Refining_icon.webp",
    [SALVAGE_OPERATION]: "assets/Salvage Operation_icon.webp",
    [POINT_EXTRACTION]: "assets/Point Extraction_icon.webp",
    [ESCORT_DUTY]: "assets/Escort Duty_icon.webp",
    [ELIMINATION]: "assets/Elimination_icon.webp",
    [INDUSTRIAL_SABOTAGE]: "assets/Industrial Sabotage_icon.webp",
    [DEEP_SCAN]: "assets/Deep Scan_icon.webp",
    [HEAVY_EXTRACTION]: "assets/Heavy Extraction_icon.png",
};

const BIOME_ICONS = {
    [OSSUARY_DEPTHS]: "assets/Ossuary Depths_icon.png", // NEW (only biome with a packed icon)
};

// Only the freshly-added Season 06 warnings ship with packed icons.
const WARNING_ICONS = {
    "Core Corruption": "assets/Warning_core_corruption_icon.png",
    "Pit Jaw Colony": "assets/Warning_pit_jaw_colony_icon.png",
    "Scrab Nesting Grounds": "assets/Warning_scrab_nesting_grounds_icon.png",
};

// -----------------------------
//        GLOBAL STATE
// -----------------------------
const STORAGE_KEY = "drg_scoring_runs_v2";
let global_run_list;
let next_id = 0;

// -----------------------------
//        HELPERS
// -----------------------------
function parse_time(time_string) {
    const parts = String(time_string).split(":").map(Number);
    if (parts.length !== 2 || parts.some(isNaN)) return NaN;
    return parts[0] + parts[1] / 60;
}

function lookup_difficulty(type, length, complexity) {
    const t = DIFFICULTIES[type];
    if (t && t[length] && t[length][complexity] != null) return t[length][complexity];
    return TODO_DIFFICULTY;
}

function lookup_time(type, length, complexity) {
    const t = EXPECTED_TIME[type];
    if (t && t[length] && t[length][complexity] != null) return t[length][complexity];
    return TODO_TIME;
}

function hazard_multiplier(hazard) {
    return 1.5 ** (hazard - 1);
}

function get_bonus_obj_score() {
    let total = 0;
    for (const key in BONUS_OBJECTIVES) {
        const el = document.getElementById(key);
        if (el && el.checked) total += BONUS_OBJECTIVES[key];
    }
    return total;
}

function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// -----------------------------
//        RUN MODEL
// -----------------------------
class Run {
    constructor(id, data) {
        if (data) { Object.assign(this, data); return; }

        this.id = id;
        this.mission_type = val("select_mission_type");
        this.biome = val("select_biome");
        this.success = document.querySelector('input[name="success"]:checked').value === "true";
        this.length = parseInt(val("select_length"));
        this.complexity = parseInt(val("select_complexity"));
        this.hazard = parseFloat(val("select_hazard"));
        this.anomaly = val("select_anomaly");
        this.warning_1 = val("select_warning_1");
        this.warning_2 = val("select_warning_2");
        this.time_string = val("enter_time");
        this.time = parse_time(this.time_string);
        this.credits = parseInt(val("enter_credits")) || 0;
        this.secondary = document.getElementById("select_secondary").checked;
        this.bonus_obj = get_bonus_obj_score();
        this.score = this.get_score();
    }

    get_multiplier() {
        let m = 1;
        m *= hazard_multiplier(this.hazard);
        m *= ANOMALY_MULTIPLIERS[this.anomaly] ?? 1;
        m *= WARNING_MULTIPLIERS[this.warning_1] ?? 1;
        m *= WARNING_MULTIPLIERS[this.warning_2] ?? 1;
        if (!this.success) m *= FAILURE_MULTIPLIER;
        return m;
    }

    get_additive_score() {
        let score = 0;
        score += lookup_difficulty(this.mission_type, this.length, this.complexity);

        // time score (floored, matching the python reference)
        const minutes = isNaN(this.time) ? lookup_time(this.mission_type, this.length, this.complexity) : this.time;
        const time_diff = lookup_time(this.mission_type, this.length, this.complexity) - minutes;
        let time_score = BASE_TIME_SCORE + time_diff * PER_MINUTE_SCORE;
        if (time_score < MIN_TIME_SCORE) time_score = MIN_TIME_SCORE;
        score += time_score;

        score += BIOME_DIFFICULTY[this.biome] ?? 0;
        score += this.credits / CREDITS_PER_POINT;
        if (this.secondary) score += SECONDARY_VALUE;
        score += this.bonus_obj;
        return score;
    }

    get_score() {
        return Math.floor(this.get_additive_score() * this.get_multiplier());
    }
}

// -----------------------------
//        RENDERING
// -----------------------------
function warning_tag(w) {
    if (!w || w === NONE) return '<span class="tag-none">—</span>';
    const icon = WARNING_ICONS[w]
        ? `<img src="${WARNING_ICONS[w]}" alt="" onerror="this.style.display='none'">` : "";
    const todo = WARNINGS_TODO.has(w) ? '<span class="todo-flag">TODO</span>' : "";
    return `<span class="warn-tag">${icon}${esc(w)}${todo}</span>`;
}

function render_runs() {
    const runs = global_run_list;
    const body = document.getElementById("runs_body");
    const empty = document.getElementById("empty_state");

    if (runs.length === 0) {
        body.innerHTML = "";
        empty.style.display = "block";
    } else {
        empty.style.display = "none";
        body.innerHTML = runs.map(r => {
            const micon = MISSION_ICONS[r.mission_type] || "";
            const biomeTodo = r.biome === OSSUARY_DEPTHS ? '<span class="todo-flag">TODO</span>' : "";
            const heavyTodo = r.mission_type === HEAVY_EXTRACTION ? '<span class="todo-flag">TODO</span>' : "";
            const boolCell = b => b ? '<span class="bool-yes">YES</span>' : '<span class="bool-no">—</span>';
            return `
            <tr class="${r.success ? "" : "fail-row"}">
                <td>
                    <div class="mt-cell">
                        <img src="${micon}" alt="" onerror="this.style.visibility='hidden'">
                        <span>${esc(r.mission_type)}${heavyTodo}</span>
                    </div>
                </td>
                <td>${esc(r.biome)}${biomeTodo}</td>
                <td><img class="lc-img" src="assets/length_${r.length}.webp" alt="L${r.length}"></td>
                <td><img class="lc-img" src="assets/complexity_${r.complexity}.webp" alt="C${r.complexity}"></td>
                <td><span class="haz-pill">${r.hazard}</span></td>
                <td>${r.anomaly && r.anomaly !== NONE ? esc(r.anomaly) : '<span class="tag-none">—</span>'}</td>
                <td>${warning_tag(r.warning_1)}</td>
                <td>${warning_tag(r.warning_2)}</td>
                <td>${esc(r.time_string || "—")}</td>
                <td>${r.credits.toLocaleString()}</td>
                <td>${boolCell(r.secondary)}</td>
                <td>${r.bonus_obj}</td>
                <td><span class="score-cell">${r.score.toLocaleString()}</span></td>
                <td><button class="del-btn" onclick="remove_run(${r.id})" title="Remove">✕</button></td>
            </tr>`;
        }).join("");
    }
    render_summary();
}

function render_summary() {
    const runs = global_run_list;
    const scores = runs.map(r => r.score);
    const total = scores.reduce((a, b) => a + b, 0);
    const count = runs.length;
    const avg = count ? Math.round(total / count) : 0;
    const best = count ? Math.max(...scores) : 0;

    document.getElementById("stat_total").textContent = total.toLocaleString();
    document.getElementById("stat_count").textContent = count;
    document.getElementById("stat_avg").textContent = avg.toLocaleString();
    document.getElementById("stat_best").textContent = best.toLocaleString();
}

// -----------------------------
//        ACTIONS
// -----------------------------
function val(id) { return document.getElementById(id).value; }

function add_run() {
    const t = val("enter_time");
    if (!/^\d{1,2}:\d{2}$/.test(t)) {
        flash_time_error();
        return;
    }
    const run = new Run(next_id++);
    global_run_list.push(run);
    save_runs();
    render_runs();
}

function remove_run(id) {
    global_run_list = global_run_list.filter(r => r.id !== id);
    save_runs();
    render_runs();
}

function clear_runs() {
    if (!global_run_list.length) return;
    if (confirm("Clear all logged missions?")) {
        global_run_list = [];
        save_runs();
        render_runs();
    }
}

function flash_time_error() {
    const inp = document.getElementById("enter_time");
    inp.style.borderColor = "#b4402c";
    inp.placeholder = "MM:SS  (e.g. 14:32)";
    inp.focus();
    setTimeout(() => { inp.style.borderColor = ""; }, 1200);
}

// -----------------------------
//        PERSISTENCE
// -----------------------------
function save_runs() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ next_id, runs: global_run_list }));
    } catch (e) { /* storage may be unavailable; ignore */ }
}

function load_runs() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        global_run_list = (parsed.runs || []).map(d => new Run(d.id, d));
        next_id = parsed.next_id || global_run_list.length;
    } catch (e) { global_run_list = []; }
}

// -----------------------------
//        LIVE PREVIEW + ICONS
// -----------------------------
function update_icon(chipId, src) {
    const chip = document.getElementById(chipId);
    if (!chip) return;
    if (src) {
        chip.classList.remove("empty");
        chip.innerHTML = `<img src="${src}" alt="" onerror="this.parentNode.classList.add('empty');this.remove();">`;
    } else {
        chip.classList.add("empty");
        chip.innerHTML = "";
    }
}

function refresh_previews() {
    update_icon("icon_mission", MISSION_ICONS[val("select_mission_type")]);
    update_icon("icon_biome", BIOME_ICONS[val("select_biome")]);
    update_icon("icon_warning_1", WARNING_ICONS[val("select_warning_1")]);
    update_icon("icon_warning_2", WARNING_ICONS[val("select_warning_2")]);
    document.getElementById("display_length_img").src = `assets/length_${val("select_length")}.webp`;
    document.getElementById("display_complexity_img").src = `assets/complexity_${val("select_complexity")}.webp`;
    update_live_score();
}

function update_live_score() {
    const t = val("enter_time");
    const preview = document.getElementById("live_score");
    if (!/^\d{1,2}:\d{2}$/.test(t)) {
        preview.textContent = "—";
        return;
    }
    const r = new Run(-1);
    preview.textContent = r.score.toLocaleString();
}

// -----------------------------
//        BOOT
// -----------------------------
window.addEventListener("DOMContentLoaded", () => {
    global_run_list = [];
    load_runs();

    // wire live updates
    document.querySelectorAll("#config select, #config input").forEach(el => {
        el.addEventListener("change", refresh_previews);
        el.addEventListener("input", refresh_previews);
    });

    refresh_previews();
    render_runs();
});
