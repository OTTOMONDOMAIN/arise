package com.example.teleport;

import org.bukkit.command.PluginCommand;
import org.bukkit.plugin.java.JavaPlugin;

public class TeleportPlugin extends JavaPlugin {

    @Override
    public void onEnable() {
        TeleportCommand teleportCommand = new TeleportCommand(this);
        PluginCommand command = getCommand("tp");
        if (command != null) {
            command.setExecutor(teleportCommand);
            command.setTabCompleter(teleportCommand);
        } else {
            getLogger().severe("Failed to register /tp command - command not defined in plugin.yml!");
        }
        getLogger().info("TeleportPlugin enabled successfully!");
    }

    @Override
    public void onDisable() {
        getLogger().info("TeleportPlugin disabled.");
    }
}
