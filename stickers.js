/*!
 * MNnote+ — إضافة الملصقات الطبية (ملف إضافي مستقل)
 * التشغيل: أضف السطر التالي قبل </body> في index.html ثم ارفع هذا الملف بجانبه:
 *     <script src="stickers.js" defer></script>
 *
 * - ملصقات مرسومة بالكود (SVG) بلا صور خارجية، تعمل بدون إنترنت.
 * - تُدرج في الملاحظة النصية (صورة صغيرة قابلة للتكبير بالنقر) وفي الصفحة اليدوية.
 * - يمكنك إضافة حزمة خاصة بك:
 *     MN_STICKERS.register({id:"mine", name:"حزمتي", items:[{id:"a", n:"اسم", svg:"<svg ...>…</svg>"}]});
 */
(function () {
  "use strict";
  if (window.MN_STICKERS) return;

  /* ---------- أدوات الرسم ---------- */
  const INK = "#4a2f7a";
  const col = { pink: "#ffb3c7", red: "#ff6b81", rose: "#ff4d6d", blue: "#8ecbff", green: "#8fe3b1", yellow: "#ffe08a", purple: "#c9b3ff", orange: "#ffb56b", teal: "#7fe0d4", gray: "#dfe3ee", white: "#ffffff" };
  // دمج السمات: ما يُمرَّر في ex يستبدل القيمة الافتراضية (لا تتكرر السمات داخل XML)
  const A = (def, ex) => { const m = Object.assign({}, def); String(ex || "").replace(/([\w:-]+)="([^"]*)"/g, (_, k, v) => { m[k] = v; return ""; }); return Object.keys(m).map(k => `${k}="${m[k]}"`).join(" "); };
  const SK = { stroke: INK, "stroke-width": "3" };
  const P = (d, fill, ex = "") => `<path d="${d}" ${A({ fill, stroke: INK, "stroke-width": "3", "stroke-linejoin": "round", "stroke-linecap": "round" }, ex)}/>`;
  const C = (x, y, r, fill, ex = "") => `<circle cx="${x}" cy="${y}" r="${r}" ${A(Object.assign({ fill }, SK), ex)}/>`;
  const E = (x, y, rx, ry, fill, ex = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${A(Object.assign({ fill }, SK), ex)}/>`;
  const R = (x, y, w, h, r, fill, ex = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${A(Object.assign({ fill }, SK), ex)}/>`;
  const L = (d, c = INK, w = 3, ex = "") => `<path d="${d}" ${A({ fill: "none", stroke: c, "stroke-width": String(w), "stroke-linecap": "round", "stroke-linejoin": "round" }, ex)}/>`;
  const T = (x, y, txt, size, fill, ex = "") => `<text x="${x}" y="${y}" ${A({ "text-anchor": "middle", "font-family": "Tahoma,Arial,'Noto Sans Arabic',sans-serif", "font-weight": "700", "font-size": String(size), fill }, ex)}>${txt}</text>`;
  const U = (shapes, fill) => `<g>${shapes.map(s => `<${s} fill="${INK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`).join("")}${shapes.map(s => `<${s} fill="${fill}"/>`).join("")}</g>`;
  const star = (cx, cy, ro, ri, n, rot = -90) => { let d = ""; for (let i = 0; i < n * 2; i++) { const a = (rot + i * 180 / n) * Math.PI / 180, r = i % 2 ? ri : ro; d += (i ? "L" : "M") + (cx + r * Math.cos(a)).toFixed(1) + " " + (cy + r * Math.sin(a)).toFixed(1); } return d + "Z"; };
  const wrap = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><filter id="o" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="3.2" result="d"/><feFlood flood-color="#ffffff"/><feComposite in2="d" operator="in" result="w"/><feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#2a1a55" flood-opacity=".28" in="w" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#o)">${inner}</g></svg>`;
  const label = (txt, fill, tc = INK, size = 20) => wrap(R(10, 38, 100, 44, 22, fill) + T(60, 67, txt, size, tc, 'stroke="none"'));

  /* ---------- الحزم ---------- */
  const PACKS = [
    { id: "organs", name: "الأعضاء", items: [
      { id: "heart", n: "قلب", svg: wrap(P("M52 34C50 20 62 10 74 14C90 18 94 30 84 36L72 40Z", col.blue) + P("M60 104C20 76 12 46 30 30C44 18 57 27 60 38C63 27 76 18 90 30C108 46 100 76 60 104Z", "#ff7b93") + L("M34 44C32 54 36 60 42 64", "#fff", 3.5) + L("M44 24C40 14 48 8 56 10", INK, 3)) },
      { id: "lungs", n: "رئتان", svg: wrap(P("M52 40C34 40 20 60 22 90C23 99 32 99 41 95C51 90 54 80 54 66Z", col.pink) + P("M68 40C86 40 100 60 98 90C97 99 88 99 79 95C69 90 66 80 66 66Z", col.pink) + R(54, 10, 12, 36, 5, col.gray) + L("M60 46L52 60M60 46L68 60", INK, 3)) },
      { id: "brain", n: "دماغ", svg: wrap(P("M30 62C12 54 16 32 36 31C40 17 62 13 70 24C84 15 103 27 99 44C112 52 107 73 90 75C86 89 66 91 58 83C46 93 25 85 30 62Z", "#ffb3d9") + L("M44 40C54 46 53 54 46 58M64 30C62 40 70 46 79 44M54 66C62 62 70 66 75 74M87 57C80 59 78 52 83 48M38 62C44 64 46 70 44 76", INK, 2.6)) },
      { id: "liver", n: "كبد", svg: wrap(P("M14 54C14 36 40 30 70 34C98 38 110 52 105 67C100 82 72 90 52 84C30 79 14 68 14 54Z", "#d9967a") + P("M72 80C78 88 90 88 90 78C90 70 78 70 72 80Z", col.green) + L("M50 36C53 52 61 66 74 74", INK, 2.6)) },
      { id: "kidneys", n: "كليتان", svg: wrap(P("M44 22C24 24 14 50 20 74C25 92 42 96 46 82C48 74 40 70 42 62C44 54 54 50 52 38C50 28 48 22 44 22Z", "#ff9a8b") + `<g transform="translate(120 0) scale(-1 1)">${P("M44 22C24 24 14 50 20 74C25 92 42 96 46 82C48 74 40 70 42 62C44 54 54 50 52 38C50 28 48 22 44 22Z", "#ff9a8b")}</g>` + L("M52 56C56 70 58 88 60 104", INK, 3)) },
      { id: "stomach", n: "معدة", svg: wrap(P("M44 12C44 30 40 40 34 46C18 62 24 94 56 95C86 96 102 80 93 62C87 50 70 54 66 44C62 34 66 20 62 12Z", "#ffbf80") + L("M46 72C56 78 70 76 82 68M42 56C50 62 62 62 70 58", INK, 2.6)) },
      { id: "intestine", n: "أمعاء", svg: wrap(`<path d="M26 28H88C106 28 106 54 88 54H32C14 54 14 82 32 82H88C106 82 106 100 90 100H30" fill="none" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M26 28H88C106 28 106 54 88 54H32C14 54 14 82 32 82H88C106 82 106 100 90 100H30" fill="none" stroke="${col.pink}" stroke-width="17" stroke-linecap="round"/>`) },
      { id: "eye", n: "عين", svg: wrap(P("M8 60C30 26 90 26 112 60C90 94 30 94 8 60Z", "#fff") + C(60, 60, 21, "#7fb4ff") + C(60, 60, 9, "#2b2350", 'stroke="none"') + C(53, 53, 4, "#fff", 'stroke="none"') + L("M26 38L20 28M60 28V16M94 38L100 28")) },
      { id: "tooth", n: "سن", svg: wrap(P("M34 20C46 12 54 22 60 22C66 22 74 12 86 20C100 30 94 54 88 72C84 88 80 106 72 106C64 106 66 82 60 82C54 82 56 106 48 106C40 106 36 88 32 72C26 54 20 30 34 20Z", "#fff") + L("M40 32C36 38 36 46 38 52", "#9cc9ff", 3.5)) },
      { id: "bone", n: "عظمة", svg: wrap(`<g transform="rotate(-38 60 60)">${U(['circle cx="24" cy="50" r="11"', 'circle cx="24" cy="70" r="11"', 'circle cx="96" cy="50" r="11"', 'circle cx="96" cy="70" r="11"', 'rect x="24" y="48" width="72" height="24" rx="6"'], "#fffaf0")}</g>`) },
      { id: "spine", n: "عمود فقري", svg: wrap(R(42, 8, 36, 16, 7, "#fffaf0") + R(40, 28, 40, 16, 7, "#fffaf0") + R(38, 48, 44, 16, 7, "#fffaf0") + R(40, 68, 40, 16, 7, "#fffaf0") + R(44, 88, 32, 16, 7, "#fffaf0") + L("M30 20H42M78 20H90M28 40H40M80 40H92M26 60H38M82 60H94M28 80H40M80 80H92", INK, 3)) }
    ] },
    { id: "tools", name: "الأدوات", items: [
      { id: "steth", n: "سماعة طبية", svg: wrap(L("M30 12C30 50 50 58 60 58C70 58 90 50 90 12", INK, 5) + C(30, 12, 6, col.purple) + C(90, 12, 6, col.purple) + L("M60 58V80", INK, 5) + C(60, 94, 16, col.purple) + C(60, 94, 8, "#fff")) },
      { id: "syringe", n: "حقنة", svg: wrap(`<g transform="rotate(-35 60 60)">${R(34, 49, 52, 22, 5, "#fff")}${R(38, 53, 26, 14, 3, "#ff9fb2", 'stroke="none"')}${L("M70 49V56M76 49V56M82 49V56", INK, 2.5)}${R(84, 44, 6, 32, 2, col.purple)}${L("M34 60H18", INK, 4)}${R(8, 50, 7, 20, 3, col.blue)}${L("M90 60H110", INK, 3)}</g>`) },
      { id: "capsule", n: "كبسولة", svg: wrap(`<g transform="rotate(-35 60 60)">${P("M60 40H42A20 20 0 0 0 42 80H60Z", col.rose)}${P("M60 40H78A20 20 0 0 1 78 80H60Z", "#fff")}${L("M34 50C36 46 40 44 44 44", "#fff", 3)}</g>`) },
      { id: "tablet", n: "حبة دواء", svg: wrap(C(60, 60, 36, "#fff") + L("M26 60H94", INK, 3) + L("M38 40C44 32 52 30 60 30", "#9cc9ff", 3.5)) },
      { id: "thermo", n: "ميزان حرارة", svg: wrap(R(51, 10, 18, 72, 9, "#fff") + R(56, 36, 8, 56, 4, col.rose, 'stroke="none"') + C(60, 94, 15, col.rose) + L("M76 24h10M76 38h10M76 52h10M76 66h10", INK, 3)) },
      { id: "bandage", n: "لصقة جروح", svg: wrap(`<g transform="rotate(-32 60 60)">${R(12, 44, 96, 32, 16, "#ffd9a8")}${R(42, 44, 36, 32, 0, "#fff4e0")}${C(52, 54, 1.8, INK, 'stroke="none"')}${C(68, 54, 1.8, INK, 'stroke="none"')}${C(52, 66, 1.8, INK, 'stroke="none"')}${C(68, 66, 1.8, INK, 'stroke="none"')}</g>`) },
      { id: "microscope", n: "مجهر", svg: wrap(R(24, 98, 72, 9, 4, col.purple) + L("M42 98C24 76 32 44 62 40", INK, 8) + L("M42 98C24 76 32 44 62 40", col.blue, 4.5) + `<g transform="rotate(-24 60 36)">${R(52, 8, 17, 44, 4, col.blue)}${R(54, 2, 13, 9, 3, col.gray)}${R(56, 52, 9, 10, 2, col.gray)}</g>` + R(62, 76, 34, 7, 2, col.gray)) },
      { id: "tube", n: "أنبوب مخبري", svg: wrap(`<g transform="rotate(28 60 60)">${P("M46 18H74V84A14 14 0 0 1 46 84Z", "#fff")}${P("M46 58H74V84A14 14 0 0 1 46 84Z", col.teal)}${R(42, 12, 36, 9, 4, col.gray)}${C(56, 74, 3, "#fff", 'stroke="none"')}${C(66, 66, 2.4, "#fff", 'stroke="none"')}</g>`) },
      { id: "drop", n: "قطرة دم", svg: wrap(P("M60 10C72 34 94 54 94 76C94 96 80 108 60 108C40 108 26 96 26 76C26 54 48 34 60 10Z", "#ff4d6d") + L("M42 74C42 84 48 90 56 92", "#fff", 4)) },
      { id: "bloodbag", n: "كيس دم", svg: wrap(L("M60 20V10", INK, 3) + C(60, 10, 5, "#fff") + R(30, 20, 60, 74, 15, col.red) + R(40, 46, 40, 26, 5, "#fff") + T(60, 66, "O+", 18, INK, 'stroke="none"') + L("M60 94V110", INK, 4)) },
      { id: "xray", n: "أشعة", svg: wrap(R(16, 20, 88, 80, 6, "#2b2350") + R(56, 30, 8, 62, 3, col.gray, 'stroke="none"') + L("M56 40C40 36 30 44 28 58M64 40C80 36 90 44 92 58M56 58C42 56 34 64 34 76M64 58C78 56 86 64 86 76", col.gray, 3)) },
      { id: "ecg", n: "جهاز تخطيط", svg: wrap(R(12, 22, 96, 64, 8, col.gray) + R(20, 30, 80, 48, 4, "#1f2d4d") + L("M24 56H44L50 40L58 72L64 50L70 56H96", "#4cf0a0", 3.5) + R(48, 86, 24, 8, 2, col.purple) + R(36, 94, 48, 8, 4, col.purple)) },
      { id: "ambulance", n: "إسعاف", svg: wrap(R(8, 38, 72, 46, 7, "#fff") + P("M80 52H98L112 68V84H80Z", "#fff") + P("M86 58H96L104 68H86Z", col.blue) + R(32, 46, 8, 24, 2, col.rose, 'stroke="none"') + R(24, 54, 24, 8, 2, col.rose, 'stroke="none"') + R(38, 30, 20, 8, 3, col.red) + C(30, 88, 10, INK) + C(30, 88, 4, "#fff", 'stroke="none"') + C(94, 88, 10, INK) + C(94, 88, 4, "#fff", 'stroke="none"')) },
      { id: "cross", n: "صليب أحمر", svg: wrap(C(60, 60, 46, "#fff") + P("M50 24H70V50H96V70H70V96H50V70H24V50H50Z", col.rose)) },
      { id: "kit", n: "حقيبة إسعاف", svg: wrap(P("M42 44V30A7 7 0 0 1 49 23H71A7 7 0 0 1 78 30V44", "none", 'stroke-width="5"') + R(12, 40, 96, 62, 11, col.red) + P("M54 54H66V66H78V78H66V90H54V78H42V66H54Z", "#fff")) },
      { id: "clip", n: "سجل المريض", svg: wrap(R(26, 16, 68, 92, 8, "#fff") + R(44, 8, 32, 17, 5, col.purple) + L("M38 48H82M38 62H82M38 76H64", INK, 3) + L("M38 92L45 99L58 85", "#2fbf71", 4)) }
    ] },
    { id: "micro", name: "المجهريات", items: [
      { id: "dna", n: "DNA", svg: wrap(L("M40 10C98 28 98 50 40 66C2 80 2 98 40 112", col.blue, 7) + L("M80 10C22 28 22 50 80 66C118 80 118 98 80 112", col.pink, 7) + L("M46 20L74 24M42 36L78 40M46 52L74 56M44 78L76 80M44 94L76 98", INK, 3.5)) },
      { id: "bacteria", n: "بكتيريا", svg: wrap(R(22, 42, 72, 36, 18, col.green) + L("M94 60C104 52 108 70 118 60", INK, 3) + L("M30 42V34M46 40V30M62 40V30M78 42V34M30 78V86M46 80V90M62 80V90M78 78V86", INK, 3) + C(44, 56, 3, "#fff", 'stroke="none"') + C(66, 64, 4, "#fff", 'stroke="none"') + C(54, 66, 2.4, "#fff", 'stroke="none"')) },
      { id: "virus", n: "فيروس", svg: (() => { let sp = ""; for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180, x1 = 60 + 28 * Math.cos(a), y1 = 60 + 28 * Math.sin(a), x2 = 60 + 42 * Math.cos(a), y2 = 60 + 42 * Math.sin(a); sp += L(`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`, INK, 3.5) + C(x2.toFixed(1), y2.toFixed(1), 5, col.rose); } return wrap(sp + C(60, 60, 28, col.pink) + C(50, 52, 4, "#fff", 'stroke="none"') + C(68, 66, 5, "#fff", 'stroke="none"') + C(56, 70, 3, "#fff", 'stroke="none"')); })() },
      { id: "cell", n: "خلية", svg: wrap(C(60, 60, 46, "#d9f3ff") + C(54, 56, 18, col.purple) + C(54, 56, 7, "#7a5ad6") + E(86, 76, 9, 5, col.yellow, 'transform="rotate(30 86 76)"') + E(32, 82, 8, 5, col.green, 'transform="rotate(-20 32 82)"') + C(84, 38, 4, col.pink)) },
      { id: "neuron", n: "خلية عصبية", svg: wrap(L("M30 52L12 38M30 68L14 84M40 46L32 24M44 72L40 96", INK, 4) + L("M54 60H98", INK, 5) + L("M98 60L110 48M98 60L110 72M98 60L112 60", INK, 4) + C(42, 60, 14, col.purple) + C(42, 60, 5, "#7a5ad6") + C(110, 48, 3.5, col.rose) + C(110, 72, 3.5, col.rose)) }
    ] },
    { id: "study", name: "للدراسة", items: [
      { id: "tag_def", n: "تعريف", svg: label("تعريف", "#ffe08a") },
      { id: "tag_imp", n: "مهم جداً", svg: label("مهم جداً", "#ffb3d9", INK, 19) },
      { id: "tag_tx", n: "علاج", svg: label("علاج", "#a8f0c4") },
      { id: "tag_dx", n: "تشخيص", svg: label("تشخيص", "#a5d4ff") },
      { id: "tag_sx", n: "أعراض", svg: label("أعراض", "#ffcf9e") },
      { id: "tag_why", n: "أسباب", svg: label("أسباب", "#dccbff") },
      { id: "tag_mem", n: "للحفظ", svg: label("للحفظ", "#ffb3c7") },
      { id: "tag_case", n: "حالة سريرية", svg: label("حالة سريرية", "#b6f0e6", INK, 16) },
      { id: "burst", n: "مهم!", svg: wrap(P(star(60, 60, 50, 36, 12), "#ffd84d") + T(60, 69, "مهم!", 26, "#d9264d", 'stroke="none"')) },
      { id: "exam", n: "للامتحان", svg: wrap(P("M6 36H114L102 58L114 80H6L18 58Z", col.rose) + T(60, 66, "للامتحان", 22, "#fff", 'stroke="none"')) },
      { id: "bell", n: "تذكير", svg: wrap(P("M60 14C40 14 32 32 32 52C32 70 22 76 22 84H98C98 76 88 70 88 52C88 32 80 14 60 14Z", col.yellow) + C(60, 94, 9, col.orange) + L("M60 6V14", INK, 4)) },
      { id: "review", n: "راجع", svg: wrap(L("M92 44A34 34 0 0 0 32 40", INK, 10) + L("M92 44A34 34 0 0 0 32 40", col.blue, 5.5) + P("M24 24L30 52L52 38Z", col.blue) + L("M28 76A34 34 0 0 0 88 80", INK, 10) + L("M28 76A34 34 0 0 0 88 80", col.green, 5.5) + P("M96 96L90 68L68 82Z", col.green)) },
      { id: "check", n: "ممتاز", svg: wrap(C(60, 60, 46, "#4cd18a") + L("M36 62L53 79L86 44", "#fff", 9)) },
      { id: "question", n: "سؤال", svg: wrap(P("M16 20H104A8 8 0 0 1 112 28V76A8 8 0 0 1 104 84H54L32 104V84H16A8 8 0 0 1 8 76V28A8 8 0 0 1 16 20Z", col.blue) + T(60, 70, "؟", 46, "#fff", 'stroke="none"')) },
      { id: "idea", n: "فكرة", svg: wrap(P("M60 12C40 12 28 28 32 46C34 56 44 60 46 72H74C76 60 86 56 88 46C92 28 80 12 60 12Z", col.yellow) + R(46, 76, 28, 8, 3, col.gray) + R(50, 86, 20, 8, 3, col.gray) + L("M52 60L60 46L68 60", INK, 3)) },
      { id: "bookmark", n: "علامة", svg: wrap(P("M30 10H90V108L60 86L30 108Z", col.rose)) },
      { id: "star", n: "نجمة", svg: wrap(P(star(60, 62, 48, 22, 5), "#ffd84d")) }
    ] },
    { id: "vital", name: "علامات حيوية", items: [
      { id: "pulse", n: "نبض", svg: wrap(P("M60 104C20 76 12 46 30 30C44 18 57 27 60 38C63 27 76 18 90 30C108 46 100 76 60 104Z", "#ffd0da") + L("M10 62H38L48 40L62 82L72 58H110", "#e11d48", 5)) },
      { id: "ecgline", n: "تخطيط قلب", svg: wrap(R(8, 34, 104, 52, 10, "#fff") + L("M14 62H36L44 44L54 80L62 54L68 62H106", "#e11d48", 4)) },
      { id: "lungs2", n: "تنفس", svg: wrap(C(60, 60, 44, "#e3f6ff") + L("M24 66C34 52 44 52 54 66C64 80 76 80 96 56", "#3b9ae1", 6)) },
      { id: "bp", n: "ضغط الدم", svg: wrap(R(14, 64, 56, 36, 10, col.purple) + C(82, 56, 24, "#fff") + L("M82 56L94 44", INK, 4) + L("M68 78C70 90 54 90 48 78", INK, 4) + T(42, 90, "120", 16, "#fff", 'stroke="none"')) },
      { id: "o2", n: "أكسجين", svg: wrap(C(60, 60, 44, "#d6f1ff") + T(60, 74, "O₂", 38, "#2b78c2", 'stroke="none"')) }
    ] },
    { id: "deco", name: "زينة", items: [
      { id: "daisy", n: "زهرة", svg: (() => { let p = ""; for (let i = 0; i < 8; i++) p += E(60, 30, 11, 22, "#fff", `transform="rotate(${i * 45} 60 60)"`); return wrap(p + C(60, 60, 13, "#ffd84d")); })() },
      { id: "sakura", n: "زهرة كرز", svg: (() => { let p = ""; for (let i = 0; i < 5; i++) p += P("M60 60C48 48 46 28 56 20C58 24 62 24 64 20C74 28 72 48 60 60Z", "#ffc2dd", `transform="rotate(${i * 72} 60 60)"`); return wrap(p + C(60, 60, 7, "#ffd84d")); })() },
      { id: "tulip", n: "توليب", svg: wrap(L("M60 52V108", "#2fbf71", 6) + P("M60 100C44 94 36 82 38 72C48 76 56 84 60 100Z", "#7ed9a0") + P("M60 16C42 24 38 52 60 66C82 52 78 24 60 16Z", "#ff7b93") + L("M60 16C54 30 54 46 60 66", INK, 2.6)) },
      { id: "leaf", n: "ورقة", svg: wrap(P("M24 96C16 50 56 18 100 20C104 64 74 100 24 96Z", "#8fe3b1") + L("M24 96C48 70 70 50 92 30", INK, 3)) },
      { id: "sparkle", n: "لمعة", svg: wrap(P("M60 8L70 48L110 60L70 72L60 112L50 72L10 60L50 48Z", "#ffe08a")) },
      { id: "heart", n: "قلب صغير", svg: wrap(P("M60 100C22 74 16 46 34 32C46 22 57 29 60 40C63 29 74 22 86 32C104 46 98 74 60 100Z", "#ff8fb1")) }
    ] }
  ];
  PACKS.forEach(p => p.items.forEach(i => { i.pack = p.id; }));

  /* ---------- مساعدات ---------- */
  const $ = s => document.querySelector(s);
  const uri = svg => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const RECENT_KEY = "mnnote_stk_recent";
  const getRecent = () => { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch (e) { return []; } };
  const pushRecent = id => { try { const r = [id].concat(getRecent().filter(x => x !== id)).slice(0, 18); localStorage.setItem(RECENT_KEY, JSON.stringify(r)); } catch (e) {} };
  const findItem = id => { for (const p of PACKS) { const it = p.items.find(i => i.id === id); if (it) return it; } return null; };
  const allItems = () => PACKS.reduce((a, p) => a.concat(p.items), []);
  const SIZES = { s: { txt: 54, ink: 150, l: "صغير" }, m: { txt: 84, ink: 230, l: "وسط" }, l: { txt: 130, ink: 340, l: "كبير" } };
  const toast = m => { try { const t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.querySelectorAll(".toast").forEach(x => x.remove()); document.body.appendChild(t); setTimeout(() => t.remove(), 2800); } catch (e) {} };
  let size = "m", tab = "recent", query = "";

  /* ---------- الواجهة ---------- */
  const css = `
  .stk-btn{flex:none;background:none;border:0;border-radius:10px;padding:6px 9px;min-width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;color:var(--ink,#222);cursor:pointer}
  .stk-btn:hover{background:var(--glass2,rgba(255,255,255,.12))}
  .stk-panel{position:fixed;z-index:66;left:0;right:0;bottom:0;max-width:760px;margin:0 auto;max-height:62vh;display:flex;flex-direction:column;gap:8px;padding:12px 14px calc(14px + env(safe-area-inset-bottom,0px));border-radius:24px 24px 0 0;background:linear-gradient(150deg,var(--glass2,rgba(40,30,80,.92)),var(--glass,rgba(40,30,80,.88))),var(--bg,#14102e);border:1px solid var(--edge2,rgba(255,255,255,.12));box-shadow:0 -18px 50px -18px rgba(0,0,0,.6);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px);color:var(--ink,#fff);direction:rtl}
  .stk-panel.hide{display:none}
  .stk-top{display:flex;align-items:center;gap:8px}
  .stk-top b{flex:1;font-size:15px}
  .stk-x{width:34px;height:34px;border-radius:11px;border:0;background:var(--glass,rgba(255,255,255,.1));color:inherit;font-size:18px;cursor:pointer}
  .stk-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;flex:none}
  .stk-tabs::-webkit-scrollbar{display:none}
  .stk-tabs button,.stk-sz button,.stk-rand{flex:none;border:1px solid var(--edge2,rgba(255,255,255,.14));background:var(--glass,rgba(255,255,255,.08));color:inherit;border-radius:12px;padding:5px 12px;font:inherit;font-size:13px;font-weight:600;cursor:pointer}
  .stk-tabs button.on,.stk-sz button.on{background:linear-gradient(135deg,var(--c1,#8b6cff),var(--c2,#22d3ee));color:#fff;border-color:transparent}
  .stk-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .stk-row input{flex:1;min-width:120px;background:var(--field,rgba(255,255,255,.08));border:1px solid var(--edge2,rgba(255,255,255,.14));border-radius:12px;padding:6px 12px;color:inherit;font:inherit;font-size:13px;outline:none}
  .stk-sz{display:flex;gap:4px}
  .stk-grid{overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:8px;padding:2px;flex:1;min-height:90px}
  .stk-grid button{aspect-ratio:1;border:1px solid var(--edge2,rgba(255,255,255,.1));background:var(--glass,rgba(255,255,255,.07));border-radius:16px;padding:4px;cursor:pointer;display:grid;place-items:center}
  .stk-grid button:hover{background:var(--glass2,rgba(255,255,255,.14));transform:translateY(-2px)}
  .stk-grid img{width:100%;height:100%;object-fit:contain;pointer-events:none}
  .stk-empty{grid-column:1/-1;text-align:center;opacity:.7;padding:20px 0;font-size:13px}
  #editor img.mn-stk{display:inline-block;vertical-align:middle;margin:2px 3px;cursor:pointer;height:auto}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const panel = document.createElement("div");
  panel.className = "stk-panel hide";
  panel.innerHTML = `<div class="stk-top"><b>ملصقات طبية</b><button class="stk-rand" id="stkRand" title="ملصق عشوائي">🎲 عشوائي</button><button class="stk-x" id="stkX" aria-label="إغلاق">✕</button></div>
    <div class="stk-tabs" id="stkTabs"></div>
    <div class="stk-row"><input id="stkQ" placeholder="ابحث عن ملصق…"><div class="stk-sz" id="stkSz"></div></div>
    <div class="stk-grid" id="stkGrid"></div>`;
  document.body.appendChild(panel);

  function renderTabs() {
    const tabs = [{ id: "recent", name: "الأخيرة" }].concat(PACKS.map(p => ({ id: p.id, name: p.name })));
    $("#stkTabs").innerHTML = tabs.map(t => `<button data-t="${t.id}" class="${t.id === tab ? "on" : ""}">${t.name}</button>`).join("");
    $("#stkTabs").querySelectorAll("button").forEach(b => b.onclick = () => { tab = b.dataset.t; query = ""; $("#stkQ").value = ""; renderTabs(); renderGrid(); });
    $("#stkSz").innerHTML = Object.keys(SIZES).map(k => `<button data-s="${k}" class="${k === size ? "on" : ""}">${SIZES[k].l}</button>`).join("");
    $("#stkSz").querySelectorAll("button").forEach(b => b.onclick = () => { size = b.dataset.s; renderTabs(); });
  }
  function renderGrid() {
    let items;
    if (query) items = allItems().filter(i => i.n.includes(query));
    else if (tab === "recent") items = getRecent().map(findItem).filter(Boolean);
    else items = (PACKS.find(p => p.id === tab) || { items: [] }).items;
    const g = $("#stkGrid");
    g.innerHTML = items.length ? items.map(i => `<button data-id="${i.id}" title="${i.n}"><img alt="${i.n}" src="${uri(i.svg)}"></button>`).join("")
      : `<div class="stk-empty">${tab === "recent" && !query ? "ستظهر هنا ملصقاتك الأخيرة" : "لا نتائج"}</div>`;
    g.querySelectorAll("button").forEach(b => b.onclick = () => insert(findItem(b.dataset.id)));
  }
  function openPanel() { if (tab === "recent" && !getRecent().length) tab = "organs"; renderTabs(); renderGrid(); panel.classList.remove("hide"); }
  function closePanel() { panel.classList.add("hide"); }
  $("#stkX").onclick = closePanel;
  $("#stkQ").oninput = e => { query = e.target.value.trim(); renderGrid(); };
  $("#stkRand").onclick = () => { const a = allItems(); insert(a[Math.floor(Math.random() * a.length)]); };
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePanel(); });

  /* ---------- حفظ موضع المؤشر داخل المحرر ---------- */
  let lastRange = null;
  document.addEventListener("selectionchange", () => {
    const ed = $("#editor"), s = getSelection();
    if (ed && s && s.rangeCount && ed.contains(s.anchorNode)) lastRange = s.getRangeAt(0).cloneRange();
  });

  /* ---------- الإدراج ---------- */
  const inInk = () => { const b = $("#modeInk"); return !!(b && b.classList.contains("on")); };
  async function svgToPng(svg, px) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => { const c = document.createElement("canvas"); c.width = c.height = px; c.getContext("2d").drawImage(im, 0, 0, px, px); c.toBlob(b => b ? res(b) : rej(new Error("png")), "image/png"); };
      im.onerror = () => rej(new Error("img")); im.src = uri(svg);
    });
  }
  async function insert(item) {
    if (!item) return;
    pushRecent(item.id);
    if (inInk()) {
      if (!(window.MN_API && MN_API.addInkSticker)) { toast("الصفحة اليدوية تحتاج النسخة الأحدث من index.html لدعم الملصقات."); return; }
      try { const blob = await svgToPng(item.svg, 480); const ok = await MN_API.addInkSticker(blob, SIZES[size].ink); if (ok) { closePanel(); toast("أُضيف الملصق. امسحه بالممحاة لحذفه."); } }
      catch (e) { toast("تعذر إدراج الملصق"); }
      return;
    }
    const ed = $("#editor");
    if (!ed || ed.getAttribute("contenteditable") === "false") { toast("افتح صفحة أولاً ثم اختر الملصق"); return; }
    ed.focus();
    if (lastRange) { const s = getSelection(); s.removeAllRanges(); s.addRange(lastRange); }
    const w = SIZES[size].txt;
    document.execCommand("insertHTML", false, `<img class="mn-stk" src="${uri(item.svg)}" width="${w}" alt="${item.n}" draggable="false">&nbsp;`);
    ed.dispatchEvent(new Event("input", { bubbles: true }));
    closePanel();
  }

  /* انقر على ملصق داخل النص لتبديل حجمه */
  document.addEventListener("click", e => {
    const im = e.target && e.target.closest && e.target.closest("#editor img.mn-stk");
    if (!im) return;
    const sizes = [54, 84, 130, 190], cur = +im.getAttribute("width") || 84, i = sizes.indexOf(cur);
    im.setAttribute("width", sizes[(i + 1) % sizes.length]);
    const ed = $("#editor"); ed && ed.dispatchEvent(new Event("input", { bubbles: true }));
  });

  /* ---------- حقن الزر في شريط الأدوات ---------- */
  const ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-8-8h2l6 6z"/><path d="M14 4v4a2 2 0 0 0 2 2h4"/><path d="M9 14c1 1.3 2.3 2 4 2"/></svg>';
  function injectBtn() {
    const tb = $("#toolbar");
    if (!tb || tb.querySelector("#stkBtn")) return !!tb;
    const b = document.createElement("button");
    b.id = "stkBtn"; b.className = "stk-btn"; b.title = "ملصقات طبية"; b.innerHTML = ICON;
    b.addEventListener("mousedown", e => e.preventDefault());
    b.onclick = () => (panel.classList.contains("hide") ? openPanel() : closePanel());
    const ref = $("#imgBtn") || $("#recBtn") || tb.firstChild;
    tb.insertBefore(b, ref);
    return true;
  }
  if (!injectBtn()) { const iv = setInterval(() => { if (injectBtn()) clearInterval(iv); }, 400); setTimeout(() => clearInterval(iv), 20000); }

  window.MN_STICKERS = {
    packs: PACKS,
    open: openPanel,
    close: closePanel,
    register(pack) { if (!pack || !pack.id || !Array.isArray(pack.items)) return; pack.items.forEach(i => { i.pack = pack.id; }); PACKS.push(pack); renderTabs(); },
    insert: id => insert(findItem(id))
  };
})();
