/* إعدادات MNnote+ — عدّل هذا الملف فقط (لا حاجة لتعديل index.html)

   1) MN_FIREBASE : قيم مشروع Firebase (Project settings > Your apps > Web app).
      تفعّل تسجيل الدخول بحساب Google ومزامنة الأجهزة.
   2) tutorProxyUrl : رابط خادم المعلم الذكي (Cloudflare Worker) بعد نشره.
      يعمل المعلم لكل مستخدم مسجّل دخوله بدون أن يضع مفتاحاً.
   اتركهما فارغين لتعمل الأدوات الأخرى محلياً. */
window.MN_FIREBASE = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: ""
};
window.MN_CONFIG = {
  tutorProxyUrl: ""
};
