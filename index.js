const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

// Initialisation du client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Définition de la commande /say
const command = new SlashCommandBuilder()
    .setName('say')
    .setDescription('Le bot répète votre message')
    .addStringOption(option => 
        option.setName('message')
            .setDescription('Ce que le bot doit dire')
            .setRequired(true));

// Gestion de l'interaction
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'say') {
        const message = interaction.options.getString('message');
        
        // Envoi du message (ephemeral: true signifie que seul l'auteur voit la confirmation, 
        // optionnel si vous voulez que le bot parle dans le canal)
        await interaction.reply({ content: 'Message envoyé !', ephemeral: true });
        await interaction.channel.send(message);
    }
});

// Connexion et enregistrement de la commande
client.once('ready', async () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    
    // Enregistrement dynamique de la commande
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: [command.toJSON()] });
        console.log('Commande /say enregistrée avec succès.');
    } catch (error) {
        console.error(error);
    }
});

// Connexion sécurisée via la variable d'environnement
client.login(process.env.DISCORD_TOKEN);
