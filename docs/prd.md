# Tələblər Sənədi

## 1. Tətbiq Haqqında Ümumi Məlumat

### 1.1 Tətbiq Adı
İTSEC AZ - Təhlükəsizlik Sistemləri E-ticarət Platforması

### 1.2 Tətbiq Təsviri
Təhlükəsizlik sistemləri və müşahidə avadanlıqlarının satışı üçün professional e-ticarət platforması. Mövcud sayt (https://itsecaz.onrender.com/) əsasında tam yenilənmiş versiya. Çoxdilli dəstək (AZ/EN/RU), çoxsəviyyəli istifadəçi rolları (admin, müştəri, topdancı, diler), real vaxt məlumat sinxronizasiyası və avtomatik qiymət hesablama sistemi ilə təchiz edilmişdir.

**Sayt yaradıcısı**: Jozef  
**Mütəxəssis**: İnformasiya texnologiyaları üzrə mütəxəssis - Təbriz İbrahimov  
**Əlaqə nömrəsi**: +994776117780 (077 611 77 80)

### 1.3 Texniki Mühit
- **Backend və Verilənlər Bazası**: Supabase (Auth, Storage, Realtime, Database tam konfiqurasiya edilmiş)
- **Hosting**: Render.com
- **Məqsəd**: Production-ready tam funksional onlayn veb sayt sistemi

## 2. İstifadəçilər və İstifadə Ssenarilər

### 2.1 Hədəf İstifadəçilər
- **Admin**: Sistem idarəçisi, məhsul və sifariş idarəetməsi
- **Müştəri**: Pərakəndə alıcılar
- **Topdancı**: Topdan alış edən biznes müştəriləri
- **Diler**: Paylayıcı şəbəkəsi üzvləri
- **Qonaq**: Qeydiyyatsız ziyarətçilər

### 2.2 Əsas İstifadə Ssenarilər
- Admin məhsul əlavə edir, sifarişləri idarə edir, statistikaları izləyir
- Müştəri məhsul axtarır, səbətə əlavə edir, WhatsApp vasitəsilə sifariş verir
- Topdancı xüsusi qiymətlərlə topdan sifariş verir
- Diler paylayıcı qiymətləri ilə məhsul alır
- Qonaq məhsulları nəzərdən keçirir, blog oxuyur, əlaqə qurur

## 3. Səhifə Strukturu və Funksiyalar

### 3.1 Səhifə İyerarxiyası

```
├── Ana Səhifə (Home)
├── Məhsullar (Products)
│   └── Məhsul Detalı (Product Detail)
├── Səbət (Cart)
├── Alətlər (Tools)
├── Bloq (Blog)
│   └── Məqalə Detalı (Blog Post)
├── Haqqımızda (About)
├── Əlaqə (Contact)
├── Giriş/Qeydiyyat (Login/Register)
├── Admin Paneli (Admin Panel)
│   ├── Dashboard
│   ├── Sifarişlər (Orders)
│   ├── Məhsullar İdarəetməsi (Products Management)
│   ├── Kateqoriyalar (Categories)
│   ├── Müştərilər (Customers)
│   ├── Banner İdarəetməsi (Banner Management)
│   ├── Bloq İdarəetməsi (Blog Management)
│   ├── Müraciətlər (Quotes/Contacts)
│   ├── Hesabatlar (Reports)
│   └── Parametrlər (Settings)
├── Müştəri Paneli (Customer Panel)
│   ├── Profil (Profile)
│   ├── Sifarişlər Tarixi (Order History)
│   ├── Ünvanlar (Addresses)
│   └── Favorilər (Favorites)
├── Topdancı Paneli (Wholesale Panel)
│   ├── Profil
│   ├── Topdan Sifarişlər
│   └── Endirim Faizləri
└── Diler Paneli (Dealer Panel)
    ├── Profil
    ├── Diler Sifarişlər
    └── Qiymət Cədvəli
```

### 3.2 Ümumi Komponentlər

#### 3.2.1 Header
- Logo (sol tərəf)
- Naviqasiya menyusu: Ana Səhifə, Məhsullar, Alətlər, Bloq, Haqqımızda, Əlaqə
- Dil seçici (AZ/EN/RU)
- Tema keçidi (Dark/Light)
- Səbət ikonu (məhsul sayı göstəricisi ilə)
- Giriş/Qeydiyyat düyməsi (və ya istifadəçi profil menyusu)

#### 3.2.2 Footer
- QR kod widget
- Əlaqə məlumatları: +994776117780 (077 611 77 80)
- Sosial media linkləri
- Sayt xəritəsi
- Copyright məlumatı

### 3.3 Ana Səhifə (Home Page)

#### 3.3.1 Hero Banner
- Slider formatında banner göstərilməsi
- Admin paneldən idarə edilə bilən banner məzmunu

#### 3.3.2 Xüsusiyyətlər Bölməsi
- Platformanın əsas üstünlüklərinin göstərilməsi

#### 3.3.3 Məşhur Məhsullar
- Admin tərəfindən seçilmiş məhsulların göstərilməsi
- Məhsul kartı: şəkil, ad, qiymət (istifadəçi roluna görə), stok statusu

#### 3.3.4 Kateqoriyalar Grid
- Əsas məhsul kateqoriyalarının grid formatında göstərilməsi

#### 3.3.5 Bloq Bölməsi
- Son bloq yazılarının göstərilməsi

#### 3.3.6 Əlaqə Bölməsi
- Əlaqə forması
- Əlaqə məlumatları: +994776117780
- WhatsApp əlaqə düyməsi (+994776117780)

#### 3.3.7 Partnyorlar/Brendlər Slider
- Əməkdaşlıq edilən brendlərin loqolarının slider formatında göstərilməsi

### 3.4 Məhsullar Səhifəsi (Products Page)

#### 3.4.1 Kateqoriya Naviqasiyası
- Əsas kateqoriyalar: CCTV Kameralar, NVR/DVR, Access Control, Alarm Sistemləri, Kabelaş, Aksesuarlar

#### 3.4.2 Filterlər
- Kateqoriya filtri
- Qiymət aralığı filtri
- Brend filtri
- Stok statusu filtri

#### 3.4.3 Axtarış
- Məhsul adı və təsvirə görə axtarış

#### 3.4.4 Məhsul Siyahısı
- Grid formatında məhsul kartları
- Səbətə əlavə et düyməsi
- Favorilərə əlavə et düyməsi

#### 3.4.5 Sıralama
- Qiymətə görə (artan/azalan)
- Ada görə (A-Z/Z-A)
- Yeni əlavə edilənlər

### 3.5 Məhsul Detalı Səhifəsi (Product Detail Page)

#### 3.5.1 Məhsul Şəkilləri
- Əsas şəkil böyük göstərilməsi
- Əlavə şəkillərin thumbnail formatında göstərilməsi

#### 3.5.2 Məhsul Məlumatları
- Məhsul adı
- Qiymət (istifadəçi roluna görə)
- Stok statusu
- Brend
- Qısa təsvir

#### 3.5.3 Əməliyyatlar
- Miqdar seçimi
- Səbətə əlavə et düyməsi
- Favorilərə əlavə et düyməsi
- WhatsApp ilə sifariş ver düyməsi

#### 3.5.4 WhatsApp Sifariş Paneli (Sheet/Drawer)

**Açılma şərti**: İstifadəçi \"WhatsApp ilə sifariş ver\" düyməsinə tıkladıqda panel açılır.

**Panel sahələri**:
1. Müştəri məlumatları: Ad, Telefon nömrəsi (+994 formatında)
2. Məhsul məlumatı: Məhsul adı, SKU, Qiymət (avtomatik doldurulur)
3. Ədəd (Miqdar): Miqdar seçimi, Cəm məbləğ (avtomatik hesablanır)
4. Keyfiyyət növü: Standart, Premium, Toplu/Topdancı
5. Müqavilə/Xidmət şərtləri (checkbox):
   - Hissə-hissə ödəniş (3-12 ay)
   - Çatdırılma xidməti lazımdır
   - Quraşdırma xidməti lazımdır
   - Uzadılmış zəmanət istəyirəm
   - Rəsmi faktura lazımdır
6. Əlavə qeydlər (textarea)
7. Təsdiq düyməsi: \"Sifarişi WhatsApp-a göndər\"

**Sifariş göndərilməsi**: +994776117780 nömrəsinə WhatsApp mesajı göndərilir.

#### 3.5.5 Texniki Xüsusiyyətlər
- Məhsulun texniki parametrlərinin cədvəl formatında göstərilməsi

#### 3.5.6 Yükləmə
- Məhsul təlimatları və sənədlərinin yükləmə linkləri

### 3.6 Səbət Səhifəsi (Cart Page)

#### 3.6.1 Səbət Məhsulları
- Hər məhsul üçün: şəkil, ad, qiymət, miqdar, cəm
- Miqdar dəyişdirmə
- Məhsulu sil düyməsi

#### 3.6.2 Səbət Xülasəsi
- Ara cəm
- Çatdırılma (əgər tətbiq olunarsa)
- Ümumi məbləğ

#### 3.6.3 Sifariş Tamamlama
- WhatsApp vasitəsilə sifariş göndərmə düyməsi (+994776117780)
- Sifariş məlumatlarının avtomatik formatlanması

### 3.7 Alətlər Səhifəsi (Tools Page)

#### 3.7.1 Kamera Sıxlığı Hesablaması
- Giriş parametrləri: məsafə, obyekt ölçüsü
- Hesablama düyməsi
- Nəticə: tövsiyə olunan kamera sıxlığı

#### 3.7.2 Saxlama Hesablaması
- Giriş parametrləri: kamera sayı, sıxlıq, fps, saxlama müddəti
- Hesablama düyməsi
- Nəticə: tələb olunan saxlama həcmi

### 3.8 Bloq Səhifəsi (Blog Page)

#### 3.8.1 Bloq Siyahısı
- Məqalələrin grid formatında göstərilməsi

#### 3.8.2 Kateqoriya Filtri
- Bloq kateqoriyalarına görə filtrasiya

#### 3.8.3 Məqalə Detalı
- Tam məqalə məzmunu
- Müəllif məlumatı
- Nəşr tarixi

### 3.9 Haqqımızda Səhifəsi (About Page)

#### 3.9.1 Şirkət Tarixi
- Şirkətin yaranma tarixi və inkişaf yolu

#### 3.9.2 Komanda
- Komanda üzvlərinin təqdimatı

### 3.10 Əlaqə Səhifəsi (Contact Page)

#### 3.10.1 Əlaqə Forması
- Ad, email, mövzu, mesaj sahələri
- Göndər düyməsi

#### 3.10.2 Əlaqə Məlumatları
- Telefon: +994776117780 (077 611 77 80)
- Email
- İş saatları

#### 3.10.3 Xəritə
- Şirkət ünvanının xəritədə göstərilməsi

#### 3.10.4 WhatsApp Əlaqə
- WhatsApp vasitəsilə birbaşa əlaqə düyməsi (+994776117780)

### 3.11 Giriş/Qeydiyyat Səhifəsi (Login/Register Page)

#### 3.11.1 Giriş Forması
- Email və şifrə sahələri
- Giriş düyməsi
- Şifrəni unutdum linki

#### 3.11.2 Qeydiyyat Forması
- Ad, email, şifrə, şifrə təkrarı sahələri
- İstifadəçi tipi seçimi (Müştəri/Topdancı/Diler)
- Qeydiyyat düyməsi

### 3.12 Admin Paneli

#### 3.12.1 Dashboard
- Ümumi statistikalar: ümumi satış, sifariş sayı, müştəri sayı, məhsul sayı
- Son sifarişlərin siyahısı
- Gəlir qrafiki

#### 3.12.2 Sifarişlər (Orders)
- Sifarişlərin cədvəl formatında göstərilməsi
- Status dəyişdirmə
- Sifariş detalına baxış

#### 3.12.3 Məhsullar İdarəetməsi (Products Management)
- Məhsullərin cədvəl formatında göstərilməsi
- Yeni məhsul əlavə et düyməsi
- Məhsul redaktə et
- Məhsul sil
- Şəkil yükləmə: mobil və PC-dən şəkil yükləmə, avtomatik WEBP formatına çevrilmə, 1080p ölçüyə endirilmə, 0.8 keyfiyyət sıxışdırması, Supabase Storage-də saxlanılması

#### 3.12.4 Kateqoriyalar (Categories)
- Kateqoriyaların siyahısı
- Yeni kateqoriya əlavə et
- Kateqoriya redaktə et

#### 3.12.5 Müştərilər (Customers)
- Müştərilərin cədvəl formatında göstərilməsi
- Müştəri detalına baxış
- Rol dəyişdirmə

#### 3.12.6 Banner İdarəetməsi (Banner Management)
- Ana səhifə bannerlərinin idarə edilməsi
- Yeni banner əlavə et
- Banner redaktə et

#### 3.12.7 Bloq İdarəetməsi (Blog Management)
- Bloq yazılarının siyahısı
- Yeni yazı əlavə et
- Yazı redaktə et

#### 3.12.8 Müraciətlər (Quotes/Contacts)
- Əlaqə forması vasitəsilə gələn müraciətlərin siyahısı
- Status dəyişdirmə

#### 3.12.9 Hesabatlar (Reports)
- Satış hesabatları
- Məhsul hesabatları
- Müştəri hesabatları

#### 3.12.10 Parametrlər (Settings)
- Ümumi parametrlər: sayt adı, logo, əlaqə məlumatları (+994776117780)
- Qiymət hesablama faizləri: müştəri faizi, topdancı faizi, diler faizi
- Dil parametrləri
- Tema parametrləri

### 3.13 Müştəri Paneli (Customer Panel)

#### 3.13.1 Profil (Profile)
- Şəxsi məlumatlar: ad, email, telefon
- Profil redaktə et

#### 3.13.2 Sifarişlər Tarixi (Order History)
- Keçmiş sifarişlərin siyahısı

#### 3.13.3 Ünvanlar (Addresses)
- Saxlanmış ünvanların siyahısı
- Yeni ünvan əlavə et

#### 3.13.4 Favorilər (Favorites)
- Favori məhsullərin siyahısı

### 3.14 Topdancı Paneli (Wholesale Panel)

#### 3.14.1 Profil
- Şəxsi məlumatlar
- Profil redaktə et

#### 3.14.2 Topdan Sifarişlər
- Topdan sifarişlərin siyahısı

#### 3.14.3 Endirim Faizləri
- Topdancı üçün tətbiq olunan endirim faizlərinin göstərilməsi

### 3.15 Diler Paneli (Dealer Panel)

#### 3.15.1 Profil
- Şəxsi məlumatlar
- Profil redaktə et

#### 3.15.2 Diler Sifarişlər
- Diler sifarişlərinin siyahısı

#### 3.15.3 Qiymət Cədvəli
- Diler üçün xüsusi qiymətlərin göstərilməsi

## 4. Biznes Qaydaları və Məntiq

### 4.1 İstifadəçi Rolları və İcazələr

#### 4.1.1 Qonaq
- Məhsulları görə bilər (müştəri qiymətləri ilə)
- Bloq oxuya bilər
- Əlaqə formasını istifadə edə bilər
- Səbətə məhsul əlavə edə bilər

#### 4.1.2 Müştəri
- Qonaq icazələri + sifariş verə bilər, sifariş tarixçəsini görə bilər, profil məlumatlarını redaktə edə bilər, favorilər yarada bilər

#### 4.1.3 Topdancı
- Müştəri icazələri + topdancı qiymətlərini görür, topdan sifariş verə bilər, endirim faizlərini görə bilər

#### 4.1.4 Diler
- Müştəri icazələri + diler qiymətlərini görür, xüsusi qiymət cədvəlinə çıxışı var

#### 4.1.5 Admin
- Tam sistem idarəetməsi icazələri

### 4.2 Qiymət Hesablama Sistemi

#### 4.2.1 Əsas Qiymət
- Admin məhsul əlavə edərkən əsas qiyməti daxil edir

#### 4.2.2 Avtomatik Hesablama
- Müştəri qiyməti = Əsas qiymət × (1 + Müştəri faizi)
- Topdancı qiyməti = Əsas qiymət × (1 + Topdancı faizi)
- Diler qiyməti = Əsas qiymət × (1 + Diler faizi)

#### 4.2.3 Faiz Tənzimləməsi
- Admin paneldə hər rol üçün faiz dərəcəsi tənzimlənə bilər
- Faiz dəyişikliyi bütün məhsullara avtomatik tətbiq olunur

#### 4.2.4 Qiymət Göstərilməsi
- Hər istifadəçi yalnız öz roluna uyğun qiyməti görür

### 4.3 Sifariş Prosesi

#### 4.3.1 Səbətə Əlavə
- İstifadəçi məhsulu səbətə əlavə edir
- Miqdar seçə bilər

#### 4.3.2 Sifariş Yaratma
- İstifadəçi səbətdən sifariş yaradır
- Sifariş məlumatları avtomatik formatlanır
- WhatsApp vasitəsilə +994776117780 nömrəsinə sifariş göndərilir

#### 4.3.3 Sifariş İdarəetməsi
- Admin sifarişləri görür və idarə edir
- Sifariş statusunu dəyişə bilər (yeni/təsdiqləndi/göndərildi/tamamlandı/ləğv edildi)

### 4.4 Real Vaxt Sinxronizasiya

#### 4.4.1 Admin Panel Dəyişiklikləri
- Admin paneldə edilən dəyişikliklər Supabase Realtime vasitəsilə real vaxtda bütün brauzerlərə yansımalıdır
- Məhsul əlavə/redaktə/silinməsi
- Sifariş status dəyişikliyi
- Banner dəyişikliyi

#### 4.4.2 Stok Yeniləməsi
- Məhsul stoku dəyişdikdə bütün istifadəçilərə real vaxtda göstərilir

### 4.5 Şəkil İdarəetməsi

#### 4.5.1 Yükləmə
- Mobil və PC-dən şəkil yükləmə dəstəyi
- Çoxlu şəkil yükləmə

#### 4.5.2 Avtomatik Emal
- WEBP formatına çevrilmə
- 1080p ölçüyə endirilmə
- 0.8 keyfiyyət sıxışdırması
- Saxlama: Supabase Storage

### 4.6 Çoxdilli Dəstək

#### 4.6.1 Dəstəklənən Dillər
- Azərbaycan dili (AZ) - default
- İngilis dili (EN)
- Rus dili (RU)

#### 4.6.2 Dil Seçimi
- Header-də dil seçici
- Seçilmiş dil saxlanılır

### 4.7 Tema Dəstəyi

#### 4.7.1 Mövcud Temalar
- Dark tema (default)
- Light tema

#### 4.7.2 Tema Keçidi
- Header-də tema keçid düyməsi
- Seçilmiş tema saxlanılır

### 4.8 WhatsApp İnteqrasiyası

#### 4.8.1 Sifariş Göndərmə (Səbətdən)
- Səbət məlumatları avtomatik formatlanır
- WhatsApp vasitəsilə +994776117780 nömrəsinə göndərilir

#### 4.8.2 WhatsApp Sifariş Paneli (Məhsul Detalından)
- Panel açılma: İstifadəçi məhsul detalı səhifəsində \"WhatsApp ilə sifariş ver\" düyməsinə tıkladıqda Sheet/Drawer formatında panel açılır
- Məlumat toplama: Müştəri adı və telefon nömrəsi, məhsul məlumatı, miqdar, keyfiyyət növü, xidmət şərtləri, əlavə qeydlər
- Sifariş formatlanması: İstifadəçi \"Sifarişi WhatsApp-a göndər\" düyməsinə tıkladıqda, bütün məlumatlar düzgün formatda +994776117780 nömrəsinə WhatsApp mesajına çevrilir

#### 4.8.3 Əlaqə
- Əlaqə səhifəsində WhatsApp düyməsi (+994776117780)
- Məhsul detalında WhatsApp sifariş düyməsi

### 4.9 Supabase Konfiqurasiyası

#### 4.9.1 Supabase Auth
- İstifadəçi qeydiyyatı və girişi
- Rol əsaslı icazə idarəetməsi

#### 4.9.2 Supabase Database
- Məhsullar, sifarişlər, müştərilər, kateqoriyalar, bannerlər, bloq məlumatlarının saxlanması

#### 4.9.3 Supabase Storage
- Məhsul şəkillərinin, banner şəkillərinin, bloq şəkillərinin saxlanması
- Avtomatik şəkil emalı

#### 4.9.4 Supabase Realtime
- Real vaxt məlumat sinxronizasiyası
- Admin panel dəyişikliklərinin real vaxtda yansıdılması

### 4.10 Render.com Deployment
- Production-ready tam funksional onlayn veb sayt sistemi
- Render.com üzərində hosting

## 5. İstisnalar və Sərhəd Halları

| Ssenari | Davranış |
|---------|----------|
| İstifadəçi qeydiyyatsız sifariş verməyə çalışır | Giriş səhifəsinə yönləndirilir |
| Məhsul stokda yoxdur | \"Stokda yoxdur\" statusu göstərilir, səbətə əlavə düyməsi deaktiv olur |
| Admin məhsul əlavə edərkən şəkil yükləmir | Xəta mesajı göstərilir, məhsul əlavə edilmir |
| İstifadəçi yanlış email/şifrə daxil edir | Xəta mesajı göstərilir |
| Qeydiyyat zamanı email artıq mövcuddur | \"Bu email artıq qeydiyyatdan keçib\" mesajı göstərilir |
| Admin sifariş statusunu dəyişir | Dəyişiklik Supabase Realtime vasitəsilə real vaxtda bütün brauzerlərə yansıyır |
| İstifadəçi səbətdə məhsul yoxdur | \"Səbətiniz boşdur\" mesajı göstərilir |
| Şəkil yükləmə zamanı xəta baş verir | Xəta mesajı göstərilir, yükləmə təkrar edilə bilər |
| İstifadəçi favorilərdə məhsul yoxdur | \"Favoriləriniz boşdur\" mesajı göstərilir |
| Admin qiymət faizini dəyişir | Bütün məhsul qiymətləri avtomatik yenilənir |
| İstifadəçi axtarışda nəticə tapmır | \"Nəticə tapılmadı\" mesajı göstərilir |
| Topdancı müştəri qiymətlərini görməyə çalışır | Yalnız topdancı qiymətləri göstərilir |
| WhatsApp sifariş panelində məcburi sahələr boşdur | Xəta mesajı göstərilir, sifariş göndərilmir |
| WhatsApp sifariş panelində telefon formatı yanlışdır | Xəta mesajı göstərilir, düzgün format tələb olunur |
| Supabase bağlantısı kəsilir | Xəta mesajı göstərilir, yenidən cəhd edilir |

## 6. Qəbul Meyarları

1. İstifadəçi ana səhifəni açır
2. Məhsullar səhifəsinə keçir və kateqoriya seçir
3. Məhsul detalına baxır
4. \"WhatsApp ilə sifariş ver\" düyməsinə tıklayır
5. WhatsApp sifariş panelində müştəri məlumatlarını, miqdarı, keyfiyyət növünü və xidmət şərtlərini doldurur
6. \"Sifarişi WhatsApp-a göndər\" düyməsinə tıklayır və sifariş +994776117780 nömrəsinə WhatsApp-a göndərilir

## 7. Bu Mərhələdə Həyata Keçirilməyən Funksiyalar

- Onlayn ödəniş sistemi (kredit kartı, bank köçürməsi)
- Çatdırılma hesablaması və inteqrasiyası
- SMS bildiriş sistemi
- Email bildiriş sistemi
- Məhsul rəyləri və reytinqlər
- Məhsul müqayisəsi
- Wish list paylaşma
- Sosial media ilə giriş (Facebook, Google)
- Çoxvalyutalı dəstək
- Kupon və endirim kod sistemi
- Loyallıq proqramı
- Canlı çat dəstəyi
- Məhsul video dəstəyi
- 360 dərəcə məhsul baxışı
- Məhsul stok xəbərdarlığı
- Toplu məhsul əməliyyatları (kütləvi yükləmə, kütləvi redaktə)
- Çoxsəviyyəli admin rolları
- API dokumentasiyası
- Mobil tətbiq versiyası