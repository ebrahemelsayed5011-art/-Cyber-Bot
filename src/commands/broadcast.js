import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription('إرسال رسالة جماعية لجميع أعضاء السيرفر في الخاص دفعة واحدة')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // متاح فقط للإدارة لحماية السيرفر
    .addStringOption(option =>
        option.setName('رسالة')
            .setDescription('نص الرسالة المراد إرسالها للجميع')
            .setRequired(true)
    );

export async function execute(interaction) {
    // تأكيد الرد الأولي لمنع انتهاء وقت الاستجابة (Defer Reply)
    await interaction.deferReply({ ephemeral: true });

    const messageText = interaction.options.getString('رسالة');

    try {
        // جلب جميع أعضاء السيرفر لضمان القائمة كاملة
        const members = await interaction.guild.members.fetch();

        // إرسال الرسائل لجميع الأعضاء دفعة واحدة
        members.forEach(async (member) => {
            if (member.user.bot) return; // تخطي البوتات الأخرى
            try {
                await member.send(`📢 **رسالة جماعية من سيرفر ${interaction.guild.name}:**\n\n${messageText}`);
            } catch (err) {
                // تخطي الحسابات المغلقة الخاص تلقائياً دون تعطيل البوت
            }
        });

        await interaction.editReply({ content: '✅ تم بدء الإرسال الجماعي بنجاح لجميع الأعضاء المتاحين!' });
    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: '❌ حدث خطأ غير متوقع أثناء جلب الأعضاء أو الإرسال.' });
    }
}
