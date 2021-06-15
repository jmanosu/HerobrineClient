const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 39111,
    username: 'Herobrine'
});

const effectStrings = [
    "speed",
    "slowness",
    "haste",
    "mining_fatigue",
    "strength",
    "instant_health",
    "instant_damage",
    "jump_boost",
    "nausea",
    "regeneration",
    "resistance",
    "fire_resistance",
    "water_breathing",
    "invisibility",
    "blindness",
    "night_vision",
    "hunger",
    "weakness",
    "posion",
    "wither",
    "health_boost",
    "absorption",
    "sturation",
    'glowing',
    "levitation",
    "luck",
    "unluck",
    "slow_falling",
    "conduit_power",
    "dolphins_grace",
    "bad_omen",
    "hero_of_the_village"
];

const particleStrings = [
    "ambient_entity_effect",
    "angry_villager",
    "ash",
    "barrier",
    "block",
    "bubble",
    "bubble_column_up",
    "bubble_pop",
    "campfire_cosy_smoke",
    "campfire_signal_smoke",
    "cloud",
    "composter",
    "crimson_spore",
    "crit",
    "current_down",
    "damage_indicator",
    "dolphin",
    "dragon_breath",
    "dripping_honey",
    "dripping_lava",
    "dripping_obsidian_tear",
    "dripping_water",
    "dust",
    "effect",
    "elder_guardian",
    "enchant",
    "enchanted_hit",
    "end_rod",
    "entity_effect",
    "explosion",
    "explosion_emitter",
    "falling_dust",
    "falling_honey",
    "falling_lava",
    "falling_nectar",
    "falling_obsidian_tear",
    "falling_water",
    "firework",
    "fishing",
    "flame",
    "flash",
    "happy_villager",
    "heart",
    "instant_effect",
    "item",
    "item_slime",
    "item_snowball",
    "landing_honey",
    "landing_lava",
    "landing_obsidian_tear",
    "large_smoke",
    "lava",
    "mycelium",
    "nautilus",
    "note",
    "poof",
    "portal",
    "rain",
    "reverse_portal",
    "smoke",
    "sneeze",
    "soul",
    "soul_fire_flame",
    "spit",
    "splash",
    "squid_ink",
    "sweep_attack",
    "totem_of_undying",
    "underwater",
    "warped_spore",
    "white_ash",
    "witch"
];

const spawnEntityCmd = (entity, position, effects = "") => {
    return `/summon minecraft:${ entity } ${ position.x } ${ position.y } ${ position.z } ${ effects }`;
}

const giveEffectCmd = (effect, seconds = 20, amplifier = 1, hideParticles = false) => {
    return `/effect give @a minecraft:${ effect } ${ seconds } ${ amplifier } ${ hideParticles }`
}

const spawnParticleCmd = (particle, position, offset = {x: 0, y:0, z:0}, speed = 1, count = 200) => {
    return `/particle minecraft:${ particle } ${ position.x } ${ position.y } ${ position.z } ${ offset.x } ${ offset.y } ${ offset.z } ${ speed } ${ count }`;
}

const playSoundCmd = (sound) => {
    return `/playsound minecraft:${ sound } master @a`;
}

const spawnRandomCreeperCluster = (bot, source) => {
    var i;
    for (i = 0; i < Math.floor(Math.random() * 6); i++) {
        var entity = 'creeper';

        var xOffset = Math.floor(Math.random() * 13) - 6;
        var yOffset = Math.floor(Math.random() * 13) - 6;
        var zOffset = Math.floor(Math.random() * 6);

        var effects = "{";

        if (Math.floor(Math.random() * 6) > 2) {
            effects = effects.concat('powered:1,');
        }

        for (i = 0; i < Math.floor(Math.random() * 3); i++) {
            if (Math.floor(Math.random() * 6) > 2) {
                effects = effects.concat(`ActiveEffects:[{Id: ${ Math.floor(Math.random() * 28) },Amplifier:0,Duration:1000000}],`);
            }
        }

        effects = effects.replace(/,$/, '');
        effects = effects.concat('}');

        bot.chat(spawnEntityCmd(entity, source.offset(xOffset, yOffset, zOffset), effects));
    }
}

const effectSwamp = (bot) => {
    effectStrings.forEach(effect => {
        bot.chat(giveEffectCmd(effect));
    });
}

const effectRandom = (bot) => {
    bot.chat(giveEffectCmd(effectStrings[Math.floor(Math.random() * effectStrings.length)]));
}

const particleSwamp = (bot, source) => {
    particleStrings.forEach(particle => {
        bot.chat(spawnParticleCmd(particle, source, {x: 0, y:0, z:0}, 1, 200));
    });
}

const particleRandom = (bot, source) => {
    bot.chat(spawnParticleCmd(particleStrings[Math.floor(Math.random() * particleStrings.length)], source));
}

const spook = (bot) => {
    bot.chat(playSoundCmd("entity.creeper.primed"));
    bot.chat(playSoundCmd("entity.creeper.hurt"));
    bot.chat(playSoundCmd("entity.zombie.attack_iron_door"));
    bot.chat(playSoundCmd("entity.zombie.ambient"));
    bot.chat(playSoundCmd("entity.zombie.break_wooden_door"));
    bot.chat(playSoundCmd("entity.elder_guardian.curse"));
    bot.chat(playSoundCmd("entity.ghast.hurt"));
    bot.chat(playSoundCmd("entity.enderman.scream"));
    bot.chat(playSoundCmd("entity.enderman.star"));
    bot.chat(playSoundCmd("ambient.cave"));
}

var date = new Date();
var lastSpawn = date.getTime();
var disabled = true;

bot.on('spawn', () => {
    bot.chat('/gamerule sendCommandFeedback false');
    spook(bot);
    bot.chat('/tellraw @a {"obfuscated":"true","text":"____________________________________________"}');
    spook(bot);
    bot.chat('/tellraw @a {"color":"red","text":"Your Death is near for I\'m Herobrine"}');
    spook(bot);
    bot.chat('/tellraw @a {"obfuscated":"true","text":"____________________________________________"}');
    spook(bot);

    disabled = false;
});

bot.on('physicsTick', () => {
    if (disabled) { return; }

    var newDate = new Date();
    if (newDate.getTime() - lastSpawn > 2000) {
        lastSpawn = newDate.getTime();
    } else {
        return
    }

    const nearest = (entity) => entity.type === 'player';
    const nearestEntity = bot.nearestEntity(nearest);

    if (!nearestEntity) return;

    bot.chat('/stopsound @a');
    bot.chat(spawnEntityCmd('lightning_bolt', nearestEntity.position));
    spawnRandomCreeperCluster(bot, nearestEntity.position);
    effectRandom(bot);
    particleRandom(bot, nearestEntity.position);
    spook(bot);
});