const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

// Serveur pour garder le bot en vie sur l'hébergeur
const server = http.createServer((req, res) => { res.end('OK'); });
server.listen(process.env.PORT || 3000);

// Client avec les Intents nécessaires pour lire les messages
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
});

client.once('clientReady', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // Ignorer les messages des autres bots
    if (message.author.bot) return;

    // Vérifier si le message commence par !say
    if (message.content.startsWith('!say ')) {
        // Extraire le message après "!say "
        const args = message.content.slice(5).trim();
        
        if (args.length > 0) {
            // Envoyer le message
            await message.channel.send(args);
            // Supprimer le message de la commande (optionnel)
            try { await message.delete(); } catch (e) { console.error("Impossible de supprimer le message"); }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
