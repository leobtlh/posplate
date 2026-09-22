# Posplate (Le Strava de la Food)

Posplate est une application web/mobile (PWA) de type réseau social, pensée comme le "Strava de la nourriture".
Elle combine une expérience de découverte immersive façon TikTok avec des outils puissants de planification de repas et d'optimisation budgétaire (spécifique à la Suisse avec les prix Coop et Migros).

## Le Concept

Fini de scroller sans fin en se demandant ce qu'on va manger ce soir.
Sur Posplate, les utilisateurs font défiler des vidéos et photos de plats. Lorsqu'un plat leur donne envie, ils cliquent sur **"Make it mine"** pour l'ajouter à leur planning de la semaine ou le cuisiner immédiatement, avec un calcul en temps réel du coût des ingrédients dans leur supermarché local.

## Fonctionnalités Principales

* **Feed Immersif (Style TikTok) :** Défilement vertical de vidéos et photos de plats en plein écran.

* **Filtres Avancés :** Triez le feed selon vos besoins stricts : budget max (CHF), objectif calorique, protéines spécifiques, régimes (Végétarien, Vegan, Sans Gluten, etc.).

* **Tarification Suisse en Temps Réel :** Affichage du prix réel des ingrédients chez **Coop et Migros** (le moins cher est mis en avant), avec calcul du coût total et par portion.

* **"Make it mine" (Planification) :** Ajoutez instantanément une recette à votre calendrier de la semaine, ou passez en mode "cuisine immédiate".

* **Publication Simplifiée & Assistée par IA :** Postez une photo/vidéo. Plutôt que d'écrire une longue description, listez les ingrédients en langage naturel (ex: "riz, mangue, poulet"). Notre IA (Claude) structure automatiquement la recette, les quantités et associe les ingrédients à la base de données des prix.

* **Profil Utilisateur :** Retrouvez vos publications ("Mes plats"), vos likes, vos favoris sauvegardés et paramétrez vos allergies/budgets habituels.

## Stack Technique

L'application est construite sur une architecture moderne, pensée pour le mobile en priorité :

* **Frontend :** Next.js (App Router) + TypeScript

* **Styling :** Tailwind CSS (Interface épurée, grandes images, animations fluides)

* **Backend & Base de données :** Supabase (PostgreSQL, Authentification, Storage pour les images/vidéos)

* **Paiements :** Stripe (Gestion de l'abonnement Premium en CHF)

* **Intelligence Artificielle :** API Anthropic (Claude) pour le parsing des recettes publiées

* **Hébergement :** Vercel

## Modèle Économique (Freemium)

* **Gratuit :** Accès illimité au feed, utilisation des filtres basiques, mais consultation complète limitée à **1 recette par semaine**.

* **Premium (Abonnement Stripe) :** Recettes en illimité, utilisation de l'assistant IA de publication en illimité, et accès aux filtres de recherche avancés.

## Architecture et Développement

Le développement est planifié selon les étapes suivantes (basées sur le document de spécifications) :

1. **Base de données & MVP :** Mise en place du schéma Supabase (ingrédients, prix, utilisateurs) et injection d'un jeu de 30 recettes suisses d'exemple.

2. **Interface Principale :** Développement du feed vertical (swipe/scroll), de la page détaillée de recette, et du moteur de recherche par filtres.

3. **Moteur de Prix :** Création de l'interface d'abstraction pour le calcul des prix (Coop vs Migros).

4. **Authentification & Profil :** Espace personnel (likes, favoris, "Make it mine").

5. **Système de Publication :** Intégration de l'API Anthropic pour l'assistant de création de recettes par les utilisateurs.

6. **Monétisation :** Intégration de Stripe pour bloquer/débloquer la limite gratuite.

7. **Scale :** Script d'import de masse et système de mise à jour quotidienne des prix.

## Installation et Déploiement en Local

*(Les instructions de démarrage classiques seront ajoutées ici une fois le dépôt initialisé : `npm install`, configuration des variables d'environnement `.env.local` pour Supabase, Stripe et Anthropic, puis `npm run dev`)*