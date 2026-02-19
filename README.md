# 📝 Projet Microservices – 2025

---

## 🔹 Description
Plateforme web de gestion de **tournois, équipes et réservations**.  
- Les **administrateurs** peuvent gérer les utilisateurs, les équipes et les tournois.  
- Les **utilisateurs** peuvent consulter et réserver des créneaux, rejoindre des équipes et consulter les résultats.  

Le projet est développé dans le cadre d’un **Projet de Fin d’Études** avec une architecture moderne **microservices** (backend Java & .NET, frontend React SPA).

---

## 🔹 Fonctionnalités

### Administrateur
- Gestion des utilisateurs (ajout, modification, suppression)  
- Gestion des équipes et des tournois  
- Visualisation des réservations et résultats  

### Utilisateur
- Consultation des équipes et tournois disponibles  
- Réservation de créneaux  
- Consultation des scores et historique des tournois  

---

## 🔹 Architecture & Stack Technique
- **Backend Java** : Spring Boot + Maven  
- **Backend .NET** : ASP.NET Core + EF Core  
- **Frontend** : React SPA, Axios pour appels REST  
- **Base de données** : SQL Server / MySQL (une par service)  

**Design Patterns utilisés :**  
- MVC (Model-View-Controller)  
- DAO (Data Access Object)  
- Singleton (pour gestion des services)  
- Factory (création d’entités)  

---

## 🔹 Installation & Lancement

### Backend Java
```bash
cd backend/ReservationService
./mvnw clean install
./mvnw spring-boot:run
```
### Backend .NET
```bash
cd backend/UsersService
dotnet restore
dotnet run
```
### Frontend React
```bash
cd frontend
npm install
npm start
```

### Accéder à l’application :
```
http://localhost:3000
```

## 🔹 Structure du Projet

```
microservices-project/
├── backend/
│   ├── UsersService/           (.NET Core)
│   ├── ReservationService/     (Spring Boot)
│   ├── TeamMatchesService/     (Spring Boot)
│   └── TournoiAPI/             (.NET Core)
├── frontend/                   (React SPA)
├── README.md
└── VD                          (notes et informations diverses)

```

---


## 👥 Auteurs du projet

* M.Kodad Naoufal
* M.Kanba Bilal
* M.GUERROUJ Wail 
* Mme.Wiam Bouhmidi


- **Email** : naoufalkodad@gmail.com  
- **Année** : 2025  

---