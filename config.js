/* إعدادات MNnote+ — عدّل هذا الملف فقط (لا حاجة لتعديل index.html)
   1) googleClientId : معرّف عميل OAuth من Google Cloud (نوع Web application)
   2) tutorProxyUrl  : رابط خادم المعلم الذكي (Cloudflare Worker) بعد نشره
   اتركهما فارغين لتعمل الأدوات الأخرى بدون تسجيل دخول Google. */
window.MN_CONFIG = {
  googleClientId: "",
  tutorProxyUrl: ""
};

/* إعدادات Firebase لتسجيل الدخول بجوجل ومزامنة البيانات */
window.MN_FIREBASE = {
  apiKey: "AIzaSyDVH7rhRO222-3-on_uzNezhpV8alGgamU",
  authDomain: "mnnote-6be08.firebaseapp.com",
  projectId: "mnnote-6be08",
  appId: "1:611952208092:web:1fed896f6c9bf1d117ac19"
};
