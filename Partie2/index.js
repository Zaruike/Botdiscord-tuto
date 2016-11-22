const Discord = require("discord.js");
const client = new Discord.Client();
const weather = require("weather-js");
const token = "MjUwMDA1MDI3MTUyNzIzOTY5.CxOi3g.T12XrjS8QW6qjTG6qwkIODRUNhI";
const Wiki = require("wikijs");
var yt = require("./youtube_plugin");
var youtube_plugin = new yt();
var AuthDetails = require("./auth.json");

var prefix = ".";
var mention = "<@1930903359700619264>";
var memberCount = client.users.size;
var servercount = client.guilds.size;

client.on("ready", () => {
	var servers = client.guilds.array().map(g => g.name).join(',');
	console.log("--------------------------------------");
console.log('[!]Connexion en cours... \n[!]Veuillez Patienté! \n[!]Les évenement sont après ! :)  \n[!]Les préfix actuelle:  ' + prefix + "\n[!]Mentions = " + mention + "\n[!]Nombre de membres: " + memberCount + "\n[!]Nombre de serveurs: " + servercount);
});

client.on('message', message => {
	if (message.content === ("test")){
	message.reply('test !');
} else if (message.content === ("bonjour")){
	message.reply('bonjour à toi ');
} else if(message.content.startsWith('!botname')){
	client.user.setUsername(message.content.substr(9));
} else if (message.content === "!stats") {
	let m = " ";
	m += 'Il y a actuellement  ${message.guild.channels.size} channels sur ce serveurs \n';
	m += 'je suis en compagnie de ${message.guild.members.size} membres';
	m += 'je suis présent dans ${client.guild.size} serveurs \n';
	message.author.sendMessage(m).catch(console.log); 
} 
else if (message.content.startsWith("!méteo")){
    var location = message.content.substr(6);
    var unit = "C";
    
    try {
        weather.find({search: location, degreeType: unit}, function(err, data) {
            if(err) {
                console.log(Date.now(), "DANGER", "Je ne peut pas trouvé d'information pour la méteo de " + location);
                message.reply("\n" + "Je ne peut pas trouvé d'information pour la méteo de " + location);
            } else {
                data = data[0];
               console.log("**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
               message.reply("\n" + "**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
            }
        });
    } catch(err) {
        console.log(Date.now(), "ERREUR", "Weather.JS a rencontré une erreur");
        message.reply("Idk pourquoi c'est cassé tbh :(");
        }
    }
else if (message.content.startsWith("!wiki")){
            if(!message.content.substr(5)) {
                console.log(Date.now(), "DANGER", "Vous devez fournir un terme de recherche.");
                message.reply("Vous devez fournir un terme de recherche.");
                return;
            }
            var wiki = new Wiki.default();
            wiki.search(message.content.substr(5)).then(function(data) {
                if(data.results.length==0) {
                    console.log(Date.now(), "DANGER","Wikipedia ne trouve pas ce que vous avez demandée : " + message.content.substr(5));
                    message.reply("Je ne peut trouvé ce que vous voulez dans Wikipedia :(");
                    return;
                }
                wiki.page(data.results[0]).then(function(page) {
                    page.summary().then(function(summary) {
                        if(summary.indexOf(" may refer to:") > -1 || summary.indexOf(" may stand for:") > -1) {
                            var options = summary.split("\n").slice(1);
                            var info = "Selectioné une options parmis celle-ci :";
                            for(var i=0; i<options.length; i++) {
                                info += "\n\t" + i + ") " + options[i];
                            }
                            message.reply(info);
                            selectMenu(message.channel, message.author.id, function(i) {
                                commands.wiki.process(Client, message, options[i].substring(0, options[i].indexOf(",")));
                            }, options.length-1);
                        } else {
                            var sumText = summary.split("\n");
                            var count = 0;
                            var continuation = function() {
                                var paragraph = sumText.shift();
                                if(paragraph && count<3) {
                                    count++;
                                    message.reply(message.channel, paragraph, continuation);
                                }
                            };
                            message.reply("**Trouvé " + page.raw.fullurl + "**", continuation);
                        }
                    });
                });
            }, function(err) {
                console.log(Date.now(), "ERREUR","Impossible de se connecté a Wikipédia");
                message.reply("Uhhh...Something went wrong :(");
            });
        
} else if (message.content.startsWith('!youtube')){
youtube_plugin.respond(message.content, message.channel , client);
}
});

client.login(token)