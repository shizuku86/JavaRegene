import { world, system } from "@minecraft/server";

system.runInterval(() => {
    if (world.gameRules.naturalRegeneration) world.gameRules.naturalRegeneration = false;

    const players = world.getPlayers();
    players.forEach(player => {
        const health = player.getComponent("minecraft:health");
        const missingValue = health.effectiveMax - health.currentValue;
        let regeneInterval = player.getDynamicProperty("regeneInterval") ?? 80;

        if (missingValue === 0) {
            player.setDynamicProperty("regeneInterval", 20);
            return;
        }

        const hunger = player.getComponent("minecraft:player.hunger");
        // const exhaustion = player.getComponent("minecraft:player.exhaustion");
        const saturation = player.getComponent("minecraft:player.saturation");

        if (hunger.currentValue === hunger.defaultValue && saturation.currentValue > 0) {
            if (regeneInterval > 10) regeneInterval = 10;
            if (regeneInterval === 0) {
                health.setCurrentValue(Math.min(health.currentValue +1, health.effectiveMax));
                saturation.setCurrentValue(Math.max(saturation.currentValue -1.5, 0));

                regeneInterval = 10;
            }
            regeneInterval--;
        }
        else if (hunger.currentValue >= 18) {
            if (regeneInterval === 0) {
                health.setCurrentValue(Math.min(health.currentValue +1, health.effectiveMax));
                hunger.setCurrentValue(Math.max(hunger.currentValue -1, 0));
                regeneInterval = 80;
            }
            regeneInterval--;
        }
        player.setDynamicProperty("regeneInterval", regeneInterval);
    });
},1);