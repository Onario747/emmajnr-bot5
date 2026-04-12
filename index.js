const { Client } = require("discord.js-selfbot-v13");
require("dotenv").config();
let clientOptions = {
  checkUpdate: false,
  messageCacheLifetime: 60,
  messageSweepInterval: 60,
  partials: [],
  ws: {
    properties: {
      $browser: "Discord iOS",
    },
  },
};
const client = new Client(clientOptions);

const NOTIFICATION_CHANNEL_ID = "1492973585676107826";

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);
  console.log(`🚀 Running in optimized mode (Background Worker)`);
});
client.on("guildMemberAdd", async (member) => {
  if (member.guild.ownerId === client.user.id && member.guild.memberCount > 1) {
    try {
      const channel = member.guild.systemChannel || member.guild.channels.cache.find(c => c.type === "GUILD_TEXT" && c.permissionsFor(member.guild.me).has("SEND_MESSAGES"));
      if (channel) {
        await channel.send("not more than 1 person should be on the group if you need a bot contact: 08169742833");
      }
    } catch (e) {
      console.error("Failed to send warning:", e.message);
    }
    console.log(`Unauthorized member joined group ${member.guild.name}. Shutting down.`);
    process.exit(1);
  }
  try {
    const notificationChannel = await client.channels.fetch(
      NOTIFICATION_CHANNEL_ID,
    );

    const joinedAt = member.joinedAt || new Date();
    const joinedTimestamp = `${joinedAt.getFullYear()}-${String(
      joinedAt.getMonth() + 1,
    ).padStart(2, "0")}-${String(joinedAt.getDate()).padStart(2, "0")} ${String(
      joinedAt.getHours(),
    ).padStart(2, "0")}:${String(joinedAt.getMinutes()).padStart(
      2,
      "0",
    )}:${String(joinedAt.getSeconds()).padStart(2, "0")}`;

    await notificationChannel.send(
      `@everyone\n` +
        `🏠 **Server :** ${member.guild.name}\n` +
        `Username: \`${member.user.tag}\`\n` +
        `🕒 **Joined :** ${joinedTimestamp}`,
    );
    console.log(
      `Notified about new member: ${member.user.tag} in ${member.guild.name}`,
    );
  } catch (error) {
    console.error(`Failed to send join notification:`, error.message);
  }
});
client.login(process.env.DISCORD_TOKEN);
