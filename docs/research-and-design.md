# Landing: araşdırma və dizayn qərarları

Seller.az onlayn mağaza platformasıdır (Shopify/Shopier tipli). Landing yalnız bu imkanları göstərir:
onlayn mağaza, hazır temalar və vizual redaktor, sifarişlər, stok, müştəriyə görə qiymət tipləri, Bein Systems
və Telegram inteqrasiyası, istəyə görə məhsul icarəsi modulu. ERP, kassa (POS), anbar, maliyyə, heyət və
avtomobil icarəsi platformada yoxdur və saytda təbliğ edilmir.

## Struktur

- Hero: 3D model (idarə paneli, mağaza, sifarişlər) və qısa izah; WebGL işləməyəndə CSS fallback.
- Platforma: üç illüstrasiyalı hekayə (sifarişlər, stok, müştəriyə görə qiymət).
- Temalar, "Mağazanız sizə bənzəsin" bölməsi və məhsul icarəsi qeydi.
- İnteqrasiyalar (Bein Systems, Telegram), üç addımda başlanğıc, FAQ, portfolio.

## Qərarlar

- Qeydiyyat bağlantıları sadədir: `https://admin.seller.az/auth/register` və Bein Systems üçün `?setup=akul`.
  Fəaliyyət növü seçimi yoxdur, hər hesab onlayn mağazadır.
- Mətnlərdə backend-in etmədiyi iddia olmamalıdır. İmkan dəyişəndə `index.html`, `script.js`, `src/scene.js`
  və `tests/ui/site.spec.js` birlikdə yenilənir.
- Portfolio layihələri `public/data/projects.json` faylından gəlir; yalnız Seller-in indi dəstəklədiyi imkanlar yazılır.

## Yoxlama

`npm test` (portfolio vahid testləri) və `npx playwright test` (UI) işlədilir.
