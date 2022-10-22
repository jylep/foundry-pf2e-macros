let damage = Math.floor(2 + actor.data.data.details.level.value / 2);
let content = `
<div class="pf2e chat-card item-card">
    <header class="card-header flexrow">
      <img src="systems/pf2e/icons/default-icons/weapon.webp" title="Thaumaturge Stuff" width="36" height="36">
      <h3>Thaumaturge stuff</h3>
    </header>
  <div class="card-content">
    <hr/>
    <p>
      <span data-pf2-check="esoteric-lore" data-pf2-traits="concentrate,secret,skill">Esoteric Lore Related Rolls</span>
    </p>
    <hr/>

    <hr/>
    <h3>Personal Antithesis Damage</h3>
    <div class="dice-roll">
      <div class="dice-result">
        <h4 class="dice-total"><span id="value">${damage}</span></h4>
      </div>
    </div>
    <div class="chat-damage-buttons">
    <button type="button" class="full-damage" title="Apply full damage to selected tokens.">
        <i class="fas fa-heart-broken"></i>
        <span class="label">Damage</span>
    </button>
    <button type="button" class="half-damage" title="Apply half damage to selected tokens.">
        <i class="fas fa-heart-broken"></i>
        <span class="transparent-half"></span>
        <span class="label">Half</span>
    </button>
    <button type="button" class="double-damage" title="Apply double damage to selected tokens.">
        <img src="systems/pf2e/icons/damage/double.svg">
        <span class="label">Double</span>
    </button>
</div>
  </div>
</div>
`;

ChatMessage.create({
  user: game.user.id,
  content: damage,
  speaker: ChatMessage.getSpeaker(),
});
