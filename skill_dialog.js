const SKILL_DICTIONARY = {
    per: { label: "Perception", strategy: "Perception", icon: '<i class="fas fa-eye"></i>' },
    acr: { label: "Acrobatics", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    arc: { label: "Arcana", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    ath: { label: "Athletics", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    cra: { label: "Crafting", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    dec: { label: "Deception", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    dip: { label: "Diplomacy", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    itm: { label: "Intimidation", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    med: { label: "Medicine", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    nat: { label: "Nature", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    occ: { label: "Occultism", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    prf: { label: "Performance", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    rel: { label: "Religion", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    soc: { label: "Society", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    ste: { label: "Stealth", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    sur: { label: "Survival", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    thi: { label: "Thievery", strategy: "Skill", icon: '<i class="fas fa-hammer"></i>' },
    fortitude: { label: "Fortitude", strategy: "Save", icon: '<i class="fas fa-dice-d20"></i>' },
    reflex: { label: "Reflex", strategy: "Save", icon: '<i class="fas fa-dice-d20"></i>' },
    will: { label: "Will", strategy: "Save", icon: '<i class="fas fa-dice-d20"></i>' }
};
const RANK_DICTIONARY = {
    0: "Untrained",
    1: "Trained",
    2: "Expert",
    3: "Master",
    4: "Legendary"
};
const RESULT_DICTIONARY = {
    0: "Critical Failure",
    1: "Failure",
    2: "Success",
    3: "Critical Success"
}
const rollSkill = (e, b) => {
    let c = [actor];
    if (0 === c.length) ui.notifications.error("No logged in players");
    else {
        let d = SKILL_DICTIONARY[e]
        let a = `<div class="pf2e chat-card"><header class="card-header flexrow"><img src="${this.data.img}" title="${this.data.name}" style="max-width:36px"><h3>${d.icon} ${d.label}</h3></header><div class="card-content">`;
        isNaN(b) || (a += `<b>DC: ${b}</b>`)
        a += "<table>"
        c.forEach(function (c) {
            let l = new Roll("1d20")
            l.roll({ async: !1 });
            let j = l._total
            let f = 0
            let i = 0;
            "Perception" === d.strategy
                ? (f = c.data.data.attributes.perception.totalModifier, i = c.data.data.attributes.perception.rank)
                : "Skill" === d.strategy
                    ? (f = c.data.data.skills[e].totalModifier, i = c.data.data.skills[e].rank)
                    : "Save" === d.strategy && (f = c.data.data.saves[e].totalModifier, i = c.data.data.saves[e].rank);
            let o = f < 0
                ? f
                : "+" + f
            let m = j + f
            let p = RANK_DICTIONARY[i], k = m - b, g = 0; g = k < -10 ? 0 : k < 0 ? 1 : k >= 10 ? 3 : 2; let h = ""; 1 === j && (g = Math.max(0, g - 1)), 20 === j && (g = Math.min(3, g + 1)); let n = RESULT_DICTIONARY[g]; switch (g) { case 0: h += "font-weight: bold; background-color: darkkhaki; color: darkred;"; break; case 1: h += "background-color: khaki;"; break; case 2: h += "background-color: palegreen;"; break; case 3: h += "font-weight: bold; background-color: lime; color: white;" }isNaN(b) && (h = "", n = ""), a += `<tr title="${n}" style="${h}"><td><b>${c.data.name}</b></td><td>${p} ${o}</td><td>${m}</td>`
        })
        a += "</table></div></div>"
        ChatMessage.create({ user: game.user._id, content: a, whisper: ChatMessage.getWhisperRecipients("GM"), blind: !0 }, {})
    }
};
const DCByLevel= (level) => [14,15,16,18,19,20,22,23,24,26,27,28,30,31,32,34,35,36,38,39,40,42,44,46,48,50][level];
const selectSkill = () => {
    let a = `
<label style="flex-grow: 1;" for="dialogSkillDc">DC (Optional)</label>
<input type="text" style="height: 2rem; max-width: 50%;" id="dialogSkillDc" value=${DCByLevel(6)}>
`;
    new Dialog({ title: "Skill Check", content: a, buttons: getButtons(), default: "roll" }).render(!0)
};
function getButtons() {
    let a = [];
    for (let b in SKILL_DICTIONARY)
        a.push({
            icon: SKILL_DICTIONARY[b].icon ?? '<i class="fas fa-check"></i>',
            label: SKILL_DICTIONARY[b].label,
            async callback(a) {
                a.find("#dialogSkillId").val();
                let c = parseInt(a.find("#dialogSkillDc").val());
                rollSkill(b, c)
            }
        });
    return a
}
selectSkill()