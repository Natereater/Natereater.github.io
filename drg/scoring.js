/* ============================================================
   DRG SCORING — logic + rendering
   Ported from drg_scoring.js / drg_scoring.py and extended.
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
const HEAVY_EXTRACTION = "Heavy Extraction";

const MISSION_ORDER = [
    MINING, EGG_HUNT, ON_SITE_REFINING, SALVAGE_OPERATION, POINT_EXTRACTION,
    ESCORT_DUTY, ELIMINATION, INDUSTRIAL_SABOTAGE, DEEP_SCAN, HEAVY_EXTRACTION,
];

// type -> length -> complexity -> difficulty score
// (This table is ALSO the source of truth for which length/complexity combos exist.)
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

// Fallbacks so an unexpected combo never crashes the score.
const DEFAULT_DIFFICULTY = 350;
const DEFAULT_TIME = 26;

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
const OSSUARY_DEPTHS = "Ossuary Depths";

const BIOME_ORDER = [
    CRYSTALLINE_CAVERNS, SALT_PITS, FUNGUS_BOGS, RADIOACTIVE_EXCLUSION_ZONE, DENSE_BIOZONE,
    GLACIAL_STRATA, HOLLOW_BOUGH, AZURE_WEALD, MAGMA_CORE, SANDBLASTED_CORRIDORS, OSSUARY_DEPTHS,
];

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
const ANOMALY_ORDER = [NONE, ...Object.keys(ANOMALY_MULTIPLIERS).filter(k => k !== NONE)];

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
const WARNING_ORDER = [NONE, ...Object.keys(WARNING_MULTIPLIERS).filter(k => k !== NONE).sort()];

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

// id -> human label (used for CSV import/export)
const BONUS_LABELS = {
    "select_korlok": "Korlok Tyrant Weed",
    "select_corruptor": "Lithophage Corruptor",
    "select_betc": "BET-C",
    "select_machine_event": "Machine Event",
    "select_core_stone": "Core Stone",
    "select_rock_cracker": "Rock Cracker",
    "select_data_cell": "Data Cell",
    "select_nemesis": "Nemesis",
    "select_doretta_head": "Doretta Head Returned",
    "select_bone_collector": "Ossium Bone Collector Lair",
};
const LABEL_TO_ID = Object.fromEntries(Object.entries(BONUS_LABELS).map(([k, v]) => [v, k]));

// -----------------------------
//        OTHER CONSTANTS
// -----------------------------
const SECONDARY_VALUE = 77;
const PER_MINUTE_SCORE = 12;
const BASE_TIME_SCORE = 300;
const MIN_TIME_SCORE = -50;
const FAILURE_MULTIPLIER = 0;
const CREDITS_PER_POINT = 20;

// Hazard 5+ modifiers: per-point hazard contribution
const HAZ5_WEIGHTS = { aggressive: 0.2, more: 0.2, tough: 0.3, vuln: 0.3 };

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

// slugify a name into the convention used by the downloaded asset files
function slug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

const BIOME_ICONS = Object.fromEntries(BIOME_ORDER.map(b => [b, `assets/biome_${slug(b)}.png`]));
const ANOMALY_ICONS = Object.fromEntries(
    ANOMALY_ORDER.filter(a => a !== NONE).map(a => [a, `assets/anomaly_${slug(a)}.png`]));
const WARNING_ICONS = Object.fromEntries(
    WARNING_ORDER.filter(w => w !== NONE).map(w => [w, `assets/warning_${slug(w)}.png`]));
const HAZARD_ICONS = { 1: "assets/haz_1.png", 2: "assets/haz_2.png", 3: "assets/haz_3.png", 4: "assets/haz_4.png", 5: "assets/haz_5.png" };

// -----------------------------
//        GLOBAL STATE
// -----------------------------
const STORAGE_KEY = "drg_scoring_runs_v3";
let global_run_list = [];
let next_id = 0;

// -----------------------------
//        HELPERS
// -----------------------------
function val(id) { return document.getElementById(id).value; }

function parse_time(time_string) {
    const parts = String(time_string).split(":").map(Number);
    if (parts.length !== 2 || parts.some(isNaN)) return NaN;
    return parts[0] + parts[1] / 60;
}

function lookup_difficulty(type, length, complexity) {
    const t = DIFFICULTIES[type];
    if (t && t[length] && t[length][complexity] != null) return t[length][complexity];
    return DEFAULT_DIFFICULTY;
}

function lookup_time(type, length, complexity) {
    const t = EXPECTED_TIME[type];
    if (t && t[length] && t[length][complexity] != null) return t[length][complexity];
    return DEFAULT_TIME;
}

function hazard_multiplier(hazard) {
    return 1.5 ** (hazard - 1);
}

function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// -----------------------------
//        SCORING (pure)
// -----------------------------
// Works on a plain run object so it can be reused for the live preview,
// logged runs, and CSV-imported runs.
function score_parts(r) {
    const base = lookup_difficulty(r.mission_type, r.length, r.complexity);
    const biome = BIOME_DIFFICULTY[r.biome] ?? 0;

    const expected = lookup_time(r.mission_type, r.length, r.complexity);
    const minutes = (r.time != null && !isNaN(r.time)) ? r.time : expected;
    let time = BASE_TIME_SCORE + (expected - minutes) * PER_MINUTE_SCORE;
    if (time < MIN_TIME_SCORE) time = MIN_TIME_SCORE;

    const credits = (r.credits || 0) / CREDITS_PER_POINT;
    const secondary = r.secondary ? SECONDARY_VALUE : 0;
    const events = r.bonus_obj || 0;

    const additive = base + biome + time + credits + secondary + events;

    const hazardMult = hazard_multiplier(r.hazard);
    const anomalyMult = ANOMALY_MULTIPLIERS[r.anomaly] ?? 1;
    const warn1 = WARNING_MULTIPLIERS[r.warning_1] ?? 1;
    const warn2 = WARNING_MULTIPLIERS[r.warning_2] ?? 1;
    const mutatorMult = anomalyMult * warn1 * warn2;
    const failMult = r.success ? 1 : FAILURE_MULTIPLIER;
    const multiplier = hazardMult * mutatorMult * failMult;

    const final = Math.floor(additive * multiplier);

    return {
        base, biome, time, credits, secondary, events, additive,
        hazardMult, anomalyMult, warn1, warn2, mutatorMult, failMult, multiplier, final,
    };
}

class Run {
    constructor(id, data) {
        if (data) {
            Object.assign(this, data);
            if (this.score == null) this.score = this.get_score();
            return;
        }
        Object.assign(this, read_form());
        this.id = id;
        this.score = this.get_score();
    }
    get_score() { return score_parts(this).final; }
}

// -----------------------------
//        FORM READING
// -----------------------------
function effective_hazard() {
    const base = parseInt(val("select_hazard"));
    if (base < 5) return base;
    const a = parseInt(val("haz_aggressive")) || 0;
    const m = parseInt(val("haz_more")) || 0;
    const t = parseInt(val("haz_tough")) || 0;
    const p = parseInt(val("haz_vuln")) || 0;
    const haz = 5 + a * HAZ5_WEIGHTS.aggressive + m * HAZ5_WEIGHTS.more
                  + t * HAZ5_WEIGHTS.tough + p * HAZ5_WEIGHTS.vuln;
    return Math.round(haz * 100) / 100;
}

function collect_bonus() {
    let score = 0;
    const labels = [];
    for (const id in BONUS_OBJECTIVES) {
        const el = document.getElementById(id);
        if (el && el.checked) { score += BONUS_OBJECTIVES[id]; labels.push(BONUS_LABELS[id]); }
    }
    return { score, labels };
}

function read_form() {
    const time_string = val("enter_time");
    const bonus = collect_bonus();
    return {
        mission_type: val("select_mission_type"),
        biome: val("select_biome"),
        success: document.querySelector('input[name="success"]:checked').value === "true",
        length: parseInt(val("select_length")),
        complexity: parseInt(val("select_complexity")),
        hazard: effective_hazard(),
        anomaly: val("select_anomaly"),
        warning_1: val("select_warning_1"),
        warning_2: val("select_warning_2"),
        time_string,
        time: parse_time(time_string),
        credits: parseInt(val("enter_credits")) || 0,
        secondary: document.getElementById("select_secondary").checked,
        bonus_obj: bonus.score,
        bonus_list: bonus.labels,
    };
}

// -----------------------------
//        DROPDOWN BUILDERS
// -----------------------------
function fill_select(id, values, selected) {
    const sel = document.getElementById(id);
    sel.innerHTML = values.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    if (selected != null) sel.value = selected;
}

// Only rebuild when the option set actually changes; preserve selection.
function set_numeric_options(sel, values, preferred) {
    const want = values.join(",");
    if (sel.dataset.opts !== want) {
        sel.innerHTML = values.map(v => `<option value="${v}">${v}</option>`).join("");
        sel.dataset.opts = want;
    }
    const cur = parseInt(sel.value);
    sel.value = values.includes(preferred) ? preferred
              : values.includes(cur) ? cur
              : values[0];
}

// Restrict length & complexity to the combos that exist for the chosen mission type.
function sync_length_complexity(preferLen, preferCx) {
    const type = val("select_mission_type");
    const lengths = Object.keys(DIFFICULTIES[type]).map(Number).sort((a, b) => a - b);
    set_numeric_options(document.getElementById("select_length"), lengths, preferLen);

    const len = parseInt(val("select_length"));
    const comps = Object.keys(DIFFICULTIES[type][len]).map(Number).sort((a, b) => a - b);
    set_numeric_options(document.getElementById("select_complexity"), comps, preferCx);
}

// -----------------------------
//        ICONS / PREVIEW
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
    update_icon("icon_anomaly", ANOMALY_ICONS[val("select_anomaly")]);
    update_icon("icon_warning_1", WARNING_ICONS[val("select_warning_1")]);
    update_icon("icon_warning_2", WARNING_ICONS[val("select_warning_2")]);
    update_icon("icon_hazard", HAZARD_ICONS[parseInt(val("select_hazard"))]);
    document.getElementById("display_length_img").src = `assets/length_${val("select_length")}.webp`;
    document.getElementById("display_complexity_img").src = `assets/complexity_${val("select_complexity")}.webp`;
}

function toggle_haz5() {
    const show = parseInt(val("select_hazard")) === 5;
    document.getElementById("haz5_panel").hidden = !show;
    if (show) document.getElementById("haz_effective").textContent = effective_hazard().toFixed(1);
}

// -----------------------------
//        BREAKDOWN + LIVE SCORE
// -----------------------------
function fmt(n) { return (Math.round(n * 10) / 10).toLocaleString(); }

function render_breakdown() {
    const r = read_form();
    const p = score_parts(r);
    const hasTime = !isNaN(r.time);

    const rows = [
        ["Base", "mission + biome", "+" + fmt(p.base + p.biome)],
        ["Time", hasTime ? r.time_string : "expected", (p.time >= 0 ? "+" : "") + fmt(p.time)],
        ["Credits", r.credits.toLocaleString() + " cr", "+" + fmt(p.credits)],
        ["Events", r.secondary || r.bonus_list.length ? (r.bonus_list.length + (r.secondary ? 1 : 0)) + " objective(s)" : "none", "+" + fmt(p.secondary + p.events)],
    ];

    const mults = [
        ["Hazard", "haz " + r.hazard, "×" + p.hazardMult.toFixed(2)],
        ["Mutators", mutator_label(r), "×" + p.mutatorMult.toFixed(3)],
    ];

    let html = '<div class="bd-group">';
    rows.forEach(([k, sub, v]) => {
        html += `<div class="bd-row"><span class="bd-k">${k}<em>${esc(sub)}</em></span><span class="bd-v">${v}</span></div>`;
    });
    html += `<div class="bd-row subtotal"><span class="bd-k">Base Score</span><span class="bd-v">${fmt(p.additive)}</span></div>`;
    html += '</div><div class="bd-group">';
    mults.forEach(([k, sub, v]) => {
        html += `<div class="bd-row"><span class="bd-k">${k}<em>${esc(sub)}</em></span><span class="bd-v mult">${v}</span></div>`;
    });
    if (!r.success) html += `<div class="bd-row"><span class="bd-k">Outcome<em>failed</em></span><span class="bd-v mult">×0</span></div>`;
    html += "</div>";

    document.getElementById("breakdown").innerHTML = html;

    const live = document.getElementById("live_score");
    live.textContent = hasTime ? p.final.toLocaleString() : "—";
    live.classList.toggle("dim", !hasTime);
}

function mutator_label(r) {
    const parts = [];
    if (r.anomaly && r.anomaly !== NONE) parts.push(r.anomaly);
    if (r.warning_1 && r.warning_1 !== NONE) parts.push(r.warning_1);
    if (r.warning_2 && r.warning_2 !== NONE) parts.push(r.warning_2);
    return parts.length ? parts.join(" · ") : "none";
}

// master update: keep dropdowns valid, refresh visuals
function update() {
    sync_length_complexity();
    toggle_haz5();
    refresh_previews();
    render_breakdown();
}

// -----------------------------
//        RUNS TABLE
// -----------------------------
function icon_tag(src, cls) {
    return src ? `<img class="${cls}" src="${src}" alt="" onerror="this.style.display='none'">` : "";
}

function warning_cell(w) {
    if (!w || w === NONE) return '<span class="tag-none">—</span>';
    return `<span class="warn-tag">${icon_tag(WARNING_ICONS[w], "mut-ic")}${esc(w)}</span>`;
}

function anomaly_cell(a) {
    if (!a || a === NONE) return '<span class="tag-none">—</span>';
    return `<span class="warn-tag">${icon_tag(ANOMALY_ICONS[a], "mut-ic")}${esc(a)}</span>`;
}

function render_runs() {
    const body = document.getElementById("runs_body");
    const empty = document.getElementById("empty_state");

    if (global_run_list.length === 0) {
        body.innerHTML = "";
        empty.style.display = "block";
        render_summary();
        return;
    }
    empty.style.display = "none";
    body.innerHTML = global_run_list.map(r => {
        const boolCell = b => b ? '<span class="bool-yes">YES</span>' : '<span class="bool-no">—</span>';
        return `
        <tr class="${r.success ? "" : "fail-row"}">
            <td><div class="mt-cell">${icon_tag(MISSION_ICONS[r.mission_type], "mt-ic")}<span>${esc(r.mission_type)}</span></div></td>
            <td><div class="mt-cell">${icon_tag(BIOME_ICONS[r.biome], "bi-ic")}<span>${esc(r.biome)}</span></div></td>
            <td><img class="lc-img" src="assets/length_${r.length}.webp" alt="L${r.length}"></td>
            <td><img class="lc-img" src="assets/complexity_${r.complexity}.webp" alt="C${r.complexity}"></td>
            <td><span class="haz-pill">${r.hazard}</span></td>
            <td>${anomaly_cell(r.anomaly)}</td>
            <td>${warning_cell(r.warning_1)}</td>
            <td>${warning_cell(r.warning_2)}</td>
            <td>${esc(r.time_string || "—")}</td>
            <td>${(r.credits || 0).toLocaleString()}</td>
            <td>${boolCell(r.secondary)}</td>
            <td>${r.bonus_obj || 0}</td>
            <td><span class="score-cell">${r.score.toLocaleString()}</span></td>
            <td><button class="del-btn" onclick="remove_run(${r.id})" title="Remove">✕</button></td>
        </tr>`;
    }).join("");
    render_summary();
}

function render_summary() {
    const scores = global_run_list.map(r => r.score);
    const total = scores.reduce((a, b) => a + b, 0);
    const count = scores.length;
    document.getElementById("stat_total").textContent = total.toLocaleString();
    document.getElementById("stat_count").textContent = count;
    document.getElementById("stat_avg").textContent = (count ? Math.round(total / count) : 0).toLocaleString();
    document.getElementById("stat_best").textContent = (count ? Math.max(...scores) : 0).toLocaleString();
}

// -----------------------------
//        ACTIONS
// -----------------------------
function add_run() {
    const t = val("enter_time");
    if (!/^\d{1,2}:\d{2}$/.test(t)) { flash_time_error(); return; }
    global_run_list.push(new Run(next_id++));
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
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ next_id, runs: global_run_list })); }
    catch (e) { /* storage unavailable */ }
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
//        CSV IMPORT / EXPORT
// -----------------------------
const CSV_HEADERS = [
    "Mission Type", "Biome", "Success", "Length", "Complexity", "Hazard", "Time",
    "Anomaly", "Warning 1", "Warning 2", "Credits", "Secondary", "Bonus Objectives", "Score",
];

