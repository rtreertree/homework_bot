const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add_homework")
        .setDescription("Add new homework to list"),
        async execute(interaction) {

            const confirm_embed = new EmbedBuilder()
                .setColor("Grey")
                .setTitle("<homework_name>")
                .setDescription("<page>")
                .addFields(
                    {name: "Assigned", value: "<assigned date (00-00-0000)>", inline: true},
                    {name: "Due", value: "<due date (00-00-0000)>", inline: true}
                )
                .setTimestamp()
                .setFooter({text: "confirm data"});

            const comfirm_button = new ButtonBuilder()
                .setCustomId("confirm_button")
                .setLabel("Confirm")
                .setStyle(ButtonStyle.Success);

            const cancel_button = new ButtonBuilder()
                .setCustomId("cancel_button")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Secondary);
            
            const row = new ActionRowBuilder().addComponents(cancel_button, comfirm_button);

            const response = await interaction.reply({
                content: `${interaction.user}, Comfirm your assignment`,
                embeds: [confirm_embed],
                components: [row],
                ephemeral: true
            });

            const collectorFilter = i => i.user.id === interaction.user.id;
            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                if (confirmation.customId === "confirm_button") {
                    await confirm_embed.setColor("Green");
                    await confirmation.update({ content: "Confirmed", components: [], embeds: []});
                    await interaction.channel.send({
                        content: `${interaction.user}, Comfirmed the assignment`,
                        embeds: [confirm_embed]
                    });
                } else if (confirmation.customId === "cancel_button") {
                    await confirm_embed.setColor("Red");
                    await confirmation.update({ content: 'Action cancelled', components: [], embeds: [confirm_embed]});
                }
            } catch (e) {
                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            }
        }
};