# Seller landing

Seller-in təqdimat saytı və ayrıca `/portfolio.html` səhifəsi. Vanilla HTML/CSS/JS,
Vite və Three.js. Çıxış adi statik saytdır; React və ayrıca API tələb etmir.

## Lokal işə salmaq

Node.js 22.12+ (və ya uyğun yeni versiya) lazımdır.

```sh
npm ci
npm run dev
```

Önizləmə: `http://127.0.0.1:4173/` və `http://127.0.0.1:4173/portfolio.html`.

```sh
npm test          # portfolio məlumatı, axtarış və URL təhlükəsizliyi
npm run test:ui   # ayrıca test brauzerində müştəri ssenariləri
npm run build    # dist/ qovluğuna production faylları
npm run preview  # production nəticəsini lokal göstər
```

macOS testləri quraşdırılmış Google Chrome-dan istifadə edir. Başqa sistemdə
`npx playwright install chromium` işlədin və ya `CHROME_EXECUTABLE` təyin edin.

## Portfolio-ya layihə əlavə etmək

1. Şəkli `public/portfolio/` daxilinə qoyun (tövsiyə: 1200 × 800 WebP).
2. `public/data/projects.json` massivinə aşağıdakı formatda obyekt əlavə edin.
3. Lokal `/portfolio.html` səhifəsinə baxın və `npm run build` işlədin.

```json
[
  {
    "title": "Layihənin real adı",
    "category": "Onlayn mağaza",
    "summary": "Bu layihədə gördüyünüz işi təsvir edən qısa mətn.",
    "year": 2026,
    "cover": "/portfolio/layihe.webp",
    "coverAlt": "Layihənin ana səhifəsinin görünüşü",
    "services": ["Store", "Kataloq", "POS"],
    "url": "https://layihenin-real-unvani.az",
    "published": true
  }
]
```

`title` və `category` məcburidir. Digər sahələr seçimlidir. Massivin sırası
səhifədəki sıradır. Kateqoriya filtrləri avtomatik yaranır; Azərbaycan dilinə
uyğun axtarış ad, kateqoriya, açıqlama və xidmətlər üzrə işləyir. URL yoxdursa
keçid göstərilmir. Şəkil yoxdursa adın baş hərfləri görünür.
Qara fonda loqonu kəsmədən göstərmək üçün `"coverStyle": "logo-dark"` əlavə edin;
açıq fonlu loqo üçün `"coverStyle": "logo-light"` seçin. Standart görünüş şəkli
kartın ölçüsünə uyğun doldurur.

`published: false` yalnız kartın görünüşünü gizlədir. JSON və şəkillər **açıq
fayllardır**; orada məxfi qaralama və müştəri məlumatı saxlamayın. Bu, CMS və ya
admin yükləmə paneli deyil: layihələr fayldan idarə edilir.

Hazırda portfolio-da Gross Auto (Store və Akul inteqrasiyası), Goncha Gallery
(gəlinlik satışı, məhsul icarəsi və POS kassa) və Kral Rent A Car (avtomobil
icarəsi fəaliyyət profili) var. Loqolar bizneslərin rəsmi saytından və Instagram
profilindən götürülüb; mənbələr `docs/portfolio-assets.md` faylındadır. Testdəki
nümunələr yalnız fixture-dir.

## Fayllar

- `index.html`: server tərəfindən oxuna bilən landing məzmunu və SEO.
- `portfolio.html`: ayrıca portfolio səhifəsi, layihə siyahısı və boş vəziyyət.
- `style.css`: ortaq dizayn, mobil görünüş və reduced-motion qaydaları.
- `script.js`: menyu, bir dəfə oynanan illüstrasiya animasiyaları, təxirə salınmış 3D importu.
- `src/scene.js`: prosedural Three.js model, event-driven render, GPU cleanup.
- `src/portfolio.js`: siyahı, filtrlər, axtarış və error/retry görünüşü.
- `src/icons.js`: dinamik portfolio kartları üçün yerli SVG ikonları.
- `scripts/build-icons.mjs`: Solar ikonlarından kiçik lokal dəst yaradır.
- `src/portfolio-data.js`: yoxlama və təhlükəsiz URL normallaşdırılması.
- `public/`: birbaşa `dist/`-ə köçürülən fayllar.
- `docs/research-and-design.md`: məhsul analizi və dizayn qərarları.

## Yayım

Bu versiya **build tələb edir**. Hostinqə repo kökü əvəzinə `dist/` məzmununu
verin. Menyudakı `/portfolio.html` keçidi ayrıca çıxış faylını açır və
qovluq yönləndirməsi tələb etmir. Köhnə `/portfolio/` keçidləri üçün build zamanı
`dist/portfolio/index.html` uyğunluq nüsxəsi də yaradılır.
`/data/projects.json`, `/assets/`, `/robots.txt` və `/sitemap.xml` açıq olmalıdır.
SPA fallback tələb olunmur. Statik hostinqdə kök domen üçün nəzərdə tutulub.

Domain dəyişərsə hər iki HTML-in canonical/OG ünvanlarını, robots və sitemap-i
yeniləyin. Şrift və 3D bundle lokal xidmət edilir; runtime CDN asılılığı yoxdur.
İkonlar Solar Bold Duotone (480 Design, CC BY 4.0) dəstindəndir, lokal SVG
faylından gəlir. Mənbə/lisenziya `public/assets/icons-LICENSE.txt` daxilindədir;
`npm run icons` seçilmiş dəsti yenidən yaradır.
Əvvəlki böyük brend faylları saxlanılıb, səhifə optimallaşdırılmış törəmələrdən
istifadə edir.

Production-a deploy bu dəyişiklik daxilində edilməyib. Tenant, API, autentifikasiya,
səbət, checkout və biznes qaydaları digər repolarda olduğu kimi qalır.
