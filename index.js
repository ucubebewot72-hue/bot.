const { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ChannelType 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.login(process.env.TOKEN);

// Ticket numarası hafızası
let ticketCount = 0;

// Yetkili rolü (buraya sunucundaki mod/admin rol ID’sini gir)
const STAFF_ROLE = "YETKILI_ROL_ID";

client.on("ready", () => {
    console.log(`Bot açıldı: ${client.user.tag}`);
});



// PANEL KOMUTU
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ticket-panel") {

        const embed = new EmbedBuilder()
            .setTitle("🎟️ Create a Ticket")
            .setDescription(
                "Before creating a ticket please read the information below:\n\n" +
                "• Check **#tutorials** and **#faq** channels.\n" +
                "• Try searching in **#support** first.\n" +
                "• Report impersonators immediately.\n\n" +
                "**Select a ticket category below:**"
            )
            .setColor("Blue");

        const menu = new StringSelectMenuBuilder()
            .setCustomId("ticket_menu")
            .setPlaceholder("Select a ticket category")
            .addOptions(
                {
                    label: "Support & Questions",
                    value: "support",
                    emoji: "❓",
                    description: "Questions about server, rules or events."
                },
                {
                    label: "Claim Events/Giveaways Prizes",
                    value: "giveaway",
                    emoji: "🎁",
                    description: "You won a prize and want to claim it."
                },
                {
                    label: "Report a Member",
                    value: "report",
                    emoji: "⚠️",
                    description: "Report inappropriate behavior."
                }
            )

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({ embeds: [embed], components: [row] });
    }
});



// TICKET OLUŞTURMA
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== "ticket_menu") return;

    ticketCount++; // ticket numaralandırma
    const ticketNumber = ticketCount;

    const category = interaction.values[0];
    const guild = interaction.guild;

    // Kategoriye göre kanal ismi
    const names = {
        support: "support",
        giveaway: "prize",
        report: "report"
    };

    const channelName = `ticket-${ticketNumber}-${names[category]}`;

    // Kanal oluşturma
    const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.roles.everyone.id,
                deny: ["ViewChannel"]
            },
            {
                id: interaction.user.id,
                allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
            },
            {
                id: STAFF_ROLE, // yetkili rolü
                allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
            }
        ]
    });

    await interaction.reply({ 
        content: `🎟️ Ticket oluşturuldu: ${channel}`, 
        ephemeral: true 
    });

    const openEmbed = new EmbedBuilder()
        .setTitle(`🎫 Ticket #${ticketNumber}`)
        .setDescription(`Merhaba ${interaction.user}, sorunu buraya yazabilirsin.`)
        .setColor("Green");

    channel.send({ embeds: [openEmbed] });
});
