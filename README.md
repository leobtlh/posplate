# Posplate (Le Strava de la Food)

Posplate est une **application mobile native (iOS & Android)** de type réseau social, pensée comme le "Strava de la nourriture".
Elle combine une expérience de découverte immersive façon TikTok avec des outils puissants de planification de repas et d'optimisation budgétaire (spécifique à la Suisse avec les prix Coop et Migros).

## Le Concept

Fini de scroller sans fin en se demandant ce qu'on va manger ce soir.
Sur Posplate, les utilisateurs font défiler des vidéos et photos de plats. Lorsqu'un plat leur donne envie, ils cliquent sur **"Make it mine"** pour l'ajouter à leur planning de la semaine ou le cuisiner immédiatement, avec un calcul en temps réel du coût des ingrédients dans leur supermarché local.

Chaque vidéo ou photo peut recevoir des **"mines"** — une alternative aux likes classiques. Plus un créateur accumule de mines, plus il est rémunéré.

## Fonctionnalités Principales

* **Feed Immersif (Style TikTok) :** Défilement vertical de vidéos et photos de plats en plein écran.

* **Filtres Avancés :** Triez le feed selon vos besoins stricts : budget max (CHF), objectif calorique, protéines spécifiques, régimes (Végétarien, Vegan, Sans Gluten, etc.).

* **Tarification Suisse en Temps Réel :** Affichage du prix réel des ingrédients chez **Coop et Migros** (le moins cher est mis en avant), avec calcul du coût total et par portion.

* **"Make it mine" & Planification de Repas (inspiré de Bonap) :** Vue planning hebdomadaire avec glisser-déposer, navigation jour par jour, et option **foyer** pour référencer les membres de votre famille. Planifiez pour chaque personne selon ses goûts, allergies et objectifs. Le calendrier génère automatiquement la liste de courses du foyer.

* **Publication Simplifiée & Assistée par IA :** Postez une photo/vidéo. Plutôt que d'écrire une longue description, listez les ingrédients en langage naturel (ex: "riz, mangue, poulet"). Notre IA (Claude) structure automatiquement la recette, les quantités et associe les ingrédients à la base de données des prix.

* **Mines & Rémunération des Créateurs :** Chaque vidéo/photo peut recevoir des **"mines"** de la part des utilisateurs. Contrairement aux likes classiques, les mines mesurent l'impact culinaire d'un plat. Plus un créateur accumule de mines, plus il est valorisé et rémunéré (système de rewarding basé sur le nombre total de mines).

* **Profil Utilisateur :** Retrouvez vos publications ("Mes plats"), vos mines reçues, vos favoris sauvegardés, vos membres de foyer et paramétrez vos allergies/budgets habituels.

## Stack Technique

L'application est construite sur une architecture moderne, pensée pour le mobile en priorité :

* **Frontend :** Next.js (App Router) + TypeScript

* **Styling :** Tailwind CSS (Interface épurée, grandes images, animations fluides)

* **Couleurs (Charte Graphique) :**
  | Rôle | Hex |
  |---|---|
  | Fond / Surfaces | `#FFFFFF` |
  | Vert clair (accent principal) | `#CBF863` |
  | Vert moyen (CTA, interactions) | `#8FC809` |
  | Vert pâle (fond secondaire) | `#DAFA8F` |

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

4. **Authentification & Profil :** Espace personnel (mines, favoris, foyer, "Make it mine").

5. **Système de Publication :** Intégration de l'API Anthropic pour l'assistant de création de recettes par les utilisateurs.

6. **Monétisation :** Intégration de Stripe pour bloquer/débloquer la limite gratuite.

7. **Scale :** Script d'import de masse et système de mise à jour quotidienne des prix.

## Installation et Déploiement en Local

*(Les instructions de démarrage classiques seront ajoutées ici une fois le dépôt initialisé : `npm install`, configuration des variables d'environnement `.env.local` pour Supabase, Stripe et Anthropic, puis `npm run dev`)*

## Licence

Posplate est un projet propriétaire. Tous droits réservés — voir le fichier [LICENSE](./LICENSE).