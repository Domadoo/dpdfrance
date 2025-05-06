# Changelog

## [6.4.2] - 2025

- Suppression des returns types (dans la gestion des logs) car impossible de gérer les nulls avant PHP8.
- Ajout d'une condition pour éviter de renvoyer null dans les nouvelles fonctions (dans la gestion des logs).
- Correction de la configuration de Datatable (dans la gestion des logs) pour filtrer par date.
- Ajout d'un contrôle de cohérence pour les pays des points relais proposés.
- Évolution du mode export, ajout des retours pour tout type d'expédition.
- Ajout du système de gestion des logs DPD France.
- Évolution et correction de la vérification des configurations de webservice.
- Ajustement, selon le validateur Prestashop, des ressources JS utilisées dans le module.
- Amélioration de l'affichage des options de livraison DPD France.
- Ajout du nouveau message descriptif pour la gestion des retours.
- Amélioration de la compatibilité avec le système de cache APCu.
- Amélioration de la mise à jour automatique des statuts de commandes.
- Ajout du contrôle de cohérence sur les DOM/TOM pour les options de livraison DPD France.
- Amélioration des messages d'erreurs DPD lors de la sélection d'un point relais.

## [6.4.1] - 2024

- Ajout de l'installation & de la configuration selon les contextes multiboutique de Prestashop.
- Ajout de la documentation Google Maps API pour le module.
- Mise à jour de la documentation du module.
- Ajustement, selon le validateur Prestashop, des licences de certains fichiers.
- Ajustement, selon le validateur Prestashop, des ressources Fancybox utilisées dans le module.
- Améliorations et optimisations du mode multiboutique.
- Optimisation des appels aux différents webservices.
- Amélioration de la configuration du module pour les numéros de téléphones.

## [6.4.0] - 2024

- Correction du contrôle de cohérence lors d'une nouvelle recherche de point relais.
- Amélioration des traductions du module.
- Ajout du mode relais export.

## [6.3.2] - 2024

- Améliorations et optimisations du module.
- Renforcement des requêtes ajax, ainsi que l'affichage de la configuration du module.
- Renforcement de la sécurité des ressources du module.

## [6.3.1] - 2024

- Correction de la gestion, tarification, des iles Européennes.

## [6.3.0] - 2024

- Ouverture de la gestion des iles Européennes.
- Ouverture de la gestion du supplément douanier.
- Renforcement de l'identification des commandes marketplace.
- Renforcement des contrôles de cohérence des données Expéditeur.
- Test de connectivité des outils Webservices.
- Ajout et prise en compte des commentaires sur l'étiquette.
- Ajustement des mécaniques d'impression.
- Renforcement de la mécanique d'assemblage d'impressions d'étiquette en Impression en ligne.
- Uniformisation de la gestion des CP étranger pour Impression en ligne.
- Évolution du filtre de recherche multicritère.
- Évolution de la mise à jour automatique des statuts de commandes.
- Évolution des appels à Google Maps.
- Ajustement de la visibilité des relais Pickup en fonction de la gestion Iles et Montagne.
- Ajustement de la compatibilité PHP.
- Correction de la gestion des SMS pour une expédition DPD Pickup en Impression en ligne.
- Optimisation du mode multiboutique.
