import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription('إرسال رسالة جماعية لجميع أعضاء السيرفر في الخاص دفعة واحدة')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // متاح فقط للأدمن لحماية السيرفر
    .addStringOption(option =>
        option.setName('رسالة')
            .setDescription('نص الرسالة المراد إرسالها')
            .setRequired(true)
    );

export async function execute(interaction) {
    // التأكيد الأولي لعدم انتهاء وقت الاستجابة (Defer Reply)
    await interaction.deferReply({ ephemeral: true });

    const messageText = interaction.options.getString('رسالة');

    try {
        // جلب جميع أعضاء السيرفر لضمان القائمة كاملة
        const members = await interaction.guild.members.fetch();
        let successCount = 0;

        // إنشاء مصفوفة وعود للإرسال بالتوازي وبأقصى سرعة
        const sendPromises = members.map(async (member) => {
            if (member.user.bot) return; // تخطي البوتات الأخرى
            try {
                await member.send(`📢 **رسالة جماعية من سيرفر {${interaction.guild.name}}:**\n\n${messageText}`);
                successCount++;
            } catch (err) {
                // يتخطى العضو تلقائياً لو كان مغلق الخاص دون تعطيل الباقين
            }
        });

        // تشغيل كل عمليات الإرسال دفعة واحدة وبسرعة قصوى
        await Promise.all(sendPromises);
        
        await interaction.editReply({ content: `✅ تم الإرسال الجماعي بنجاح إلى جميع الأعضاء المتاحين!` });
    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: '❌ حدث خطأ غير متوقع أثناء جلب الأعضاء أو الإرسال.' });
    }
}
