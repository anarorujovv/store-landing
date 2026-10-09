# Seller: araşdırma və dizayn qərarları

Son yenilənmə: 2026-10-08. İlkin araşdırma: 2026-10-07. Owner: **Store module storefront — Seller təqdimat səthi**.
Dəyişiklik yeri: `store-landing`. Backend və tenant axınlarına müdaxilə yoxdur.

## Layihələrin xəritəsi

| Layihə          | Faktiki rol                                                                                  | Oxunan mənbələr                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `store`         | Next.js 16 / React 19 müştəri vitrini; backend capability ilə açılır                         | `AGENTS.md`, `docs/platform-contract.md`, `docs/README.md`, route/modul strukturu                                 |
| `store-admin`   | React / Vite / Ant Design idarə paneli; satış, alış, anbar, Finance, heyət və modul ayarları | `README.md`, `docs/platform-contract.md`, `RegisterForm.jsx`, modul manifestləri                                  |
| `store-backend` | Express / MySQL; tenant, qiymət, stok, sənəd, modul və səlahiyyət qaydaları                  | `config/businessProfiles.js`, `modules/store/manifest.js`, `docs/business-profiles.md`, `docs/operations-core.md` |
| `store-pos`     | React / Electron kassa; internetlə işləyir; printerlərə məhdud adapter                       | `AGENTS.md`, `README.md`, `src/api.js`, route/fayl strukturu                                                      |
| `store-landing` | Seller-in açıq təqdimat saytı; əvvəl statik HTML/CSS/JS                                      | Mövcud HTML, CSS, JS, brend aktivləri, robots və sitemap                                                          |

Bu araşdırma landing-in məhsul məzmununu müəyyənləşdirir; bütün repoların tam
kod və təhlükəsizlik auditi deyil. Digər repolardakı mövcud dəyişikliklər saxlanılıb.

## Köhnə səhifənin problemləri

- E-ticarət mərkəzli mətn Seller-in əsas ERP imkanlarını əhatə etmirdi.
- “Qeydiyyat → vitrin hazırdır” axını Store-un ayrıca aktivləşdirilməsini izah etmirdi.
- “Sifariş gələndə stok yenilənir” cümləsi yeni sənəd/anbar kontraktını həddən artıq sadələşdirirdi.
- SEO JSON-LD-də təsdiqlənməmiş sıfır qiymətli təklif var idi.
- Böyük loqo animasiyası iş axınını göstərmirdi; əsas məhsul vizualı yox idi.
- Reveal CSS JavaScript alınmadıqda məzmunu gizli saxlaya bilirdi.
- Ayrıca portfolio ünvanı və əlavə edilə bilən layihə strukturu yox idi.

## Qorunan məhsul həqiqətləri

Seller-in əsas idarəetməsi Store-dan asılı deyil. Qeydiyyatda ticarət və avtomobil
icarəsi profili seçilir. Store ayrıca aktivləşdirilir; hər profilin öz public
journey-si var. Məhsul icarəsi ticarətə əlavə oluna bilər. POS yalnız online-dır;
offline satış və fiskal inteqrasiya vəd edilmir. Akul uyğun ticarət + Store
quruluşundadır. Sifariş, satış və ödəniş ayrı sənədlərdir. Nümunə rəqəmləri və
vitrin real müştəri sübutu kimi göstərilmir.

## Dizayn və məzmun

Vizual fikir: biznesin müxtəlif səthləri bir platformaya fiziki bağlanır.
Soyuq ağ və açıq mavi fon, tünd əsas CTA, Manrope Variable şrifti və mövcud Seller
loqosu. Üçölçülü idarə ekranı, mağaza, kassa və mal qutuları bu əlaqəni göstərir.
Səhnə real geometriya, işıq və kölgələrdən ibarətdir. Şəkil ilə əvəz olunmur.

Səhifə ardıcıllığı:

1. Hero: “Öz onlayn mağazanızı yaradın.” / “Mağazanı yarat”.
2. Sifariş, anbar və ödəniş üçün üç sadə illüstrasiya və qısa izah. Qarışıq nümunə cədvəlləri istifadəçi rəyinə əsasən çıxarılıb.
3. Öz loqosu, rəngləri və ayrıca ünvanı olan Store ön plandadır; POS və icarə haqqında qısa izahlar davam edir.
4. Akul və Telegram üçün uyğunluq konteksti.
5. Ticarət hesabı yaratmaq → Store-u aktivləşdirib vitrin qurmaq → məhsulları və mağazanın keçidini paylaşmaq.
6. Altı sual/cavab; əsas CTA-nın təkrarı.

Məzmun: stokun sənədlə izlənməsi, maliyyə hesablaşmasının ayrılığı, komanda
icazələri və brendə uyğun onlayn vitrin. Təsdiqlənmiş rəy, müştəri nəticəsi və
qiymət olmadığı üçün saxta sosial sübut və qiymət cədvəli yoxdur. Evergreen
səhifələr indexlənə bilər; hər iki route üçün title, description, canonical,
Open Graph və sitemap əlavə edilib. Portfolio landing-ə yerləşdirilməyib.

## Portfolio

`/portfolio.html` öz hero, layihə kolleksiyası və CTA-sı olan ayrıca HTML girişidir.
Menyular birbaşa fayla keçir; directory-index/rewrite tələb olunmur. Köhnə
`/portfolio`, `/portfolio/`, `/portfolio/index.html` ünvanları development-də
yönləndirilir, production-da eyni səhifənin qovluq nüsxəsi ilə qorunur.
İstifadəçinin bildirdiyi canlı 404 ünvanı məlum deyil; server konfiqurasiyası
barədə sübut olunmamış səbəb irəli sürülmür.
`public/data/projects.json` məzmunu idarə edir. Kateqoriya filtrləri, AZ axtarışı,
boş siyahı, nəticə tapılmaması, yükləmə xətası/retry və şəkil fallback-i var.
Məlumat DOM-a `textContent` ilə yazılır; keçid protokolları yoxlanılır.
Gross Auto ilk real layihə kimi əlavə edilib. Rəsmi loqo grossauto.az saytından
götürülüb; Store modulu və Akul inteqrasiyası məlumatı istifadəçi tərəfindən verilib.
Uydurma müştəri portfolioları yoxdur.

