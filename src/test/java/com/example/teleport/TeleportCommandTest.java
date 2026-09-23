package com.example.teleport;

import org.bukkit.ChatColor;
import org.bukkit.Location;
import org.bukkit.Server;
import org.bukkit.command.Command;
import org.bukkit.command.ConsoleCommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.Plugin;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TeleportCommandTest {

    private Plugin plugin;
    private Server server;
    private TeleportCommand teleportCommand;
    private Command command;

    @BeforeEach
    void setUp() {
        plugin = Mockito.mock(Plugin.class);
        server = Mockito.mock(Server.class);
        command = Mockito.mock(Command.class);

        Mockito.when(plugin.getServer()).thenReturn(server);
        teleportCommand = new TeleportCommand(plugin);
    }

    @Test
    void testNoArgsMessage() {
        Player player = Mockito.mock(Player.class);

        boolean result = teleportCommand.onCommand(player, command, "tp", new String[]{});

        assertTrue(result);
        Mockito.verify(player).sendMessage(ChatColor.RED + "Usage: /tp <player> [target]");
    }

    @Test
    void testConsoleSingleArgError() {
        ConsoleCommandSender console = Mockito.mock(ConsoleCommandSender.class);

        boolean result = teleportCommand.onCommand(console, command, "tp", new String[]{"Alice"});

        assertTrue(result);
        Mockito.verify(console).sendMessage(ChatColor.RED + "Console must specify two players: /tp <player1> <player2>");
    }

    @Test
    void testPlayerNoPermissionSingleArg() {
        Player player = Mockito.mock(Player.class);
        Mockito.when(player.hasPermission("teleportplugin.tp")).thenReturn(false);

        boolean result = teleportCommand.onCommand(player, command, "tp", new String[]{"Alice"});

        assertTrue(result);
        Mockito.verify(player).sendMessage(ChatColor.RED + "You do not have permission to use this command!");
    }

    @Test
    void testPlayerTeleportToTargetSuccess() {
        Player player = Mockito.mock(Player.class);
        Player target = Mockito.mock(Player.class);
        Location targetLoc = Mockito.mock(Location.class);

        Mockito.when(player.hasPermission("teleportplugin.tp")).thenReturn(true);
        Mockito.when(server.getPlayer("Alice")).thenReturn(target);
        Mockito.when(target.isOnline()).thenReturn(true);
        Mockito.when(target.getLocation()).thenReturn(targetLoc);
        Mockito.when(target.getName()).thenReturn("Alice");

        boolean result = teleportCommand.onCommand(player, command, "tp", new String[]{"Alice"});

        assertTrue(result);
        Mockito.verify(player).teleport(targetLoc);
        Mockito.verify(player).sendMessage(ChatColor.GREEN + "Teleported to Alice.");
    }

    @Test
    void testTeleportPlayer1ToPlayer2Success() {
        Player sender = Mockito.mock(Player.class);
        Player p1 = Mockito.mock(Player.class);
        Player p2 = Mockito.mock(Player.class);
        Location p2Loc = Mockito.mock(Location.class);

        Mockito.when(sender.hasPermission("teleportplugin.tp.others")).thenReturn(true);
        Mockito.when(server.getPlayer("Bob")).thenReturn(p1);
        Mockito.when(server.getPlayer("Charlie")).thenReturn(p2);
        Mockito.when(p1.isOnline()).thenReturn(true);
        Mockito.when(p2.isOnline()).thenReturn(true);
        Mockito.when(p1.getName()).thenReturn("Bob");
        Mockito.when(p2.getName()).thenReturn("Charlie");
        Mockito.when(p2.getLocation()).thenReturn(p2Loc);

        boolean result = teleportCommand.onCommand(sender, command, "tp", new String[]{"Bob", "Charlie"});

        assertTrue(result);
        Mockito.verify(p1).teleport(p2Loc);
        Mockito.verify(sender).sendMessage(ChatColor.GREEN + "Teleported Bob to Charlie.");
        Mockito.verify(p1).sendMessage(ChatColor.GREEN + "You were teleported to Charlie.");
    }

    @Test
    void testTeleportPlayer1ToPlayer2NoPermission() {
        Player sender = Mockito.mock(Player.class);

        Mockito.when(sender.hasPermission("teleportplugin.tp.others")).thenReturn(false);

        boolean result = teleportCommand.onCommand(sender, command, "tp", new String[]{"Bob", "Charlie"});

        assertTrue(result);
        Mockito.verify(sender).sendMessage(ChatColor.RED + "You do not have permission to teleport other players!");
    }

    @Test
    void testTabCompletion() {
        Player sender = Mockito.mock(Player.class);
        Player p1 = Mockito.mock(Player.class);
        Player p2 = Mockito.mock(Player.class);

        Mockito.when(p1.getName()).thenReturn("Alice");
        Mockito.when(p2.getName()).thenReturn("Bob");
        Mockito.doReturn(Arrays.asList(p1, p2)).when(server).getOnlinePlayers();

        List<String> completions = teleportCommand.onTabComplete(sender, command, "tp", new String[]{"a"});

        assertEquals(1, completions.size());
        assertEquals("Alice", completions.get(0));
    }
}