function csv_field(s) {
    s = String(s ?? "");
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function export_csv() {
    if (!global_run_list.length) { alert("No missions to export yet."); return; }
    const lines = [CSV_HEADERS.join(",")];
    for (const r of global_run_list) {
        lines.push([
            r.mission_type, r.biome, r.success ? "True" : "False", r.length, r.complexity,
            r.hazard, r.time_string, r.anomaly, r.warning_1, r.warning_2, r.credits,
            r.secondary ? "True" : "False", (r.bonus_list || []).join("|"), r.score,
        ].map(csv_field).join(","));
    }
    const blob = new Blob([lines.join("\r\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "drg_missions.csv";
    a.click();
    URL.revokeObjectURL(a.href);
}

// minimal RFC-4180-ish CSV row parser (handles quotes/commas)
function parse_csv(text) {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
            else field += c;
        } else if (c === '"') inQuotes = true;
        else if (c === ",") { row.push(field); field = ""; }
        else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
        else if (c !== "\r") field += c;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.length && r.some(c => c.trim() !== ""));
}

function import_csv(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try { load_csv_text(e.target.result); }
        catch (err) { alert("Could not parse CSV: " + err.message); }
        event.target.value = ""; // allow re-importing same file
    };
    reader.readAsText(file);
}

function load_csv_text(text) {
    const rows = parse_csv(text);
    if (!rows.length) { alert("CSV is empty."); return; }

    const header = rows[0].map(h => h.trim().toLowerCase());
    const idx = name => header.indexOf(name.toLowerCase());
    const get = (row, name) => { const i = idx(name); return i >= 0 ? (row[i] ?? "").trim() : ""; };
    const truthy = s => /^(true|yes|1)$/i.test(s.trim());

    const imported = [];
    let skipped = 0;
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const mission_type = get(row, "Mission Type");
        if (!DIFFICULTIES[mission_type]) { skipped++; continue; }

        const bonus_list = (get(row, "Bonus Objectives") || "").split(/[|;]/).map(s => s.trim()).filter(Boolean);
        const bonus_obj = bonus_list.reduce((sum, lbl) => sum + (BONUS_OBJECTIVES[LABEL_TO_ID[lbl]] || 0), 0);
        const time_string = get(row, "Time");

        const data = {
            id: next_id++,
            mission_type,
            biome: get(row, "Biome"),
            success: truthy(get(row, "Success")),
            length: parseInt(get(row, "Length")) || 1,
            complexity: parseInt(get(row, "Complexity")) || 1,
            hazard: parseFloat(get(row, "Hazard")) || 5,
            anomaly: ANOMALY_MULTIPLIERS[get(row, "Anomaly")] != null ? get(row, "Anomaly") : NONE,
            warning_1: WARNING_MULTIPLIERS[get(row, "Warning 1")] != null ? get(row, "Warning 1") : NONE,
            warning_2: WARNING_MULTIPLIERS[get(row, "Warning 2")] != null ? get(row, "Warning 2") : NONE,
            time_string,
            time: parse_time(time_string),
            credits: parseInt(get(row, "Credits")) || 0,
            secondary: truthy(get(row, "Secondary")),
            bonus_obj,
            bonus_list,
        };
        data.score = score_parts(data).final; // recompute against current rules
        imported.push(new Run(data.id, data));
    }

    if (!imported.length) { alert("No valid mission rows found in CSV."); return; }

    const replace = global_run_list.length === 0 ||
        confirm(`Import ${imported.length} mission(s).\n\nOK = replace current list, Cancel = append.`);
    global_run_list = replace ? imported : global_run_list.concat(imported);
    save_runs();
    render_runs();
    if (skipped) console.warn(`${skipped} row(s) skipped (unknown mission type).`);
}

// -----------------------------
//        BOOT
// -----------------------------
window.addEventListener("DOMContentLoaded", () => {
    // build dropdowns
    fill_select("select_mission_type", MISSION_ORDER, MINING);
    fill_select("select_biome", BIOME_ORDER, CRYSTALLINE_CAVERNS);
    fill_select("select_anomaly", ANOMALY_ORDER, NONE);
    fill_select("select_warning_1", WARNING_ORDER, NONE);
    fill_select("select_warning_2", WARNING_ORDER, NONE);
    fill_select("select_hazard", [1, 2, 3, 4, 5], 5);
    sync_length_complexity(2, 2);

    load_runs();

    // wire live updates on every config control
    document.querySelectorAll("#config select, #config input").forEach(el => {
        el.addEventListener("change", update);
        el.addEventListener("input", update);
    });

    update();
    render_runs();
});
