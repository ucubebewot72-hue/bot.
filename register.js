const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('ticket-panel')
        .setDescription('Ticket panelini gönderir.')
        .toJSON()
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Komut yükleniyor...");
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log("Komut yüklendi!");
    } catch (e) {
        console.log(e);
    }
})();
