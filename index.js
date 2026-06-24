// Charger les variables d'environnement
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

// Initialisation du client avec les permissions nécessaires
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
});

// Événement quand le bot est prêt
client.once('ready', () => {
    console.log(`Le bot est connecté en tant que ${client.user.tag}!`);
});

// Connexion du bot en utilisant le token stocké dans .env
client.login(process.env.DISCORD_TOKEN);
