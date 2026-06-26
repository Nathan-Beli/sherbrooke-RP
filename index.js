const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const http = require('http'); // 1. Ajout du module http

// 2. Création d'un serveur minimal pour satisfaire le Health Check
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot est en ligne !');
});
server.listen(process.env.PORT || 3000); // Utilise le port assigné par l'hébergeur

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const command = new SlashCommandBuilder()
    .setName('say')
    .setDescription('Le bot répète votre message')
    .addStringOption(option => 
        option.setName('message')
            .setDescription('Ce que le bot doit dire')
            .setRequired(true));

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'say') {
        const message = interaction.options.getString('message');
        await interaction.reply({ content: 'Message envoyé !', ephemeral: true });
        await interaction.channel.send(message);
    }
});

// Note : Correction de l'événement en 'clientReady' comme indiqué dans vos logs
client.once('clientReady', async () => { 
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: [command.toJSON()] });
        console.log('Commande /say enregistrée avec succès.');
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_TOKEN);
