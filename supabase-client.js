

// 1. بيانات الاتصال بسوبابيس (استبدلها ببيانات مشروعك)
const SUPABASE_URL = 'https://bqhhiitywcfhxjemhyzs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxaGhpaXR5d2NmaHhqZW1oeXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTExNjksImV4cCI6MjA5MDgyNzE2OX0.FOAKTk_fUh_CX00rkLan_4H6xPHxHhPrsqzm3aeACKQ';

// 2. إنشاء عميل الاتصال
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. دالة ذكية للتحكم في الهيدر في جميع الصفحات تلقائياً
async function updateGlobalHeader() {
    // جلب الجلسة الحالية من سوبابيس
    const { data: { session } } = await supabase.auth.getSession();
    
    const loggedOutState = document.getElementById('loggedOutState');
    const loggedInState = document.getElementById('loggedInState');
    const navUserName = document.getElementById('navUserName');
    const teaserSection = document.getElementById('teaserSection');

    if (session) {
        // --- حالة تسجيل الدخول ---
        if (loggedOutState) loggedOutState.style.display = 'none';
        if (loggedInState) loggedInState.style.display = 'block';
        if (teaserSection) teaserSection.style.display = 'none';

        // جلب اسم الطالب من جدول profiles الذي أنشأته
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .single();

        if (profile && !error && navUserName) {
            // استخراج الاسم الأول فقط للمناداته به
            const firstName = profile.full_name.split(' ')[0];
            navUserName.textContent = `أهلاً، ${firstName}`;
            // حفظ الاسم في الذاكرة المحلية لتسريع التحميل في الصفحات الأخرى
            localStorage.setItem('mrCircleLawUser', firstName);
        }
    } else {
        // --- حالة عدم تسجيل الدخول ---
        if (loggedOutState) loggedOutState.style.display = 'flex';
        if (loggedInState) loggedInState.style.display = 'none';
        if (teaserSection) teaserSection.style.display = 'block';
        localStorage.removeItem('mrCircleLawUser');
    }
}

// 4. تنفيذ الدالة عند تحميل أي صفحة
document.addEventListener('DOMContentLoaded', () => {
    updateGlobalHeader();

    // 5. تفعيل زر تسجيل الخروج أينما وجد
    const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtnSide');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut(); // تسجيل الخروج من السيرفر
            localStorage.removeItem('mrCircleLawUser');
            window.location.href = 'index.html'; // العودة للرئيسية
        });
    });
});