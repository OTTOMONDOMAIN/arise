package com.example.teleport;

import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import org.bukkit.plugin.Plugin;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TeleportCommand implements CommandExecutor, TabCompleter {

    private final Plugin plugin;

    public TeleportCommand(Plugin plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            sender.sendMessage(ChatColor.RED + "Usage: /tp <player> [target]");
            return true;
        }

        if (args.length == 1) {
            if (!(sender instanceof Player player)) {
                sender.sendMessage(ChatColor.RED + "Console must specify two players: /tp <player1> <player2>");
                return true;
            }

            if (!player.hasPermission("teleportplugin.tp")) {
                player.sendMessage(ChatColor.RED + "You do not have permission to use this command!");
                return true;
            }

            Player target = plugin.getServer().getPlayer(args[0]);
            if (target == null || !target.isOnline()) {
                player.sendMessage(ChatColor.RED + "Player '" + args[0] + "' is not online!");
                return true;
            }

            player.teleport(target.getLocation());
            player.sendMessage(ChatColor.GREEN + "Teleported to " + target.getName() + ".");
            return true;
        }

        if (args.length == 2) {
            if (!sender.hasPermission("teleportplugin.tp.others")) {
                sender.sendMessage(ChatColor.RED + "You do not have permission to teleport other players!");
                return true;
            }

            Player playerToTeleport = plugin.getServer().getPlayer(args[0]);
            Player destinationPlayer = plugin.getServer().getPlayer(args[1]);

            if (playerToTeleport == null || !playerToTeleport.isOnline()) {
                sender.sendMessage(ChatColor.RED + "Player '" + args[0] + "' is not online!");
                return true;
            }

            if (destinationPlayer == null || !destinationPlayer.isOnline()) {
                sender.sendMessage(ChatColor.RED + "Player '" + args[1] + "' is not online!");
                return true;
            }

            playerToTeleport.teleport(destinationPlayer.getLocation());
            sender.sendMessage(ChatColor.GREEN + "Teleported " + playerToTeleport.getName() + " to " + destinationPlayer.getName() + ".");
            playerToTeleport.sendMessage(ChatColor.GREEN + "You were teleported to " + destinationPlayer.getName() + ".");
            return true;
        }

        sender.sendMessage(ChatColor.RED + "Usage: /tp <player> [target]");
        return true;
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        if (args.length == 1 || args.length == 2) {
            String search = args[args.length - 1].toLowerCase();
            List<String> matches = new ArrayList<>();
            for (Player player : plugin.getServer().getOnlinePlayers()) {
                if (player.getName().toLowerCase().startsWith(search)) {
                    matches.add(player.getName());
                }
            }
            return matches;
        }
        return Collections.emptyList();
    }
}
