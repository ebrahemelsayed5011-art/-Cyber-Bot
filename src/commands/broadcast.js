import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription('إرسال رسالة جماعية لجميع أعضاء السيرفر في الخاص دفعة واحدة')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('رسالة')
            .setDescription('نص الرسالة المراد إرسالها للجميع')
            .setRequired(true)
    );

export async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const messageText = interaction.options.getString('رسالة');

    try {
        const members = await interaction.guild.members.fetch();
        members.forEach(async (member) => {
            if (member.user.bot) return;
            try {
                await member.send(`📢 **رسالة جماعية من سيرفر ${interaction.guild.name}:**\n\n${messageText}`);
            } catch (e) {}
        });
        await interaction.editReply({ content: `✅ تم الإرسال الجماعي بنجاح لجميع الأعضاء!` });
    } catch (error) {
        await interaction.editReply({ content: '❌ حدث خطأ غير متوقع أثناء جلب الأعضاء.' });
    }
}
