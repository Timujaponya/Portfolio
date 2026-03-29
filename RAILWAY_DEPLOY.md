# Railway Deploy Rehberi

Bu proje monorepo olduğu icin Railway tarafinda iki ayri servis olusturmaniz gerekir:
- `backend` (Express API)
- `client` (Vite static preview)

## 1) Backend Servisi

1. Railway'de yeni bir project olustur.
2. `Deploy from GitHub Repo` ile bu repoyu bagla.
3. Servis ayarlarinda `Root Directory` degerini `backend` yap.
4. Environment Variables ekle:
   - `MONGODB_URI` = MongoDB connection string
   - `NODE_ENV` = `production`
   - `CORS_ORIGINS` = `https://<client-servis-domaini>`
     - Birden fazla domain varsa virgulle ayir:
       `https://a.up.railway.app,https://b.up.railway.app`
   - `UPLOAD_DIR` = `/data/uploads`
   - `PUBLIC_BASE_URL` = `https://<backend-domain>`
5. Deploy et.
6. API saglik kontrolu: `https://<backend-domain>/api/health` -> `{ "status": "ok" }`

## 1.1) Backend icin Kalici Dosya (Volume) Ayari

Railway restart veya yeni deploy sonrasinda yuklenen dosyalarin silinmemesi icin backend servisine volume bagla:

1. Backend servisine gir.
2. `Volumes` sekmesine git.
3. `New Volume` olustur.
4. `Mount Path` olarak `/data` gir.
5. Kaydet ve yeniden deploy et.

Bu ayarla backend, uploadlari `/data/uploads` altina yazar ve dosyalar kalici olur.

## 2) Client Servisi

1. Ayni project icinde yeni servis ekle (`Deploy from Repo`).
2. `Root Directory` degerini `client` yap.
3. Environment Variables ekle:
   - `VITE_API_URL` = `https://<backend-domain>/api`
   - `VITE_ADMIN_PASSWORD` = guclu bir sifre
   - `VITE_ADMIN_PATH` = `/ozel-admin-path`
4. Deploy et.

## 3) CORS Son Ayari

Client domain belli olduktan sonra backend servisinde `CORS_ORIGINS` degerini kesin client domain(leri) ile guncelle.

## 4) Domainler

- Railway gecici domainleri: `*.up.railway.app`
- Istersen her iki servise de custom domain baglayabilirsin.

## 5) Onemli Notlar

- `VITE_*` env degerleri frontend bundle icine gomulur. Gizli anahtar koyma.
- Admin sifresini frontend'de tutmak guvenli degildir. Uretimde backend tabanli auth (JWT/session) kullan.
- Bu projede backend icin health endpoint hazir: `/api/health`.
- Upload dosyalari backend servisinde tutulur; client servisine volume baglamaya gerek yoktur.
