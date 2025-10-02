<p align="center">
  <img src="https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/DRF-3.x-red?logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-JWT-green" />
</p>

# Ecoli-Track — Django + React

**Ecoli-Track** es una app web para registrar actividades diarias y estimar la **huella de carbono (CO₂e)** de cada usuario.  
Esta primera entrega incluye **Login/Registro (JWT)**, **CRUD de actividades** y **cálculo automático de CO₂**.

> Objetivo: que el usuario solo indique lo que hizo (km en transporte, minutos en energía, kg en alimentos) y el sistema calcule la huella automáticamente.

---

##  Funcionalidades

-  **Autenticación JWT** (login, refresh), **registro** y **perfil** (ver/editar email, cambiar contraseña, borrar cuenta).
-  **CRUD de Actividades** (transporte, energía, alimentación).
-  **Cálculo automático de CO₂ (kg)** al guardar cada actividad (factores globales).
- **Rutas protegidas** en API y en el frontend.
- (Próximo) Dashboard y tips personalizados.

---

## Arquitectura: MVC distribuido

- **Model (Django ORM)**: `Activity` (estructura de datos y persistencia).
- **Controller (DRF ViewSets/Views + URLs)**: endpoints protegidos, validación de propietario, cálculo de CO₂ antes de guardar.
- **View (React SPA)**: páginas `Login`, `Register`, `Activities`, `Profile` consumen la API.

