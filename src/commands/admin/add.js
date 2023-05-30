const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add_homework")
        .setDescription("Add new homework to list")
        .addStringOption(option =>
            option.setName("subject")
                .setDescription("subject of new assignment")
                .setRequired(true)
                .addChoices(
                    { name: "math", value: "math" },
                    { name: "pysics", value: "pysics" },
                    { name: "thai", value: "thai"},
                ))
        .addStringOption(option =>
            option.setName("name")
                .setDescription("name of assignment")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("description")
                .setDescription("description of assignment (how to do)")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("page")
                .setDescription("page of assignments")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("assigned")
                .setDescription("assigned date of assignment (dd/mm/yyyy)")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("due")
                .setDescription("due date of assignment (dd/mm/yyyy)")
                .setRequired(true))

        ,async execute(interaction) {
            const subject_input = interaction.options.getString("subject")
            const name_input = interaction.options.getString("name")
            const description_input = interaction.options.getString("description")
            const page_input = interaction.options.getString("page")


            const confirm_embed = new EmbedBuilder()
                .setColor("Grey")
                .setTitle(`${subject_input} : ${name_input}`)
                .setDescription(`${description_input}`)
                .addFields(
                    {name: "Page", value:`${page_input}`},
                    {name: "Assigned", value: "<assigned date (00-00-0000)>", inline: true},
                    {name: "Due", value: "<due date (00-00-0000)>", inline: true}
                )
                .setTimestamp();

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