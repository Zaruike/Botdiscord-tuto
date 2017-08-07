const Discord = require("discord.js"),
client = new Discord.Client(),
weather = require("weather-js"),
token = "MjUwMDA1MDI3MTUyNzIzOTY5.CxOi3g.T12XrjS8QW6qjTG6qwkIODRUNhI";
Wiki = require("wikijs"),
express = require("express"),
app = express(),
yt = require("./youtube_plugin"),
youtube_plugin = new yt(),
AuthDetails = require("./auth.json"),
Music = require("./Music.js"),
functionHelper = require('./functionHelpers.js'),
ffmpeg = require("ffmpeg"),
search = require('youtube-search'),
music = new Music(),
con = console.log,
prefix = "!";
const randomWordFR = require('random-word-fr');
var moment = require("moment");
var mention = "<@1930903359700619264>";
const opts = {
  maxResults: 3,
  key: AuthDetails.youtube_api_key
};
setInterval(function(){ client.user.setGame('with ' + randomWordFR()) }, 4000);
client.on("ready", () => {
var memberCount = client.users.size;
var servercount = client.guilds.size;
    var servers = client.guilds.array().map(g => g.name).join(',');
    con("--------------------------------------");
con('[!]Connexion en cours... \n[!]Veuillez Patienté! \n[!]Les évenement sont après ! :)  \n[!]Les préfix actuelle:  ' + prefix + "\n[!]Mentions = " + mention + "\n[!]Nombre de membres: " + memberCount + "\n[!]Nombre de serveurs: " + servercount);
});
var messages = [];
client.on('message', message => {
  const msgc = message.content;
   music.setVoiceChannel(message.member.voiceChannel);
    var array_msg = msgc.split(' ');
            messages.push(message);
            switch (array_msg[0]) {
        case (prefix +"play") :
            con("Play");
            message.delete(message.author);
            if (!music.getVoiceChannel()) return message.reply("Veuillez vous connectez en vocal !");
            if (music.getTab(0) == null) return message.reply('Aucune musique, merci d\' en ajouté.');
            else music.voice();
            break;
        case (prefix +"pause") :
            con("Pause");
            message.delete(message.author);
            if (!music.getVoiceChannel()) return message.reply("Veuillez vous connectez en vocal !");
            if (music.getTab(0) == null) return message.reply('Aucune musique, merci d\' en ajouté.');
            music.pause();
            break;
        case (prefix + "resume") :
            con("Resume");
            message.delete(message.author);
            if (!music.getVoiceChannel()) return message.reply("Veuillez vous connectez en vocal !");
            if (music.getTab(0) == null) return message.reply('Aucune musique, merci d\' en ajouté.');
            music.resume();
            break;
        case (prefix + "stop") :
            con("Stop");
            message.delete(message.author);
            if (!music.getVoiceChannel()) return message.reply("Veuillez vous connectez en vocal !");
            if (music.getTab(0) == null) return message.reply('Aucune musique, merci d\' en ajouté.');
            else music.stop();
            message.reply("La queue à était vidé !");
            break;
        case (prefix +"add") :
            con("Add");
            message.delete(message.author);
            var link = msgc.split(' ');
            link.shift();
            link = link.join(' ');
            search(link, opts, function(err, results) {
                if(err) return con(err);
                for (var y = 0; results[y].kind == 'youtube#channel'; y++);
                message.channel.sendMessage(results[y].link);
                music.setTabEnd(results[y].link);
            });
            break;
        case (prefix +"link") :
            con("Link");
            message.delete(message.author);
            var link = msgc.split(' ');
            link.shift();
            link = link.join(' ');
            con(link);
            music.setTabEnd(link);
            break;
        case (prefix +"volume") :
            con("Volume");
            message.delete(message.author);
            var link = msgc.split(' ');
            link.shift();
            link = link.join(' ');
            music.volume(link/100);
            message.reply("le volume et maintenant à :" + link);
            break;
        case (prefix +"next") :
            con("Next");
            message.delete(message.author);
            if (music.getI() < music.getLengthTab()) music.setI(this.i + 1);
            if (music.getI() >= music.getLengthTab()) music.setI(0);
            music.next();
            break;
    }   if (msgc === ("test")){
    message.reply('test !');
}else if (msgc.startsWith(prefix +"say")){
    message.delete(message.author);
    var say = msgc.substr(5);
    message.reply(say);
}

    else if (msgc === (prefix + "channel")){
    const data = client.channels.get(message.channel.id);
    moment.locale("fr");
    var temps = moment(data.createdTimestamp).format("LLLL");
    con(temps)
    message.reply("\n" + "```javascript"+ "\n" + "Nom du channel: " + data.name + "\n" + "Type de channel: " + data.type + "\n" +
    "Channel id: " + data.id + "\n" + "Topic: " + data.topic + "\n" + "Créer le: " + temps + "```" );
    con("\n" + "**" + "Channel id: " + data.id + "**" );
    con(data);
    }
 else if (msgc === ("bonjour")){
    message.reply('bonjour à toi ');
} else if(msgc.startsWith(prefix +'botname')){
    client.user.setUsername(msgc.substr(9));
} else if (msgc === (prefix +"stats")) {
    var memberCount = client.users.size;
var servercount = client.guilds.size;
    let m = " ";
    m += 'je suis en compagnie de '+ memberCount +' membres';
    m += 'je suis présent dans '+ servercount+' serveurs \n';
    message.author.sendMessage(m).catch(con); 
} 
else if (msgc.startsWith(prefix + "méteo")){
    var location = msgc.substr(6);
    var unit = "C";
    
    try {
        weather.find({search: location, degreeType: unit}, function(err, data) {
            if(err) {
                con(Date.now(), "DANGER", "Je ne peut pas trouvé d'information pour la méteo de " + location);
                message.reply("\n" + "Je ne peut pas trouvé d'information pour la méteo de " + location);
            } else {
                data = data[0];
               con("**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
               message.reply("\n" + "**" + data.location.name + " Maintenant : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", ressentie " + data.current.feelslike + "°, " + data.current.winddisplay + " Vent\n\n**Prévisions pour demain :**\nHaut: " + data.forecast[1].high + "°, Bas: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " avec " + data.forecast[1].precip + "% de chance de precipitation.");
            }
        });
    } catch(err) {
        con(Date.now(), "ERREUR", "Weather.JS a rencontré une erreur");
        message.reply("Idk pourquoi c'est cassé tbh :(");
        }
    }
else if (msgc.startsWith(prefix + "wiki")){
            if(!msgc.substr(5)) {
                con(Date.now(), "DANGER", "Vous devez fournir un terme de recherche.");
                message.reply("Vous devez fournir un terme de recherche.");
                return;
            }
            var wiki = new Wiki.default();
            wiki.search(msgc.substr(5)).then(function(data) {
                if(data.results.length==0) {
                    con(Date.now(), "DANGER","Wikipedia ne trouve pas ce que vous avez demandée : " + msgc.substr(5));
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
                con(Date.now(), "ERREUR","Impossible de se connecté a Wikipédia");
                message.reply("Uhhh...Something went wrong :(");
            });
        
} 

            if(msgc.startsWith(prefix +"info")) {
    var memberavatar = message.author.avatarURL
    var membername = message.author.username
       var mentionned = message.mentions.users.first();
      var getvalueof;
      if(mentionned){
          var getvalueof = mentionned;
      } else {
          var getvalueof = message.author;
      }

      if(getvalueof.bot == true){
          var checkbot = "L'utilisateur est un bot";
      } else {
          var checkbot = "N'est pas un bot";
      }
      if(getvalueof.presence.status == 'online'){
        var status = "En ligne"; 
      }else {
        var status = "Hors ligne";
      }

    message.channel.sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: 'Pseudo',
            value: getvalueof.username,
            inline: true
          }, {
            name: 'User id',
            value: getvalueof.id,
            inline: true
          },{
            name: 'Discriminateur',
            value: getvalueof.discriminator,
            inline: true
},{
            name: 'Status',
            value: status,
            inline: true
},{
            name: 'Bot',
            value: checkbot,
            inline: true
}],
        image: {
      url: getvalueof.avatarURL
        },
          color: 0xE46525,
          footer: {
            text: 'by Jorisvidéo',
            proxy_icon_url: ' '
          },

          author: {
            name: membername,
            icon_url: memberavatar,
            proxy_icon_url: ' '
          }
        }
});
}
  else if(message.content.startsWith(prefix +'kick')){
            let modRole = message.guild.roles.find("name", "Mod");
if(!message.member.roles.has(modRole.id)) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      } 
    if(!message.guild.roles.exists("name", "Mod")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Mod** n'existe pas dans ce serveur veuillez le créer pour Kick! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      } 
if(message.mentions.users.size === 0) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez Kick. **Format ~> `!kick @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
}
let kickMember = message.guild.member(message.mentions.users.first());
if(!kickMember) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
}
if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
  return message.reply("Je n'ai pas la permissions ** __(KICK_MEMBERS)__ **!").catch(console.error);
}
         if(!message.guild.channels.exists("name", "admin-logs")){
// créer le channel
message.guild.createChannel('admin-logs');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `admin-logs` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par Emiliabot."
}
}}).catch(console.error);
}   
kickMember.kick().then(member => {
    message.channel.sendMessage("", {embed: {
          title: "Succès :white_check_mark:",
          color: 0xff0000,
          description: `${member.user.username}`+` à bien été kick`,
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
}).then(message.guild.channels.find('name','admin-logs').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: kickMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: kickMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "Kick",
            inline: true
},{
            name: 'Modérateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Moderation',
            proxy_icon_url: ' '
          },

          author: { 
            name: kickMember.user.username + "#"+ kickMember.user.discriminator,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
 else if(message.content.startsWith(prefix +'ban')){
            let modRole = message.guild.roles.find("name", "Mod");
if(!message.member.roles.has(modRole.id)) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      } 
    if(!message.guild.roles.exists("name", "Mod")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Mod** n'existe pas dans ce serveur veuillez le créer pour Kick! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      } 
if(message.mentions.users.size === 0) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez Kick. **Format ~> `!ban @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
}
let banMember = message.guild.member(message.mentions.users.first());
if(!banMember) {
  return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
}
if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
  return message.reply("Je n'ai pas la permissions ** __(BAN_MEMBERS)__ **!").catch(console.error);
}
         if(!message.guild.channels.exists("name", "admin-logs")){
// créer le channel
message.guild.createChannel('admin-logs');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `admin-logs` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par Emiliabot."
}
}}).catch(console.error);
}   
banMember.ban().then(member => {
    message.channel.sendMessage("", {embed: {
          title: "Succès :white_check_mark:",
          color: 0xff0000,
          description: `${member.user.username}`+` à bien été ban`,
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
}).then(message.guild.channels.find('name','admin-logs').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: banMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: banMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "ban",
            inline: true
},{
            name: 'Modérateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Moderation',
            proxy_icon_url: ' '
          },

          author: { 
            name: banMember.user.username + "#"+ banMember.user.discriminator,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
        else if(message.content.startsWith(prefix +'mute')){
            let modRole = message.guild.roles.find("name", "Mod");
    if(!message.guild.roles.exists("name", "mute")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **mute** n'existe pas dans ce serveur veuillez le créer pour Mute! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      } 
      if(!message.member.roles.has(modRole.id)) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      } 
      if(message.mentions.users.size === 0) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez mute totalment. **Format ~> `!mute @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      }
      let muteMember = message.guild.member(message.mentions.users.first());
      if(!muteMember) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      }
      if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) {
        return message.reply("Je n'ai pas la permissions pour faire cela __(MANAGE_MESSAGES)__ !").catch(console.error);
      }
         if(!message.guild.channels.exists("name", "admin-logs")){
// créer le channel
message.guild.createChannel('admin-logs');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `admin-logs` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par Emiliabot."
}
}}).catch(console.error);
}     
let mutedRole = message.guild.roles.find("name", "mute");
    var time = 500000;
    console.log(muteMember);
      muteMember.addRole(mutedRole).then(member => {
        message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :white_check_mark:  Vous avez bien mute ** "+ muteMember + " dans le serveur "+message.guild.name  + " ! :white_check_mark: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).then(message.guild.channels.find('name','admin-logs').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: muteMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: muteMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "mute total",
            inline: true
},{
            name: 'Modérateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Moderation',
            proxy_icon_url: ' '
          },

          author: { 
            name: muteMember.user.username,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
        )}
       else if(message.content.startsWith(prefix +'unmute')){
            let modRole = message.guild.roles.find("name", "Mod");
            if(!message.guild.roles.exists("name", "Mod")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Mod** n'existe pas dans ce serveur veuillez le créer pour unmute! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      }
    if(!message.guild.roles.exists("name", "mute")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **mute** n'existe pas dans ce serveur veuillez le créer pour Unmute! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      } 
      if(!message.member.roles.has(modRole.id)) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      } 
      if(message.mentions.users.size === 0) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Merci de spécifié l'utilisateur que vous voulez unmute totalment. **Format ~> `!unmute @mention`** ! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      }
      let muteMember = message.guild.member(message.mentions.users.first());
      if(!muteMember) {
        return message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x:  L\'utilisateur que vous avez entré n'est pas valide ! :x:",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      }
      if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) {
        return message.reply("Je n'ai pas la permissions pour faire cela __(MANAGE_MESSAGES)__ !").catch(console.error);
      }
         if(!message.guild.channels.exists("name", "admin-logs")){
// créer le channel
message.guild.createChannel('admin-logs');
// Affiche un message d'erreur expliquant que le channel n'existait pas
return message.channel.sendMessage("", {embed: {
title: "Erreur:",
color: 0xff0000,
description: " :no_entry_sign: Le salon textuel `admin-logs` n'existait pas, je viens de le créer pour vous :white_check_mark: , Veuillez réessayer :wink:",
footer: {
text: "Message par Emiliabot."
}
}}).catch(console.error);
}   
let mutedRole = message.guild.roles.find("name", "mute");
    var time = 500000;
    console.log(muteMember);
      muteMember.removeRole(mutedRole).then(member => {
        message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :white_check_mark:  Vous avez bien unmute ** "+ muteMember + " dans le serveur "+message.guild.name  + " ! :white_check_mark: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).then(message.guild.channels.find('name','admin-logs').sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: '**L\'utilisateur <~>**',
            value: muteMember.user.username,
            inline: true
          }, {
            name: 'User id',
            value: muteMember.id,
            inline: true
          },{
            name: '**Action <~>**',
            value: "unmute total",
            inline: true
},{
            name: 'Modérateur',
            value: message.author.username,
            inline: true
}],
       
          color: 0xD30000,
          footer: {
            text: 'Moderation',
            proxy_icon_url: ' '
          },

          author: { 
            name: muteMember.user.username,
            icon_url: " ",
            proxy_icon_url: ' '
          }
        }
})).catch(console.error);
        }
        )}else if (message.content.startsWith(prefix +"clear")) {
      let modRole = message.guild.roles.find("name", "Mod");
            if(!message.guild.roles.exists("name", "Mod")) {
        return  message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Le rôle **Mod** n'existe pas dans ce serveur veuillez le créer pour Clear! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      } 
      if(!message.member.roles.has(modRole.id)) {
        return   message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :no_entry_sign: Vous n'avez pas la permissions d'utiliser cette commande ! :no_entry_sign: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }}).catch(console.error);
      }
    var args = message.content.substr(7);
      if(args.length === 0){
        message.channel.sendMessage("", {embed: {
          title: "Erreur:",
          color: 0xff0000,
          description: " :x: Vous n'avez pas précisser le nombre :x: ",
          footer: {
            text: "Message par Emiliabot."
          }
        }});
      }
      else {
        var msg;
        if(args.length === 1){
        msg = 2;
      } else {
        msg = parseInt(args[1]);
      }
      message.channel.fetchMessages({limit: msg}).then(messages => message.channel.bulkDelete(messages)).catch(console.error);
      message.channel.sendMessage("", {embed: {
        title: "Success!",
        color: 0x06DF00,
        description: "Messages Suprimé!",
        footer: {
          text: "Message par Emiliabot."
        }
      }});
      }
}
else if (msgc.startsWith('!youtube')){
youtube_plugin.respond(message.content, message.channel , client);
}else if (msgc.startsWith(prefix +'google')){
const google = require("google");
const unirest = require("unirest");

  if(msgc.substr(8)) {
    let query = msgc.substr(8);
      con(query);
    let num = (msgc.substr(8).lastIndexOf(" ") + 1);
    if(!query || isNaN(num)) {
      query = msgc.substr(8);
      num = 0;
    }
    if(num < 0 || num > 2) {
      num = 0;
    } else {
      num = parseInt(num);
    }
    unirest.get(`https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(query)}&key=${AuthDetails.youtube_api_key}&limit=1&indent=True`).header("Accept", "application/json").end(res => {
      const doSearch = () => {
        google(query, (err, res) => {
          if(err || res.links.length == 0) {
            message.channel.sendMessage("🙅 No results!");
          } else {
            const results = [];
            if(num == 0) {
              num = 1;
            }
            for(let i=0; i < Math.min(res.links.length, num); i++) {
              if([`News for ${query}`, `Images for ${query}`].indexOf(res.links[i].title)>-1) {
                res.links.splice(i, 1);
                i--;
                continue;
              }
          message.channel.sendMessage({
        embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: 'Result Google',
            value: `[${res.links[i].title}](`+`${res.links[i].href})`,
            inline: true
          },{
            name: '** **',
            value: `${res.links[i].description}`,
            inline: true
          }],
           thumbnail: {
             url: "http://diylogodesigns.com/blog/wp-content/uploads/2016/04/google-logo-icon-PNG-Transparent-Background.png"
                },
          color: 3447003,
          footer: {
            text: 'by Jorisvidéo',
            proxy_icon_url: ' '
          }
        }
});
            }

          }
        });
      };
      
      if(res.status == 200 && res.body.itemListElement[0] && res.body.itemListElement[0].result && res.body.itemListElement[0].result.detailedDescription) {
        message.channel.sendMessage(`\`\`\`${res.body.itemListElement[0].result.detailedDescription.articleBody}\`\`\`<${res.body.itemListElement[0].result.detailedDescription.url}>`).then(() => {
          if(num > 0) {
            doSearch();
          }
        });
      } else {
        doSearch();
      }
    });
  } else {
    con(`Parameters not provided for !google command`);
    message.channel.sendMessage(` ❓❓❓`);
  }
}else if (msgc.startsWith(prefix +'imdb')){
const unirest = require("unirest");

let  query = msgc.substr(6);
  let type = "";
  if(query.toLowerCase().indexOf("series ")==0 || query.toLowerCase().indexOf("episode ")==0 || query.toLowerCase().indexOf("movie ")==0) {
    type = `&type=${query.substring(0, query.indexOf(" ")).toLowerCase()}`;
    query = query.substring(query.indexOf(" ")+1);
  }
  if(query) {
    unirest.get(`http://www.omdbapi.com/?t=${encodeURIComponent(query)}&r=json${type}`).header("Accept", "application/json").end(res => {
      if(res.status==200 && res.body.Response=="True") {
        message.channel.sendMessage({
                  embed: {
          type: 'rich',
          description: '',
          fields: [{
            name: 'Results Imdb :film_frames:',
            value:  `[${res.body.Title}${type ? "" : (` (${res.body.Type.charAt(0).toUpperCase()}${res.body.Type.slice(1)})`)}](http://www.imdb.com/title/${res.body.imdbID}/)`,
            inline: false
          },{
            name: '** **',
            value:  `\`\`\`${res.body.Plot}\`\`\``,
            inline: false
          },{
            name: 'Year',
            value:  `${res.body.Year}`,
            inline: true
          },{
            name: 'Rated',
            value:  `${res.body.Rated}`,
            inline: true
          },{
            name: 'Runtime',
            value:  `${res.body.Runtime}`,
            inline: true
          },{
            name: 'Director',
            value:  `${res.body.Director}`,
            inline: true
          },{
            name: 'Writer',
            value:  `${res.body.Writer}`,
            inline: true
          },{
            name: 'Actors',
            value:  `${res.body.Actors}`,
            inline: true
          },{
            name: 'Genre(s)',
            value:  `${res.body.Genre}`,
            inline: false
          },{
            name: 'Rating',
            value:  `${res.body.imdbRating} out of ${res.body.imdbVotes} votes`,
            inline: true
          },{
            name: 'Awards',
            value:  `${res.body.Awards}`,
            inline: true
          },{
            name: 'Country',
            value:  `${res.body.Country}`,
            inline: true
          }],
          color: 3447003,
          footer: {
            text: 'by Jorisvidéo',
            proxy_icon_url: ' '
          },
           author: {
            name: message.author.username,
            icon_url: message.author.avatarURL,
            proxy_icon_url: ' '
          }
        }
        })
      } else {
        con(`No IMDB entries found for ` + msgc.substr(6));
        message.channel.sendMessage("Nothing found in IMDB 😶🚫");
      }
    });
  } else {
    message.channel.sendMessage(`U WOT M8... you need to use !imdb name film`);
  }
}else if (msgc === (prefix +'dog')){
const randomPuppy = require("random-puppy");

      randomPuppy().then(url => {
        message.channel.sendMessage({
            embed: {
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                    url: "http://takohell.com:3000"
                },
                color: 0x00FF00,
                image: {
                    url: url
                }
            }
        });
    });
}

});

app.get('/', function (req, res) {
    var obj = new Object();
    obj.test = "Test moi";
    obj.rep = "test réussi !";
    var json = JSON.stringify(obj);
    res.send(json);
});

app.get('/playlist', function (req, res) {
    var json = JSON.stringify(music.tab);
    res.send(json);
});

app.listen(AuthDetails.port);
client.login(token)
