import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

// مصفوفة تحتوي على إعدادات أمر الـ broadcast لتسجيله
const commands = [
    new SlashCommandBuilder()
        .setName('broadcast')
        .setDescription('إرسال رسالة جماعية لجميع أعضاء السيرفر في الخاص دفعة واحدة')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // متاح فقط للأدمن لحماية السيرفر
        .addStringOption(option =>
            option.setName('رسالة')
                .setDescription('نص الرسالة المراد إرسالها للجميع')
                .setRequired(true)
        )
].map(command => command.toJSON());

// الكود يبحث تلقائياً عن توكن البوت في الاستضافة، أو يمكنك وضعه يدوياً بالأسفل
const TOKEN = process.env.DISCORD_TOKEN || process.env.TOKEN || "ضع_توكن_البوت_هنا";

if (TOKEN && TOKEN !== "ضع_توكن_البوت_هنا") {
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    (async () => {
        try {
            console.log('🔄 جاري إجبار ديسكورد على تسجيل أمر /broadcast عالمياً...');
            
            // جلب معرف البوت (Client ID) تلقائياً عبر التوكن المتصل
            const userData = await rest.get(Routes.user());
            const clientId = userData.id;

            // رفع وتسجيل الأمر مباشرة في خوادم ديسكورد العالمية
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log('✅ نجاح تام! تم تسجيل أمر /broadcast بنجاح وستجده في ديسكورد الآن!');
        } catch (error) {
            console.error('❌ خطأ أثناء التسجيل السريع:', error);
        }
    })();
} else {
    console.error('❌ لم يتم العثور على توكن البوت، يرجى وضعه في الكود أو في متغيرات الاستضافة.');
}