## Motion və performans

Three.js ayrıca lazy bundle-dır. Səhnə input/ölçü/seçim dəyişəndə render edilir;
sonsuz idle animasiya yoxdur. Görünməyən tab və səhnədə render dayanır. DPR mobil
cihazlarda 1.5, digərlərində 2 ilə məhdudlaşır. Reduced motion dəyişiklikləri
birbaşa sabit kadrla göstərir. WebGL və modul yüklənməsi alınmasa CSS fallback
qalır. Mətn heç vaxt animasiyanın açılmasını gözləmir. Texture, material,
geometriya, observer və renderer cleanup mövcuddur.

İllüstrasiya hissələri viewport-a daxil olanda bir dəfə 650 ms-lik yüngül
transform/opacity animasiyası ilə yerinə oturur. Sonsuz hərəkət yoxdur; reduced
motion və JavaScript bağlı olduqda tam, sabit vizual görünür. Mətn simvolları
yerli Solar Bold Duotone SVG ikonları ilə əvəz olunub.

Three.js istinad: https://threejs.org/docs/ (0.180.0 versiyasına pin edilib).

## Qəbul meyarları

- Qonaq landing-dən login/register ünvanına düzgün keçə bilir.
- Portfolio ayrıca route-dur və naviqasiyadan açılır.
- 320–1440 px ölçülərdə səhifə səviyyəsində üfüqi daşma yoxdur.
- Tab, Shift+Tab və Escape ilə naviqasiya işləyir; sual/cavablar native details/summary-dir.
- WebGL bağlı və reduced-motion aktiv olduqda məzmun/CTA işləyir.
- Layihələr boş, dolu, filterlə boş və network-error vəziyyətlərində düzgündür.
- HTML məzmunu icra olunmur, javascript/data/file URL-ləri keçidə çevrilmir.
- Production build hər iki HTML-i, lokal şriftləri, məlumatları və SEO fayllarını çıxarır.

Store-disabled və profil uyarlılığı burada mətn/CTA səviyyəsində qorunur;
landing public API çağırmır və checkout təklif etmir. Digər repoların maliyyə,
checkout və Rental testləri bu təqdimat dəyişikliyi üçün yenidən işə salınmır.

## Yoxlama nəticəsi — 2026-10-08 düzəlişi

- 11 fərqli UI ssenarisi yoxlandı: ilkin qaçışda 10 keçdi; mobil header düzəlişindən sonra responsive ssenari ayrıca keçdi.
- Yoxlanan axınlar: mağaza yaratmaq CTA-sı, 3D seçimləri, sadə illüstrasiyalar, FAQ, mobil menyu, portfolio loading/empty/filter/error/retry, təhlükəsiz keçid və mətn, JavaScript/WebGL bağlı hal, reduced motion.
- 320, 390, 768, 1024 və 1440 px, həmçinin 200% böyütmə yoxlandı. Kiçik ekranda header daşması və uzun hero sözünün kəsilməsi düzəldildi.
- `npm run build`: uğurlu; `portfolio.html` və köhnə ünvan üçün `portfolio/index.html` çıxır.
- Yığılmış `dist/` adi Python statik serverində 3/3 ssenari keçdi: mobil menyudan portfolio, birbaşa/köhnə URL-lər, yenidən yükləmə, query saxlanması və responsive görünüş.
- Portfolio məlumat kontraktı dəyişməyib. İlkin versiyanın 6 unit testi keçmişdi; bu təqdimat düzəlişində yenidən işə salınmayıb.
- Canlı brauzerdə desktop/mobil illüstrasiyalar, mağaza bölməsi, SVG ikonları və portfolio keçidi yoxlandı. Görüntülər `docs/screenshots/` daxilindədir.

Qalan hədlər: fiziki telefon/Safari/Firefox yoxlanmayıb. Canlı domenə deploy
edilməyib. Hostinqə yeni `dist/` məzmunu verilməlidir. API, autentifikasiya,
tenant, checkout və maliyyə qaydaları dəyişmədiyindən digər repoların testləri
təkrarlanmayıb.

## Gross Auto əlavəsinin yoxlanması

2026-10-08: Rəsmi loqo dəyişdirilmədən yerli WebP kimi əlavə edilib. Loqo üçün
kəsməyən qara fonlu kart görünüşü var. Portfolio üzrə 7 UI ssenarisi, 6 məlumat
testi və production build keçdi. Desktop/mobil görünüş brauzerdə yoxlanıb.
Canlı yayımlama edilməyib; API və tenant qaydalarına təsir yoxdur.

## Goncha Gallery əlavəsi

2026-10-08: Gəlinlik satışı, məhsul icarəsi və POS kassa istifadəsi istifadəçinin
verdiyi məlumat əsasında ikinci portfolio kartına əlavə edilib. Loqo açıq
Instagram profilindən götürülüb; keçid həmin profilə aparır. Mənbələr
`docs/portfolio-assets.md` daxilindədir. 6 məlumat testi, 2 naviqasiya ssenarisi
və production build keçdi. Brauzerdə POS axtarışı, gəlinlik filtri, loqonun
yüklənməsi və 390 px mobil görünüş yoxlandı. API və tenant qaydaları dəyişməyib;
canlı yayım edilməyib.
