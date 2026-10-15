/* إعدادات MNnote+ — عدّل هذا الملف فقط (لا حاجة لتعديل index.html)
   tutorProxyUrl : رابط خادم المعلم الذكي (Cloudflare Worker) بعد نشره
   المعلم يعمل عبر الووركر بمفتاحك؛ وإن تركته فارغاً يعمل بمفتاح كل مستخدم.
   googleClientId لم يعد مطلوباً (تسجيل الدخول عبر Firebase). */
window.MN_CONFIG = {
  googleClientId: "",
  tutorProxyUrl: "https://mnnote-tutor.tecnexus555.workers.dev"
};

/* إعدادات Firebase لتسجيل الدخول بجوجل ومزامنة البيانات */
window.MN_FIREBASE = {
  apiKey: "AIzaSyCSZqCpy_4TpVvm11ocaRtGWZ_xYjqQTtE",
  authDomain: "mnnote-57100.firebaseapp.com",
  projectId: "mnnote-57100",
  appId: "1:980721907464:web:dd0037605d8e80a318debd"
};
