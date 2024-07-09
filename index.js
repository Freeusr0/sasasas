const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello Express app!')
});
app.listen(4000, () => {
});

const Discord = require('discord.js');
const db = require("pro.db")
const ms = require("ms");
const discord = require("discord.js");
const moment = require('moment')
const fs = require('fs');
const Data = require(`pro.db`)
const cleanup = require('node-cleanup');

const { Client, Intents, MessageActionRow, MessageButton, Collection, MessageEmbed, MessageSelectMenu, EmbedBuilder, WebhookClient, ButtonBuilder, ActionRowBuilder, MessageAttachment, Modal, TextInputComponent, interaction, guild, options, Message, Permissions, Util, invcount, MessageFlags, MessageMenuOption, GatewayIntentBits } = require("discord.js");
const client = new Discord.Client({
  intents: 32767
})

const prefix = '!'



client.on('guildMemberAdd', (member) => {
    const roles = db.get(`user_roles_${member.guild.id}_${member.user.id}`);

    if (roles && roles.length > 0) {
        roles.forEach((roleID) => {
            const role = member.guild.roles.cache.get(roleID);
            if (role) {
                member.roles.add(role);
            }
        });
    }

    const savedNickname = db.get(`user_nickname_${member.guild.id}_${member.user.id}`);

    if (savedNickname) {
        member.setNickname(savedNickname);
    }
});

client.on('guildMemberRemove', (member) => {
    const currentRoles = member.roles.cache
        .filter(role => role.id !== member.guild.id)
        .map(role => role.id);

    db.set(`user_roles_${member.guild.id}_${member.user.id}`, currentRoles);

    const currentNickname = member.nickname;
    if (currentNickname) {
        db.set(`user_nickname_${member.guild.id}_${member.user.id}`, currentNickname);
    }
});


client.login(process.env.token); 