import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription('إرسال رسالة جماعية لجميع أعضاء السيرفر في الخاص دفعة واحدة')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // للأدمن فقط لحماية السيرفر
    .addStringOption(option =>
        option.setName('رسالة')
            .setDescription('نص الرسالة المراد إرسالها للجميع')
            .setRequired(true)
    );

export async function execute(interaction) {
    // رد أولي لمنع انتهاء وقت الاستجابة الخاص بديسكورد
    await interaction.deferReply({ ephemeral: true });

    const messageText = interaction.options.getString('رسالة');

    try {
        // جلب جميع أعضاء السيرفر لضمان القائمة كاملة
        const members = await interaction.guild.members.fetch();

        // إرسال الرسالة لكل عضو بالتوازي وبأقصى سرعة
        members.forEach(async (member) => {
            if (member.user.bot) return; // تخطي البوتات الأخرى
            try {
                await member.send(`📢 **رسالة جماعية من سيرفر ${interaction.guild.name}:**\n\n${messageText}`);
            } catch (err) {
                // يتخطى الشخص تلقائياً لو كان مغلق الخاص دون أن يعطل الباقين
            }
        });

        await interaction.editReply({ content: '✅ تم بدء الإرسال الجماعي بنجاح لجميع الأعضاء المتاحين!' });
    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: '❌ حدث خطأ غير متوقع أثناء جلب الأعضاء أو الإرسال.' });
    }
}
