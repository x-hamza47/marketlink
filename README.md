<div align="center">

![MediLab Vaccine Management System](public/assets/img/og-image.jpg)

# MediLab: Vaccine Management System

Book vaccines online, track your child's vaccination schedule, and let hospitals manage requests and appointments in one place.

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white)
![Filament](https://img.shields.io/badge/Filament-Panels-FDAE4B)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

[**Live Demo**](https://medilab.infinityfreeapp.com/) · [Portfolio](https://hamzaamir-portfolio.web.app/) · [Report a Bug](https://github.com/x-hamza47/vaccine-management-laravel/issues)

</div>

---

## About

MediLab is a vaccine management system built with Laravel. Parents register, add their children, request vaccines and follow vaccination schedules. Hospitals and admins manage vaccines, schedules and incoming requests from a separate admin panel.

The project started with classic Laravel controllers and Blade dashboards. I later migrated the whole dashboard layer to **Filament** for cleaner resources, built-in tables and forms, and faster admin development. The public landing page is still a Blade site with a full SEO layer.

## Features

- **Two Filament panels:** Admin (`/admin`) and Parent (`/dashboard`)
- Parent registration, login and profile editing
- Child profiles
- Vaccine requests and appointment management
- Vaccination schedules per hospital
- Hospital, vaccine and user management for admins
- Dashboard stats widgets and charts (appointment status, requests, schedules per month)
- SEO-ready landing page: metadata, Open Graph, Schema.org JSON-LD, sitemap and robots rules

## Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Backend    | Laravel 12, PHP 8.2+              |
| Panels     | Filament                          |
| Database   | MySQL                             |
| Frontend   | Blade, Tailwind CSS, Vite         |
| SEO        | Open Graph, Schema.org, sitemap   |

## Getting Started

**Requirements:** PHP 8.2+ with the `intl` extension, Composer, Node.js and npm, MySQL.

```bash
git clone https://github.com/x-hamza47/vaccine-management-laravel.git
cd vaccine-management-laravel

composer install
npm install

cp .env.example .env
php artisan key:generate
```

Set your database in `.env`:

```dotenv
APP_URL=http://localhost:8000
DB_DATABASE=vaccine_management_system
DB_USERNAME=root
DB_PASSWORD=
```

Then:

```bash
php artisan migrate --seed
npm run build
php artisan serve
```

Open http://localhost:8000.

## Panels

| Panel  | URL          | Purpose                                              |
| ------ | ------------ | ---------------------------------------------------- |
| Admin  | `/admin`     | Hospitals, vaccines, schedules, users, requests      |
| Parent | `/dashboard` | Children, vaccine requests, vaccination schedules    |

Admin credentials come from `database/seeders/AdminSeeder.php`. Change them before deploying.

## Deployment on Shared Hosting (no SSH)

Deployed on InfinityFree, which has no SSH, Composer or Node:

1. Run `composer install --no-dev --optimize-autoloader` and `npm run build` locally.
2. Upload the contents of `public/` to `htdocs/`.
3. Upload the rest of the project to `htdocs/laravel/` (without `node_modules`, `.git` or `tests`).
4. In `htdocs/index.php`, point paths to `__DIR__.'/laravel/...'` and add `$app->usePublicPath(__DIR__);` so Vite finds `build/manifest.json`.
5. Block the `laravel/` folder in `htdocs/.htaccess`.
6. Use a production `.env` with `APP_ENV=production`, `APP_DEBUG=false` and `QUEUE_CONNECTION=sync`.
7. Export the local database and import it with phpMyAdmin.

## Project Structure

```
app/
├── Filament/
│   ├── Resources/        Admin resources
│   ├── Parent/           Parent panel pages and widgets
│   └── Widgets/          Admin dashboard widgets
├── Models/               Children, Hospital, User, VaccinationSchedule, Vaccine, VaccineRequest
└── Providers/Filament/   AdminPanelProvider, ParentPanelProvider
resources/views/          Landing page sections and SEO partials
database/                 Migrations, factories, seeders
```

## Author

**Hamza Aamir**, Full Stack Developer

[Portfolio](https://hamzaamir-portfolio.web.app/) · [GitHub](https://github.com/x-hamza47) · [LinkedIn](https://www.linkedin.com/in/hamza-aamir-dev/)
