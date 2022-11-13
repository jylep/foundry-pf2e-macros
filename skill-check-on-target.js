const getActor = (token) => token.actor;
/**
 * @deprecated Implementation will no longer support `actor.data.data`. See Foundry v10 changelog.
 * @param {*} actor A Foundry Actor
 * @returns Actor's data
 */
const getActorData = (actor) => actor.data.data || actor.data;
const getUserTargetToken = (user) => {
  // Returns undefined if no target
  const target = user.targets.first();
  return target;
};
const getActorLevel = (actorData) => actorData.details.level.value;
const getActorDC = (actor) => {
  const DCbyLevel = [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50];
  return DCbyLevel[getActorLevel(getActorData(actor))];
}
const getActorSkills = (actor) => getActorData(actor).skills;
const MODIFIER_TYPE = {
  ABILITY: "ability",
  PROFICIENCY: "proficiency",
  CIRCUMSTANCE: "circumstance",
  ITEM: "item",
  POTENCY: "potency",
  STATUS: "status",
  UNTYPED: "untyped",
}

const doSkillCheckOnTarget = ({ skillName, skillKey, actionName }) => {
  const user = game.user;
  const actor = getActor(token);
  const target = getUserTargetToken(user);

  if (!actor) {
    ui.notifications.warn("You must have an actor selected");
    return;
  }

  if (!target) {
    ui.notifications.warn("You must have only one token targeted");
    return;
  }

  const tomeModifier = new game.pf2e.Modifier({
    /** The display name of this modifier; can be a localization key (see en.json). */
    label: "Adept Tome Implement",
    /** The actual numeric benefit/penalty that this modifier provides. */
    modifier: 1,
    /** The type of this modifier - modifiers of the same type do not stack (except for `untyped` modifiers). */
    type: MODIFIER_TYPE.CIRCUMSTANCE,
    /** If the type is "ability", this should be set to a particular ability */
    // ability?: AbilityString | null;
    /** Numeric adjustments to apply */
    // adjustments?: ModifierAdjustment[];
    /** If true, this modifier will be applied to the final roll; if false, it will be ignored. */
    enabled: true,
    /** If true, these custom dice are being ignored in the damage calculation. */
    // ignored?: boolean;
    // source: "",
    // name: "",
    /** If true, this modifier is a custom player-provided modifier. */
    custom: true,
    /** The damage type that this modifier does, if it modifies a damage roll. */
    // damageType?: string | null;
    /** The damage category */
    // damageCategory?: string | null;
    /** A predicate which determines when this modifier is active. */
    // predicate?: RawPredicate;
    /** If true, this modifier is only active on a critical hit. */
    // critical?: boolean | null;
    /** Any notes about this modifier. */
    notes: "Free RK on target of Exploit Vulnerability at start of the turn, gives a +1 Circumstance Bonus on next attack",
    /** The list of traits that this modifier gives to the underlying attack, if any. */
    // traits?: string[];
    /** Hide this modifier in UIs if it is disabled */
    // hideIfDisabled?: boolean;
  });
  const modifiers = [tomeModifier];
  const rollTitleTemplate = `<span class="pf2-icon">A</span> <b>${actionName}</b> - <p class="compact-text">${skillName} Skill Check</p>`;
  const rollModifier = new game.pf2e.CheckModifier(
    rollTitleTemplate,
    getActorSkills(actor)[skillKey],
    modifiers
  );

  const skillNotes = [...getActorSkills(actor)[skillKey].notes];
  const rollType = "skill-check"
  const rollOptions = actor.getRollOptions(['all', rollType, skillName.toLowerCase()]);
  

  const rollContext = {
    actor: actor,
    type: rollType,
    options: rollOptions,
    notes: skillNotes,
    title: `${actionName} - ${skillName}`,
    dc: {
      value: getActorDC(getActor(getUserTargetToken(user)))
    }
  };

  const rollCallback = (roll, outcome, message) => {
    // TODO: Remove the log
    console.log("rollResult", [
      roll,
      outcome,
      message
    ]);
  }

  // Find documentation on this here: https://github.com/foundryvtt/pf2e/blob/84ae47cb03fc79a5c1be4e31f27db01202068c13/src/module/system/rolls.ts#L160
  game.pf2e.Check.roll(
    rollModifier,
    rollContext,
    event,
    rollCallback
  );
}

const skillName = "Esoteric Lore";
const skillKey = "esoteric-lore";
const actionName = "Recall Knowledge";
doSkillCheckOnTarget({ skillName, skillKey, actionName });


// const dialogContent = `
// `;
