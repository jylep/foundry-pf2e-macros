const getActor = (token) => token.actor;
// /**
//  * @deprecated Implementation will no longer support `actor.data.data`. See Foundry v10 changelog.
//  * @param {*} actor A Foundry Actor
//  * @returns Actor's data
//  */
// const getActorData = (actor) => actor.data.data || actor.data;

const getUserTargetToken = (user) => {
  // Returns undefined if no target
  const target = user.targets.first();
  return target;
};
const getActorLevel = (actorData) => actorData.level;
const getActorDC = (actor) => {
  const DCbyLevel = [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50];
  return DCbyLevel[getActorLevel(actor)];
}
const getActorSkills = (actor) => actor.skills;
const MODIFIER_TYPE = {
  ABILITY: "ability",
  PROFICIENCY: "proficiency",
  CIRCUMSTANCE: "circumstance",
  ITEM: "item",
  POTENCY: "potency",
  STATUS: "status",
  UNTYPED: "untyped",
}
const getTomeRKModifier = () => {
  return new game.pf2e.Modifier({
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
}
/**
 * Generates a template for all actor's skills
 * @param {*} skills lists of an actor's skills
 * @returns the template to inject
 */
 const skillSelectorTemplate = (skills) => {
  const getSkillTemplate = ([name, skill]) => {
    return `
      <li id="skill@${skill.slug}/${skill.label}" class="directory-item document macro flexrow">
        <h4 class="document-name" style="text-align:center;">
          <i class="fas fa-hammer" style="margin-right:1em;"></i>
          <a>${game.i18n.localize(skill.label)}</a>
        </h4>
      </li>
    `;
  };

  return `
  <section class="directory flexcol" style="padding:1em;">
    <ol style="
      margin: 0px 1em;
      padding: 0;
      border: 2px solid var(--color-border-dark);
    ">
      ${Object.entries(skills).map(getSkillTemplate).join('\n')}
    </ol>
  </section>
`;
};


// ========== Main functions under this section ================

/**
 * @param {*} param An object containing keys to setup the PF2E Check
 * @returns A standard DC skill check against a targeted token actor
 */
const doSkillCheckOnTarget = ({ skillName, skillKey, actionName, modifiers = [], forcedDC = undefined }) => {
  const user = game.user;
  const target = getUserTargetToken(user);

  if (!actor) {
    ui.notifications.warn("You must have an actor selected");
    return;
  }

  if (!target) {
    ui.notifications.warn("You must have only one token targeted");
    return;
  }

  const rollTitleTemplate = `<span class="pf2-icon">A</span> <b>${actionName}</b> - <p class="compact-text">${skillName} Skill Check</p>`;
  const rollModifier = new game.pf2e.CheckModifier(
    rollTitleTemplate,
    getActorSkills(actor)[skillKey],
    modifiers
  );
  const rollType = "skill-check"
  const rollOptions = actor.getRollOptions(['all', rollType, skillName.toLowerCase()]);
  const rollContext = {
    actor: actor,
    type: rollType,
    options: rollOptions,
    title: `${actionName} - ${skillName}`,
    dc: {
      value: forcedDC ?? getActorDC(getActor(getUserTargetToken(user)))
    }
  };

  const rollCallback = (roll, outcome, message) => {
    // if you need to do something with the roll result
    // do it here.
  }

  // Find documentation on this here: https://github.com/foundryvtt/pf2e/blob/84ae47cb03fc79a5c1be4e31f27db01202068c13/src/module/system/rolls.ts#L160
  game.pf2e.Check.roll(
    rollModifier,
    rollContext,
    event,
    rollCallback
  );
}
/**
 * Renders a list of skills for current actor and makes a skill check against
 * the actor's target
 */
const pickSkillAndDoCheck = ({ actionName, modifiers = [], forcedDC = undefined }) => {
  Hooks.once('renderDialog', (dialog, html, contentAndButtons) => {
    const liElements = Array.from(html[0].getElementsByTagName("li"));
    liElements.forEach(el => {
      // Assign a callback using the skill label and skill slug 
      const [skillKey, skillName] = el.id.split('@').pop().split('/');
      el.onclick = (e) => {
        e.preventDefault();
        dialog.close(); // Dialog no longer needed
        doSkillCheckOnTarget({ skillName, skillKey, actionName, modifiers, forcedDC })
      }
    });
  })

  new Dialog({
    title: 'Choose a skill',
    content: skillSelectorTemplate(getActorSkills(actor)),
    buttons: {
      cancel: {
        icon: '',
        label: 'Cancel',
      }
    },
    default: 'cancel'
  }, {
    height: 650,
    resizable: true,
    scrollY: ["directory"]
  }).render(true);
}

// ========== Example usage under this section ================

// DC is also adjustable with the forcedDC option
// pickSkillAndDoCheck({ actionName: "Recall Knowledge", forcedDC: 5 });
pickSkillAndDoCheck({ actionName: "Recall Knowledge" });

// doSkillCheckOnTarget({
//   skillName: 'Esoteric Lore',
//   skillKey: 'esoteric-lore',
//   actionName: 'Recall Knowledge',
//   modifiers: [getTomeRKModifier()]
// })
