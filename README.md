# Shoten - Projet 3WEBD

Il s'agit d'un site web de recherche de livres en utilisant l'api de OpenLibrary.

---

## Installation

1. **Se placer dans le projet**
   ```bash
   cd shoten_project
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

---

## Lancer l'application

```bash
npm run dev
```

Puis ouvrir sur le navigateur **http://localhost:5173**

---

## Lancer les tests

```bash
npm run test
```


---

## Structure du projet

```
src/
├── pages/           # Pages de l'application
│   ├── Home.tsx           # Page d'accueil
│   ├── BookDetail.tsx     # Détails d'un livre
│   ├── Search.tsx         # Résultats de recherche
│   └── AdvancedSearch.tsx # Recherche avancée
├── components/      # Composants réutilisables
│   ├── Navbar.tsx         # Barre de navigation
│   └── QuickSearchBar.tsx # Barre de recherche rapide
├── types/           # Définitions TypeScript
└── tests/           # Tests unitaires
```