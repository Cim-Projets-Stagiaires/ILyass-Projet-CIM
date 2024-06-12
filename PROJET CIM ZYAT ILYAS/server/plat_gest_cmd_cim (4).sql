-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 06 juin 2024 à 21:13
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `plat_gest_cmd_cim`
--

-- --------------------------------------------------------

--
-- Structure de la table `centres`
--

CREATE TABLE `centres` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `etablissement` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `centres`
--

INSERT INTO `centres` (`id`, `name`, `etablissement`, `user_id`) VALUES
(1, 'Centre de Mathématiques de L’université Cadi Ayyad', 'FSSM', NULL),
(2, 'Laboratoire Ibn Al Banna de Mathématiques et applications', 'FSSM', NULL),
(3, 'Laboratoire de Mathématiques et Dynamique de Populations', 'FSSM', NULL),
(4, 'Laboratoire de Mathématiques Informatique et Systèmes de communication', 'ENSAS', NULL),
(5, 'Mathématiques, Informatique et Modélisation des Systèmes Complexes', 'ESTE', NULL),
(6, 'Laboratoire de Mathématiques Appliquées et Informatique', 'FST', NULL),
(7, 'Laboratoire de Moélisation des Systèmes Complexes', 'ENSAM', NULL),
(8, 'Laboratoire de Modélisation et Combinatoire', 'FPS', NULL),
(9, 'Centre de Recheche Médicales', 'FMPM', NULL),
(10, 'LABORATOIRE DE RECHERCHE DES MALADIES INFECTIEUSES', 'FMPM', NULL),
(11, 'Laboratoire de Recherche Morpho Sciences', 'FMPM', NULL),
(12, 'Laboratoire BioSciences et Santé', 'FMPM', NULL),
(13, 'Laboratoire de recherche l\'enfance la santé et le développement', 'FMPM', NULL),
(14, 'Laboratoire de Neurosciences Expérimentale, Clinique et de l\'Environnement', 'FMPM', NULL),
(15, 'Recherche Clinique et Epidémologique de la Pathologie Ostéo Articulaire', 'FMPM', NULL),
(16, 'Agrobiotechnologie et Bioingénierie', 'FST', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `ech_aam`
--

CREATE TABLE `ech_aam` (
  `id` int(11) NOT NULL,
  `form_AAM_id` int(11) DEFAULT NULL,
  `nature` enum('aqueux','organique','mélange','autre') NOT NULL,
  `nature_details` varchar(255) DEFAULT NULL,
  `etat` enum('frais','congelés','conservés','déshydratés') NOT NULL,
  `condition_stock` enum('temp ambiante','-20° C') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `ech_aam`
--

INSERT INTO `ech_aam` (`id`, `form_AAM_id`, `nature`, `nature_details`, `etat`, `condition_stock`) VALUES
(15, 9, 'aqueux', NULL, 'frais', 'temp ambiante');

-- --------------------------------------------------------

--
-- Structure de la table `ech_pic`
--

CREATE TABLE `ech_pic` (
  `id` int(11) NOT NULL,
  `form_PIC_id` int(11) DEFAULT NULL,
  `nature` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `temp` int(11) DEFAULT NULL,
  `coord` varchar(255) DEFAULT NULL,
  `conductivité` float DEFAULT NULL,
  `ph` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ech_pic`
--

INSERT INTO `ech_pic` (`id`, `form_PIC_id`, `nature`, `date`, `temp`, `coord`, `conductivité`, `ph`) VALUES
(2, 2, 'fsaf', '2024-05-22', 55, 'fafzf', 55, 5),
(3, 2, 'fsaf', '2024-05-09', 13, 'FZFZ', 331, 2),
(4, 2, 'SFAF', '2024-05-07', 42, 'FZF', 323, 434);

-- --------------------------------------------------------

--
-- Structure de la table `ech_rdmo`
--

CREATE TABLE `ech_rdmo` (
  `id` int(11) NOT NULL,
  `form_RDMO_id` int(11) DEFAULT NULL,
  `nature` enum('Eau','Sol','Plante','Autres') DEFAULT NULL,
  `nature_details` varchar(255) DEFAULT NULL,
  `etat` enum('Frais','Congelés','Conservés','Déshydratés') DEFAULT NULL,
  `condition_stock` enum('temp ambiante','-20° C') DEFAULT NULL,
  `analyses` set('dfmat 30','dgt 22','dct 37','dcf 44','dgat 55','dga 37','dfl 30','dlm 25','dei 37','dsi 37','dm','dasr 46','rcp','rb','rsscp','recbgp','recoh','rilpa20','rispa20','rippa20','rilpal') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ech_rdmo`
--

INSERT INTO `ech_rdmo` (`id`, `form_RDMO_id`, `nature`, `nature_details`, `etat`, `condition_stock`, `analyses`) VALUES
(13, 11, 'Autres', 'tft', 'Conservés', 'temp ambiante', 'dcf 44,dei 37,rcp'),
(14, 12, 'Autres', 'FZFDFZ', 'Congelés', 'temp ambiante', 'dct 37,dlm 25,dei 37');

-- --------------------------------------------------------

--
-- Structure de la table `equipes`
--

CREATE TABLE `equipes` (
  `id` int(11) NOT NULL,
  `etablissement` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `equipes`
--

INSERT INTO `equipes` (`id`, `etablissement`, `name`, `user_id`) VALUES
(1, 'FPS', 'Représentations Culturelles et Modes de Pensées', NULL),
(2, 'FPS', 'Equipe Environnement et Santé', NULL),
(3, 'ENSAM', 'SMARTE Systèmes et Applications', NULL),
(4, 'ENSAS', 'Equipe Signaux Aléatoires, Réseaux et Systèmes', NULL),
(5, 'FPS', 'Géomorphologie, Environnement et Gestion du Littoral', NULL),
(6, 'ENSAM', 'Equipe de Technologie de l\'Information et Modélisation', NULL),
(7, 'FST', 'Equipe Contrôle et Informatique pour les Systèmes Intelligents et Energie Verte', NULL),
(8, 'FSJES', 'Groupe de Recherche de Géopolitique et Stratégie Globales', NULL),
(9, 'FST', 'Géométrie, Analyse Stochastique et Applications', NULL),
(10, 'FSSM', 'Equipe de Recherche en Analyse Mathématiques et Applications', NULL),
(11, 'FSSM', 'Equipe d’Automatique, Systèmes Intelligents et Systèmes d’Information', NULL),
(12, 'FSSM', 'Instrumentation, Signaux et Système Physiques', NULL),
(13, 'FPS', 'Gouvernance des territoires et des sociétés', NULL),
(14, 'FPS', 'Langage, Cognition, Culture et Communication', NULL),
(15, 'FSSM', 'Transdisciplinaire de recherche en Innovation Educative', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `form`
--

CREATE TABLE `form` (
  `id` int(11) NOT NULL,
  `date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `nbr_ech` int(11) NOT NULL,
  `nbr_rep` int(11) NOT NULL,
  `nature` varchar(255) NOT NULL,
  `molecule` enum('ADN','ARN','Proteine','Autre') NOT NULL,
  `molecule_precise` varchar(255) DEFAULT NULL,
  `toxicite` enum('Toxiques','Non toxiques') NOT NULL,
  `conditions_stock` text NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT 'Demande reçue',
  `recup` varchar(255) DEFAULT 'non',
  `structure_id` int(11) DEFAULT NULL,
  `actes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `form`
--

INSERT INTO `form` (`id`, `date`, `name`, `type`, `nbr_ech`, `nbr_rep`, `nature`, `molecule`, `molecule_precise`, `toxicite`, `conditions_stock`, `prix`, `user_id`, `status`, `recup`, `structure_id`, `actes`) VALUES
(16, '2024-04-24 11:27:01', 'update', 'equipes', 3, 3, 'aaaaa', 'Proteine', 'bbbbb', 'Toxiques', 'C', 1550.00, 1, 'Demande reçue', 'oui', 70, 'Spectrophotometre d\'absorption atomique, Physico chimie des aliments'),
(17, '2024-04-24 11:27:47', 'ACTES TEST', 'centres', 3, 3, 'aaaaa', 'Autre', 'edit', 'Toxiques', 'C', 3725.00, 1, 'Demande reçue', 'oui', 83, 'Spectrophotometre d\'absorption atomique, Spectrophotometre a UV, Physico chimie de l\'eau, Physico chimie des aliments, Calorimetrie');

-- --------------------------------------------------------

--
-- Structure de la table `form_aam`
--

CREATE TABLE `form_aam` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `mtd_sld` enum('Méthode des spots','Méthode des puits','Méthode des disques') DEFAULT NULL,
  `act_sld` set('Présence ou Absence d''activité','Détérmination de la CMI','Détérmination de la CMB') DEFAULT NULL,
  `mtd_lqd` enum('Méthode des puits','Méthode NNP') DEFAULT NULL,
  `act_lqd` set('Présence ou Absence d''activité','Détérmination de la CMI','Détérmination de la CMB') DEFAULT NULL,
  `germes` set('Bactéries à gram positif','Bactéries à gram négatif','levures','champignons','autres') DEFAULT NULL,
  `autres_details` varchar(255) DEFAULT NULL,
  `validation` enum('oui','non') DEFAULT NULL,
  `validation_details` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `form_aam`
--

INSERT INTO `form_aam` (`id`, `submission_id`, `code`, `mtd_sld`, `act_sld`, `mtd_lqd`, `act_lqd`, `germes`, `autres_details`, `validation`, `validation_details`) VALUES
(9, 36, '24-AAM-01', 'Méthode des spots', 'Présence ou Absence d\'activité', 'Méthode des puits', 'Présence ou Absence d\'activité', 'levures,autres', 'TFT', 'oui', 'INKSHIT');

-- --------------------------------------------------------

--
-- Structure de la table `form_amct`
--

CREATE TABLE `form_amct` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `nbr_ech` int(11) DEFAULT NULL CHECK (`nbr_ech` <= 10),
  `nature` varchar(255) DEFAULT NULL,
  `toxicite` enum('Toxiques','Non toxiques','Radioactifs') DEFAULT NULL,
  `etat_ech` enum('Solide','Liquide') DEFAULT NULL,
  `temperature` varchar(255) DEFAULT NULL,
  `ref_ech_1` varchar(255) DEFAULT NULL,
  `ref_ech_2` varchar(255) DEFAULT NULL,
  `ref_ech_3` varchar(255) DEFAULT NULL,
  `ref_ech_4` varchar(255) DEFAULT NULL,
  `ref_ech_5` varchar(255) DEFAULT NULL,
  `ref_ech_6` varchar(255) DEFAULT NULL,
  `ref_ech_7` varchar(255) DEFAULT NULL,
  `ref_ech_8` varchar(255) DEFAULT NULL,
  `ref_ech_9` varchar(255) DEFAULT NULL,
  `ref_ech_10` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `form_amct`
--

INSERT INTO `form_amct` (`id`, `submission_id`, `code`, `nbr_ech`, `nature`, `toxicite`, `etat_ech`, `temperature`, `ref_ech_1`, `ref_ech_2`, `ref_ech_3`, `ref_ech_4`, `ref_ech_5`, `ref_ech_6`, `ref_ech_7`, `ref_ech_8`, `ref_ech_9`, `ref_ech_10`) VALUES
(4, 34, '24-AMCT-01', 3, 'aaaaa', 'Non toxiques', 'Solide', '22', 'FZFZ', 'FZFZF', 'FZFZ', '', '', '', '', '', '', ''),
(5, 35, '24-AMCT-02', 5, '2', NULL, 'Solide', '50', 'fsefsf', 'fzefzdrfz', 'fzefsdfez', 'A', '5', '', '', '', '', ''),
(6, 73, '24-AMCT-03', 10, 'sang', 'Radioactifs', 'Solide', '50', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'),
(7, 78, '24-AMCT-04', 2, '2', 'Non toxiques', 'Solide', '5', '555', '55', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Structure de la table `form_azs`
--

CREATE TABLE `form_azs` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `nbr_ech` int(11) DEFAULT NULL CHECK (`nbr_ech` <= 4),
  `nbr_rep` int(11) DEFAULT 0,
  `nature` varchar(255) DEFAULT NULL,
  `solvant` varchar(255) DEFAULT NULL,
  `toxicite` enum('Toxiques','Non toxiques','Radioactifs') DEFAULT NULL,
  `type` enum('Potentiel Zeta','Distribution des tailles des particules') DEFAULT NULL,
  `ref_ech_1` varchar(255) DEFAULT NULL,
  `ref_ech_2` varchar(255) DEFAULT NULL,
  `ref_ech_3` varchar(255) DEFAULT NULL,
  `ref_ech_4` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `form_azs`
--

INSERT INTO `form_azs` (`id`, `submission_id`, `code`, `nbr_ech`, `nbr_rep`, `nature`, `solvant`, `toxicite`, `type`, `ref_ech_1`, `ref_ech_2`, `ref_ech_3`, `ref_ech_4`) VALUES
(1, 1, '24-AZS-01', 4, 1, 'aaaaa', 'fzefsfsef', 'Non toxiques', 'Distribution des tailles des particules', 'fsefsf', 'fzefzdrfz', 'fzefsdfez', 'fzefzdfze'),
(2, 6, '24-AZS-02', 4, 2, 'aaaaa', 'fzefsfsef', 'Toxiques', 'Potentiel Zeta', 'aaaa', 'aaaa', 'aaa', 'aaa'),
(3, 7, '24-AZS-03', 4, 1, 'aaaaa', 'fzefsfsef', 'Toxiques', 'Potentiel Zeta', 'fsefsf', 'fzefzdrfz', 'fzefsdfez', 'AAA'),
(12, 33, '24-AZS-05', 3, 2, 'aaaaa', 'fzefsfsef', 'Non toxiques', 'Distribution des tailles des particules', 'FZF', 'FSFSF', 'FSFS', ''),
(14, 72, '24-AZS-06', 4, 2, 'sang', 'FAFAF', 'Non toxiques', 'Potentiel Zeta', 'fafsef', 'fefzvsf', 'zfzdcz', 'fzefdfzf'),
(15, 77, '24-AZS-07', 4, 2, 'sang', 'DAZDAD', 'Toxiques', 'Potentiel Zeta', '1', '2', '3', '4'),
(16, 81, '24-AZS-08', 2, 10, 'azer', 'dfaf', 'Toxiques', 'Potentiel Zeta', '1', '2', '', '');

-- --------------------------------------------------------

--
-- Structure de la table `form_chnso`
--

CREATE TABLE `form_chnso` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `type` enum('Qualitative','Quantitative') NOT NULL,
  `nbr_ech` int(11) NOT NULL,
  `nbr_rep` int(11) NOT NULL,
  `nature` enum('Sols et Sédiments','Polymères','Plantes','Produits pharmaceutiques','Produits cosmétiques','Produits pétrochimiques','Colles vernis','autre') NOT NULL,
  `Toxicité` enum('Toxiques','Non Toxiques','Radioactifs') NOT NULL,
  `ref_ech_1` varchar(255) DEFAULT NULL,
  `ref_ech_2` varchar(255) DEFAULT NULL,
  `ref_ech_3` varchar(255) DEFAULT NULL,
  `ref_ech_4` varchar(255) DEFAULT NULL,
  `ref_ech_5` varchar(255) DEFAULT NULL,
  `ref_ech_6` varchar(255) DEFAULT NULL,
  `ref_ech_7` varchar(255) DEFAULT NULL,
  `ref_ech_8` varchar(255) DEFAULT NULL,
  `ref_ech_9` varchar(255) DEFAULT NULL,
  `ref_ech_10` varchar(255) DEFAULT NULL,
  `config` enum('chns','o') NOT NULL,
  `elm` varchar(255) DEFAULT NULL,
  `details_nature` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `form_chnso`
--

INSERT INTO `form_chnso` (`id`, `submission_id`, `code`, `type`, `nbr_ech`, `nbr_rep`, `nature`, `Toxicité`, `ref_ech_1`, `ref_ech_2`, `ref_ech_3`, `ref_ech_4`, `ref_ech_5`, `ref_ech_6`, `ref_ech_7`, `ref_ech_8`, `ref_ech_9`, `ref_ech_10`, `config`, `elm`, `details_nature`) VALUES
(2, 53, '24-CHNSO-01', 'Quantitative', 10, 5, 'autre', 'Non Toxiques', 'aa', 'aa', 'aa', 'aa', 'aa', 'aaa', 'aa', 'aa', 'aa', 'aa', 'o', 'aaa', 'ddd'),
(3, 74, '24-CHNSO-02', 'Qualitative', 10, 2, 'autre', 'Toxiques', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'chns', 'tedt', 'autre tested');

-- --------------------------------------------------------

--
-- Structure de la table `form_pic`
--

CREATE TABLE `form_pic` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `nbr_ech` int(11) DEFAULT NULL,
  `Toxicité` enum('Toxiques','Non Toxiques','Radioactifs') DEFAULT NULL,
  `desc` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `form_pic`
--

INSERT INTO `form_pic` (`id`, `submission_id`, `code`, `nbr_ech`, `Toxicité`, `desc`) VALUES
(2, 67, '24-PICARRO-01', 3, 'Non Toxiques', 'CHI HAJAYES');

-- --------------------------------------------------------

--
-- Structure de la table `form_rdmo`
--

CREATE TABLE `form_rdmo` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `form_rdmo`
--

INSERT INTO `form_rdmo` (`id`, `submission_id`, `code`) VALUES
(11, 50, '24-RDMO-01'),
(12, 65, '24-RDMO-02');

-- --------------------------------------------------------

--
-- Structure de la table `form_saa`
--

CREATE TABLE `form_saa` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `type` enum('Qualitative','Quantitative') DEFAULT NULL,
  `system` enum('Flamme','Four') DEFAULT NULL,
  `nbr_ech` int(11) DEFAULT NULL,
  `nbr_rep` int(11) DEFAULT NULL,
  `nature` enum('Sols et Sédiments','Roches','Plantes','Boisson','Rejets','Mer et milieu marin','autre') DEFAULT NULL,
  `Toxicité` enum('Toxiques','Non Toxiques','Radioactifs') DEFAULT NULL,
  `ref_ech_1` varchar(255) DEFAULT NULL,
  `ref_ech_2` varchar(255) DEFAULT NULL,
  `ref_ech_3` varchar(255) DEFAULT NULL,
  `ref_ech_4` varchar(255) DEFAULT NULL,
  `ref_ech_5` varchar(255) DEFAULT NULL,
  `ref_ech_6` varchar(255) DEFAULT NULL,
  `ref_ech_7` varchar(255) DEFAULT NULL,
  `ref_ech_8` varchar(255) DEFAULT NULL,
  `ref_ech_9` varchar(255) DEFAULT NULL,
  `ref_ech_10` varchar(255) DEFAULT NULL,
  `mtd_prep` text DEFAULT NULL,
  `elm` varchar(255) DEFAULT NULL,
  `details_nature` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `form_saa`
--

INSERT INTO `form_saa` (`id`, `submission_id`, `code`, `type`, `system`, `nbr_ech`, `nbr_rep`, `nature`, `Toxicité`, `ref_ech_1`, `ref_ech_2`, `ref_ech_3`, `ref_ech_4`, `ref_ech_5`, `ref_ech_6`, `ref_ech_7`, `ref_ech_8`, `ref_ech_9`, `ref_ech_10`, `mtd_prep`, `elm`, `details_nature`) VALUES
(1, 54, '24-SAA-01', 'Qualitative', 'Flamme', 10, 5, 'autre', 'Toxiques', 'fff', 'ff', 'ff', 'ff', 'ff', 'ff', 'ff', 'ff', 'ff', 'fff', 'test', 'tedt', 'test'),
(2, 75, '24-SAA-02', 'Quantitative', 'Flamme', 10, 5, 'autre', 'Radioactifs', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Sous l\'application du T.C.E.C.H (Test de Contrôle et évaluation du comportement humain)et du suivit des sergent d\'entrainement. Le soldat devra obligatoirement passer sous les divers sessions de formation militaire. La discipline devra être plus juste, la compétence physique ou mentale devra être plus juste.', 'CLL-2571, CLL-2571,CLL-2571', 'autre tested'),
(3, 76, '24-SAA-03', 'Qualitative', 'Flamme', 10, 5, 'autre', 'Toxiques', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'GHDFZEKJHZJGFZEKJG', '1 2 3 4 5', 'TEST'),
(4, 80, '24-SAA-04', 'Qualitative', 'Flamme', 2, 2, 'autre', 'Toxiques', '1', '2', '', '', '', '', '', '', '', '', 'ergef', 'beger', 'hhhh');

-- --------------------------------------------------------

--
-- Structure de la table `form_toc`
--

CREATE TABLE `form_toc` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `nom` enum('TC','IC','TOC') DEFAULT NULL,
  `type` enum('Qualitative','Quantitative') DEFAULT NULL,
  `nbr_ech` int(11) DEFAULT NULL,
  `nbr_rep` int(11) DEFAULT NULL,
  `nature` enum('Sols et Sédiments','Roches','Plantes','Boisson','Rejets','Mer et milieu marin','autre') DEFAULT NULL,
  `details_autre` varchar(255) DEFAULT NULL,
  `conditionnement` varchar(255) DEFAULT NULL,
  `conductivité` decimal(10,2) DEFAULT NULL,
  `Toxicité` enum('Toxiques','Non Toxiques','Radioactifs') DEFAULT NULL,
  `ref_ech_1` varchar(255) DEFAULT NULL,
  `ref_ech_2` varchar(255) DEFAULT NULL,
  `ref_ech_3` varchar(255) DEFAULT NULL,
  `ref_ech_4` varchar(255) DEFAULT NULL,
  `ref_ech_5` varchar(255) DEFAULT NULL,
  `ref_ech_6` varchar(255) DEFAULT NULL,
  `ref_ech_7` varchar(255) DEFAULT NULL,
  `ref_ech_8` varchar(255) DEFAULT NULL,
  `ref_ech_9` varchar(255) DEFAULT NULL,
  `ref_ech_10` varchar(255) DEFAULT NULL,
  `mtd_prep` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `form_toc`
--

INSERT INTO `form_toc` (`id`, `submission_id`, `code`, `nom`, `type`, `nbr_ech`, `nbr_rep`, `nature`, `details_autre`, `conditionnement`, `conductivité`, `Toxicité`, `ref_ech_1`, `ref_ech_2`, `ref_ech_3`, `ref_ech_4`, `ref_ech_5`, `ref_ech_6`, `ref_ech_7`, `ref_ech_8`, `ref_ech_9`, `ref_ech_10`, `mtd_prep`) VALUES
(1, 64, '24-TOC-01', 'TOC', 'Quantitative', 10, 5, 'autre', 'tested autre', 'filktre', 5000.00, 'Non Toxiques', 'aa', 'aa', 'aa', 'aa', 'aa', 'fvdz', 'wxc<', 'fcf', 'vzv', 'zv', 'zdvsfez');

-- --------------------------------------------------------

--
-- Structure de la table `form_uhplc`
--

CREATE TABLE `form_uhplc` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `type` enum('Qualitative','Quantitative') DEFAULT NULL,
  `nature` varchar(255) DEFAULT NULL,
  `molécules` varchar(255) DEFAULT NULL,
  `Toxicité` enum('Toxiques','Non Toxiques','Radioactifs') DEFAULT NULL,
  `nbr_ech` int(11) DEFAULT NULL,
  `nbr_rep` int(11) DEFAULT NULL,
  `solubles` enum('oui','non') DEFAULT NULL,
  `slv_a` varchar(255) DEFAULT NULL,
  `slv_b` varchar(255) DEFAULT NULL,
  `debit` decimal(10,2) DEFAULT NULL,
  `lgr_onde` decimal(10,2) DEFAULT NULL,
  `volume` decimal(10,2) DEFAULT NULL,
  `temp_ech` decimal(10,2) DEFAULT NULL,
  `temp_cln` decimal(10,2) DEFAULT NULL,
  `gradient` enum('iso','ramp','multi') DEFAULT NULL,
  `ref_ech_1` varchar(255) DEFAULT NULL,
  `ref_ech_2` varchar(255) DEFAULT NULL,
  `ref_ech_3` varchar(255) DEFAULT NULL,
  `ref_ech_4` varchar(255) DEFAULT NULL,
  `ref_ech_5` varchar(255) DEFAULT NULL,
  `ref_ech_6` varchar(255) DEFAULT NULL,
  `ref_ech_7` varchar(255) DEFAULT NULL,
  `ref_ech_8` varchar(255) DEFAULT NULL,
  `ref_ech_9` varchar(255) DEFAULT NULL,
  `ref_ech_10` varchar(255) DEFAULT NULL,
  `ref_ech_11` varchar(255) DEFAULT NULL,
  `ref_ech_12` varchar(255) DEFAULT NULL,
  `ref_ech_13` varchar(255) DEFAULT NULL,
  `ref_ech_14` varchar(255) DEFAULT NULL,
  `ref_ech_15` varchar(255) DEFAULT NULL,
  `ref_ech_16` varchar(255) DEFAULT NULL,
  `ref_ech_17` varchar(255) DEFAULT NULL,
  `ref_ech_18` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `form_uhplc`
--

INSERT INTO `form_uhplc` (`id`, `submission_id`, `code`, `type`, `nature`, `molécules`, `Toxicité`, `nbr_ech`, `nbr_rep`, `solubles`, `slv_a`, `slv_b`, `debit`, `lgr_onde`, `volume`, `temp_ech`, `temp_cln`, `gradient`, `ref_ech_1`, `ref_ech_2`, `ref_ech_3`, `ref_ech_4`, `ref_ech_5`, `ref_ech_6`, `ref_ech_7`, `ref_ech_8`, `ref_ech_9`, `ref_ech_10`, `ref_ech_11`, `ref_ech_12`, `ref_ech_13`, `ref_ech_14`, `ref_ech_15`, `ref_ech_16`, `ref_ech_17`, `ref_ech_18`) VALUES
(1, 70, '24-UHPLC-01', 'Qualitative', 'FSVSE', 'gzg', 'Non Toxiques', 3, 2, 'oui', 'EFSF', 'FESFSF', 43.00, 44.00, 4.00, 4.00, 4.00, 'ramp', 'FZDFS', 'VESVSV', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Structure de la table `form_uv`
--

CREATE TABLE `form_uv` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `nbr_ech` int(11) DEFAULT NULL,
  `nbr_rep` int(11) DEFAULT NULL,
  `nature` varchar(255) DEFAULT NULL,
  `etat` enum('Liquide','Solide') DEFAULT NULL,
  `Toxicité` enum('Toxiques','Non Toxiques','Radioactifs') DEFAULT NULL,
  `cond_alys` set('Absorbance','Spectre') DEFAULT NULL,
  `ref_ech_1` varchar(255) DEFAULT NULL,
  `ref_ech_2` varchar(255) DEFAULT NULL,
  `ref_ech_3` varchar(255) DEFAULT NULL,
  `ref_ech_4` varchar(255) DEFAULT NULL,
  `ref_ech_5` varchar(255) DEFAULT NULL,
  `ref_ech_6` varchar(255) DEFAULT NULL,
  `ref_ech_7` varchar(255) DEFAULT NULL,
  `ref_ech_8` varchar(255) DEFAULT NULL,
  `ref_ech_9` varchar(255) DEFAULT NULL,
  `ref_ech_10` varchar(255) DEFAULT NULL,
  `ref_ech_11` varchar(255) DEFAULT NULL,
  `ref_ech_12` varchar(255) DEFAULT NULL,
  `ref_ech_13` varchar(255) DEFAULT NULL,
  `ref_ech_14` varchar(255) DEFAULT NULL,
  `ref_ech_15` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `form_uv`
--

INSERT INTO `form_uv` (`id`, `submission_id`, `code`, `nbr_ech`, `nbr_rep`, `nature`, `etat`, `Toxicité`, `cond_alys`, `ref_ech_1`, `ref_ech_2`, `ref_ech_3`, `ref_ech_4`, `ref_ech_5`, `ref_ech_6`, `ref_ech_7`, `ref_ech_8`, `ref_ech_9`, `ref_ech_10`, `ref_ech_11`, `ref_ech_12`, `ref_ech_13`, `ref_ech_14`, `ref_ech_15`) VALUES
(1, 59, '24-UV-01', 15, 100, 'sang', 'Liquide', 'Toxiques', 'Absorbance,Spectre', 'f', 'ff', 'f', 'f', 'f', 'ff', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f'),
(2, 60, '24-UV-02', 2, 100, 'test', 'Solide', 'Radioactifs', 'Absorbance', 'ff', 'ff', '', '', '', '', '', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Structure de la table `labs`
--

CREATE TABLE `labs` (
  `name` varchar(255) NOT NULL,
  `etablissement` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `labs`
--

INSERT INTO `labs` (`name`, `etablissement`, `user_id`, `id`) VALUES
('Laboratoire de Recherches en Gestion des organisations', 'ENCG', NULL, 1),
('Laboratoire Interdisciplinaire de Recherche en didactique, Education et Formation', 'ENS', NULL, 2),
('Laboratoire Interdisciplinaire de Recherche en Bio-ressources, Environnement et Matériaux, «LIRBEM»', 'ENS', NULL, 3),
('Laboratoire Ingénierie des Systèmes & Applications', 'ENSAM', NULL, 4),
('Laboratoire Matériaux, Procédés, Environnement et Qualité', 'ENSAS', NULL, 5),
('Sciences Appliquées à l\'Environnement et au Développement Durable', 'ESTE', NULL, 6),
('Laboratoire des Process, Signaux, Systèmes Industriels, Informatique', 'ESTS', NULL, 7),
('تكامل المناهج في تحليل الخطاب', 'FLAM', NULL, 8),
('Laboratoire de recherche en Linguistique et Referentiels culturels \n مختبر البحث في اللسانبات و انساق الثقافات', 'FLAM', NULL, 9),
('مختبر اللغة و النص', 'FLAM', NULL, 10),
('Laboratoire de Géomorphologie, Environnement & Société ', 'FLSH', NULL, 11),
('Laboratoire de Philosophie et Société du Savoir', 'FLSH', NULL, 12),
('Laboratoire des Sciences sociales et transformations sociétales', 'FLSH', NULL, 13),
('Translation, Intercultural Communication and Knowledge Integration \nالترجمة والتواصل بين الثقافات وتكامل المعارف', 'FLSH', NULL, 14),
('Laboratoire des Etudes sur les Ressources, Mobilité et Attractivité ', 'FLSH', NULL, 15),
('Laboratoire Langue Identité Médias Patrimoine Culture Tourisme ', 'FLSH', NULL, 16),
('Le Maroc et le bassin occidental de la Méditerranée ( Histoire, patrimoine, ressources ).', 'FLSH', NULL, 17),
('مختبر الدراسات والبحوث الفقهية وقضايا الهجرة والأقليات\n\"Laboratoire d\'études de jurisprudence et de recherche\n et de questions de migration et de minorités\n', 'FLSH', NULL, 18),
('مختبر تحليل الخطاب وأنساق المعارف\nDiscourse Analysis and Knowledge Systems Laboratory', 'FLSH', NULL, 19),
('Langue, Communication, Pédagogie- Développement', 'FLSH', NULL, 20),
('Laboratoire de Physique fondamentale et appliquée ', 'FPS', NULL, 21),
('Laboratoire de Chimie Analytique et Moléculaire', 'FPS', NULL, 22),
('Laboratoire Interdisciplinaire de Recherches et d’Etudes en Management des organisations et Droit de l’entreprise ', 'FSJES', NULL, 23),
('Laboratoire fédératif QUALIMAT – GRTE- DROIT-SOCIETE', 'FSJES', NULL, 24),
('Laboratoire de recherche en politique pénale et droit comparé\nمختبر البحث في السياسة الجناىية و القانون المقارن', 'FSJES', NULL, 25),
('Laboratoire de recherche en Innovation, responsabilités et Développement Durable ', 'FSJES', NULL, 26),
('Laboratoire NOUVELLES PRATIQUES DE GESTION', 'FSJES', NULL, 27),
('Laboratoire de Recherche en Economie de l\'Energie, Environnement er Ressources', 'FSJES', NULL, 28),
('Laboratoire de Recherche en Economie Sociale et Solidaire, Gouvernance et Développement ', 'FSJES', NULL, 29),
('مختبر الدراسات القانونية المدنية والعقارية', 'FSJES', NULL, 30),
('Laboratoire des Etudes Constitutionnelles et d\'Analyse des Crises et des Politiques', 'FSJES', NULL, 31),
('مختبر الدراسات و الابحاث الجناىية و الادارية', 'FSJES', NULL, 32),
('Laboratoire de recherche juridiques et d\'analyse des politiques', 'FSJES', NULL, 33),
('Laboratoire de recherche sur la coopération internationale pour le développement', 'FSJES', NULL, 34),
('Laboratoire de Physique des Hautes Énergies et Astrophysique', 'FSSM', NULL, 35),
('Laboratoire d’Ingénierie des Systèmes Informatiques', 'FSSM', NULL, 36),
('Laboratoire de Géosciences Semlalia', 'FSSM', NULL, 37),
('Laboratoire de Biotechnologies Microbiennes, Agrosciences et Environnement', 'FSSM', NULL, 38),
('Laboratoire de Mécanique des Fluides et d’Energétique', 'FSSM', NULL, 39),
('Laboratoire Matériaux, Energie et Environnement', 'FSSM', NULL, 40),
('Laboratoire de Chimie Appliquée et Biomasse', 'FSSM', NULL, 41),
('Dynamique de la Lithosphère et Genèse de Ressources', 'FSSM', NULL, 42),
('Laboratoire  (Eau, Biodiversité  et Changement Climatique', 'FSSM', NULL, 43),
('Géosciences, Géotourisme, Risques Naturels et Télédétection', 'FSSM', NULL, 44),
('Laboratoire des Sciences des Matériaux et Optimisation des Procédés', 'FSSM', NULL, 45),
('Agro-Alimentaire, Biotechnologies et Valorisation des Bioressources Végétales', 'FSSM', NULL, 46),
('Laboratoire de Pharmacologie, Neurobiologie, Anthropobiologie et Environnement', 'FSSM', NULL, 47),
('Laboratoire de Chimie Moléculaire', 'FSSM', NULL, 48),
('Laboratoire d’Ingénierie Informatique et Systèmes', 'FST', NULL, 49),
('Laboratoire de Géoressources,Géoenvironnement et Génie civil', 'FST', NULL, 50),
('Laboratoire des Systémes électriques, efficacité energetique et télécommunications - (LSEEET)', 'FST', NULL, 51),
('Laboratoire Matériaux innovants, Énergie et développement durable', 'FST', NULL, 52),
('Laboratoire des Procédés pour l\'Energie Durable et l\'Environnement ProcEDE', 'FST', NULL, 53),
('Laboratoire Bioressources et Sécurité Sanitaire des Aliments', 'FST', NULL, 54),
('Laboratoire de Recherche en Développement Durable et Santé', 'FST', NULL, 55),
('Laboratoire de Didactique et de Pédagogie Universitaire', 'FSSM', NULL, 56);

-- --------------------------------------------------------

--
-- Structure de la table `structure`
--

CREATE TABLE `structure` (
  `id` int(11) NOT NULL,
  `type` enum('labs','equipes','centres') NOT NULL,
  `name` varchar(255) NOT NULL,
  `etablissement` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `structure`
--

INSERT INTO `structure` (`id`, `type`, `name`, `etablissement`, `user_id`) VALUES
(1, 'labs', 'Laboratoire de Recherches en Gestion des organisations', 'ENCG', NULL),
(2, 'labs', 'Laboratoire Interdisciplinaire de Recherche en didactique, Education et Formation', 'ENS', NULL),
(3, 'labs', 'Laboratoire Interdisciplinaire de Recherche en Bio-ressources, Environnement et Matériaux', 'ENS', NULL),
(4, 'labs', 'Laboratoire Ingénierie des Systèmes & Applications', 'ENSAM', NULL),
(5, 'labs', 'Laboratoire Matériaux, Procédés, Environnement et Qualité', 'ENSAS', NULL),
(6, 'labs', 'Sciences Appliquées à l\'Environnement et au Développement Durable', 'ESTE', NULL),
(7, 'labs', 'Laboratoire des Process, Signaux, Systèmes Industriels, Informatique', 'ESTS', NULL),
(8, 'labs', 'تكامل المناهج في تحليل الخطاب', 'FLAM', NULL),
(9, 'labs', 'Laboratoire de recherche en Linguistique et Referentiels culturels', 'FLAM', NULL),
(10, 'labs', 'مختبر اللغة و النص', 'FLAM', NULL),
(11, 'labs', 'Laboratoire de Géomorphologie, Environnement & Société ', 'FLSH', NULL),
(12, 'labs', 'Laboratoire de Philosophie et Société du Savoir', 'FLSH', NULL),
(13, 'labs', 'Laboratoire des Sciences sociales et transformations sociétales', 'FLSH', NULL),
(14, 'labs', 'Translation, Intercultural Communication and Knowledge Integration \nالترجمة والتواصل بين الثقافات وتكامل المعارف', 'FLSH', NULL),
(15, 'labs', 'Laboratoire des Etudes sur les Ressources, Mobilité et Attractivité ', 'FLSH', NULL),
(16, 'labs', 'Laboratoire Langue Identité Médias Patrimoine Culture Tourisme ', 'FLSH', NULL),
(17, 'labs', 'Le Maroc et le bassin occidental de la Méditerranée ( Histoire, patrimoine, ressources ).', 'FLSH', NULL),
(18, 'labs', 'Laboratoire d\'études de jurisprudence et de recherche\r\n et de questions de migration et de minorités\r\n', 'FLSH', NULL),
(19, 'labs', 'مختبر تحليل الخطاب وأنساق المعارف\nDiscourse Analysis and Knowledge Systems Laboratory', 'FLSH', NULL),
(20, 'labs', 'Langue, Communication, Pédagogie- Développement', 'FLSH', NULL),
(21, 'labs', 'Laboratoire de Physique fondamentale et appliquée ', 'FPS', NULL),
(22, 'labs', 'Laboratoire de Chimie Analytique et Moléculaire', 'FPS', NULL),
(23, 'labs', 'Laboratoire Interdisciplinaire de Recherches et d’Etudes en Management des organisations et Droit de l’entreprise ', 'FSJES', NULL),
(24, 'labs', 'Laboratoire fédératif QUALIMAT – GRTE- DROIT-SOCIETE', 'FSJES', NULL),
(25, 'labs', 'Laboratoire de recherche en politique pénale et droit comparé\nمختبر البحث في السياسة الجناىية و القانون المقارن', 'FSJES', NULL),
(26, 'labs', 'Laboratoire de recherche en Innovation, responsabilités et Développement Durable ', 'FSJES', NULL),
(27, 'labs', 'Laboratoire NOUVELLES PRATIQUES DE GESTION', 'FSJES', NULL),
(28, 'labs', 'Laboratoire de Recherche en Economie de l\'Energie, Environnement er Ressources', 'FSJES', NULL),
(29, 'labs', 'Laboratoire de Recherche en Economie Sociale et Solidaire, Gouvernance et Développement ', 'FSJES', NULL),
(30, 'labs', 'مختبر الدراسات القانونية المدنية والعقارية', 'FSJES', NULL),
(31, 'labs', 'Laboratoire des Etudes Constitutionnelles et d\'Analyse des Crises et des Politiques', 'FSJES', NULL),
(32, 'labs', 'مختبر الدراسات و الابحاث الجناىية و الادارية', 'FSJES', NULL),
(33, 'labs', 'Laboratoire de recherche juridiques et d\'analyse des politiques', 'FSJES', NULL),
(34, 'labs', 'Laboratoire de recherche sur la coopération internationale pour le développement', 'FSJES', NULL),
(35, 'labs', 'Laboratoire de Physique des Hautes Énergies et Astrophysique', 'FSSM', NULL),
(36, 'labs', 'Laboratoire d’Ingénierie des Systèmes Informatiques', 'FSSM', NULL),
(37, 'labs', 'Laboratoire de Géosciences Semlalia', 'FSSM', NULL),
(38, 'labs', 'Laboratoire de Biotechnologies Microbiennes, Agrosciences et Environnement', 'FSSM', NULL),
(39, 'labs', 'Laboratoire de Mécanique des Fluides et d’Energétique', 'FSSM', NULL),
(40, 'labs', 'Laboratoire Matériaux, Energie et Environnement', 'FSSM', NULL),
(41, 'labs', 'Laboratoire de Chimie Appliquée et Biomasse', 'FSSM', NULL),
(42, 'labs', 'Dynamique de la Lithosphère et Genèse de Ressources', 'FSSM', NULL),
(43, 'labs', 'Laboratoire  (Eau, Biodiversité  et Changement Climatique', 'FSSM', NULL),
(44, 'labs', 'Géosciences, Géotourisme, Risques Naturels et Télédétection', 'FSSM', NULL),
(45, 'labs', 'Laboratoire des Sciences des Matériaux et Optimisation des Procédés', 'FSSM', NULL),
(46, 'labs', 'Agro-Alimentaire, Biotechnologies et Valorisation des Bioressources Végétales', 'FSSM', NULL),
(47, 'labs', 'Laboratoire de Pharmacologie, Neurobiologie, Anthropobiologie et Environnement', 'FSSM', NULL),
(48, 'labs', 'Laboratoire de Chimie Moléculaire', 'FSSM', NULL),
(49, 'labs', 'Laboratoire d’Ingénierie Informatique et Systèmes', 'FST', NULL),
(50, 'labs', 'Laboratoire de Géoressources,Géoenvironnement et Génie civil', 'FST', NULL),
(51, 'labs', 'Laboratoire des Systémes électriques, efficacité energetique et télécommunications', 'FST', NULL),
(52, 'labs', 'Laboratoire Matériaux innovants, Énergie et développement durable', 'FST', NULL),
(53, 'labs', 'Laboratoire des Procédés pour l\'Energie Durable et l\'Environnement ProcEDE', 'FST', NULL),
(54, 'labs', 'Laboratoire Bioressources et Sécurité Sanitaire des Aliments', 'FST', NULL),
(55, 'labs', 'Laboratoire de Recherche en Développement Durable et Santé', 'FST', NULL),
(56, 'labs', 'Laboratoire de Didactique et de Pédagogie Universitaire', 'FSSM', NULL),
(64, 'equipes', 'Représentations Culturelles et Modes de Pensées', 'FPS', NULL),
(65, 'equipes', 'Equipe Environnement et Santé', 'FPS', NULL),
(66, 'equipes', 'SMARTE Systèmes et Applications', 'ENSAM', NULL),
(67, 'equipes', 'Equipe Signaux Aléatoires, Réseaux et Systèmes', 'ENSAS', NULL),
(68, 'equipes', 'Géomorphologie, Environnement et Gestion du Littoral', 'FPS', NULL),
(69, 'equipes', 'Equipe de Technologie de l\'Information et Modélisation', 'ENSAM', NULL),
(70, 'equipes', 'Equipe Contrôle et Informatique pour les Systèmes Intelligents et Energie Verte', 'FST', NULL),
(71, 'equipes', 'Groupe de Recherche de Géopolitique et Stratégie Globales', 'FSJES', NULL),
(72, 'equipes', 'Géométrie, Analyse Stochastique et Applications', 'FST', NULL),
(73, 'equipes', 'Equipe de Recherche en Analyse Mathématiques et Applications', 'FSSM', NULL),
(74, 'equipes', 'Equipe d’Automatique, Systèmes Intelligents et Systèmes d’Information', 'FSSM', NULL),
(75, 'equipes', 'Instrumentation, Signaux et Système Physiques', 'FSSM', NULL),
(76, 'equipes', 'Gouvernance des territoires et des sociétés', 'FPS', NULL),
(77, 'equipes', 'Langage, Cognition, Culture et Communication', 'FPS', NULL),
(78, 'equipes', 'Transdisciplinaire de recherche en Innovation Educative', 'FSSM', NULL),
(79, 'centres', 'Centre de Mathématiques de L’université Cadi Ayyad', 'FSSM', NULL),
(80, 'centres', 'Laboratoire Ibn Al Banna de Mathématiques et applications', 'FSSM', NULL),
(81, 'centres', 'Laboratoire de Mathématiques et Dynamique de Populations', 'FSSM', NULL),
(82, 'centres', 'Laboratoire de Mathématiques Informatique et Systèmes de communication', 'ENSAS', NULL),
(83, 'centres', 'Mathématiques, Informatique et Modélisation des Systèmes Complexes', 'ESTE', NULL),
(84, 'centres', 'Laboratoire de Mathématiques Appliquées et Informatique', 'FST', NULL),
(85, 'centres', 'Laboratoire de Moélisation des Systèmes Complexes', 'ENSAM', NULL),
(86, 'centres', 'Laboratoire de Modélisation et Combinatoire', 'FPS', NULL),
(87, 'centres', 'Centre de Recheche Médicales', 'FMPM', NULL),
(88, 'centres', 'LABORATOIRE DE RECHERCHE DES MALADIES INFECTIEUSES', 'FMPM', NULL),
(89, 'centres', 'Laboratoire de Recherche Morpho Sciences', 'FMPM', NULL),
(90, 'centres', 'Laboratoire BioSciences et Santé', 'FMPM', NULL),
(91, 'centres', 'Laboratoire de recherche l\'enfance la santé et le développement', 'FMPM', NULL),
(92, 'centres', 'Laboratoire de Neurosciences Expérimentale, Clinique et de l\'Environnement', 'FMPM', NULL),
(93, 'centres', 'Recherche Clinique et Epidémologique de la Pathologie Ostéo Articulaire', 'FMPM', NULL),
(94, 'centres', 'Agrobiotechnologie et Bioingénierie', 'FST', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `submission`
--

CREATE TABLE `submission` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `form_name` varchar(255) DEFAULT NULL,
  `date_de_creation` timestamp NULL DEFAULT NULL,
  `date_de_modif` timestamp NULL DEFAULT NULL,
  `date_d_analyse` timestamp NULL DEFAULT NULL,
  `date_de_resultat` timestamp NULL DEFAULT NULL,
  `conditions_stock` text DEFAULT NULL,
  `recup` enum('oui','non') DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Demande déposée',
  `prix` decimal(10,2) DEFAULT NULL,
  `partiel` varchar(255) DEFAULT NULL,
  `final` varchar(255) DEFAULT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `rubrique_mod` text DEFAULT NULL,
  `encadrant_id` int(11) DEFAULT NULL,
  `date_approuved` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `submission`
--

INSERT INTO `submission` (`id`, `user_id`, `form_name`, `date_de_creation`, `date_de_modif`, `date_d_analyse`, `date_de_resultat`, `conditions_stock`, `recup`, `status`, `prix`, `partiel`, `final`, `signature`, `rubrique_mod`, `encadrant_id`, `date_approuved`) VALUES
(1, 18, 'form_AZS', '2024-05-14 14:23:48', NULL, NULL, NULL, '1', 'oui', 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 18, 'form_AZS', '2024-05-14 20:37:23', NULL, NULL, NULL, 'aaa', 'oui', 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 18, 'form_AZS', '2024-05-14 20:52:07', NULL, NULL, NULL, 'AAA', 'oui', 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 1, 'form_AZS', '2024-05-16 21:42:17', NULL, NULL, NULL, 'FSFSF', 'oui', 'Demande reçue', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 1, 'form_AMCT', '2024-05-16 21:42:36', NULL, NULL, NULL, 'FZFZ', 'non', 'Demande refusée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 17, 'form_AMCT', '2024-05-16 21:56:09', NULL, NULL, NULL, '5', 'oui', 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 1, 'form_AAM', '2024-05-17 13:24:22', NULL, NULL, NULL, NULL, NULL, 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(50, 1, 'form_RDMO', '2024-05-19 17:17:12', NULL, NULL, NULL, NULL, NULL, 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, 1, 'form_CHNSO', '2024-05-20 11:38:46', NULL, NULL, NULL, 'aa', 'oui', 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(54, 1, 'form_SAA', '2024-05-21 19:17:28', NULL, NULL, NULL, 'test', 'oui', 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(59, 1, 'form_UV', '2024-05-21 19:56:58', NULL, NULL, NULL, 'aafadf', 'oui', 'Demande reçue', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(60, 1, 'form_UV', '2024-05-21 19:57:30', NULL, NULL, NULL, 'ff', 'oui', 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(64, 1, 'form_TOC', '2024-05-22 10:38:09', NULL, NULL, NULL, 'vzv', 'oui', 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(65, 1, 'form_RDMO', '2024-05-22 12:11:32', NULL, NULL, NULL, NULL, NULL, 'Demande annulée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(67, 1, 'form_PIC', '2024-05-22 12:26:39', NULL, NULL, NULL, 'YES', 'oui', 'Demande reçue', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(70, 1, 'form_UHPLC', '2024-05-23 19:43:02', NULL, NULL, NULL, 'VSEVS', 'oui', 'Demande reçue', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(72, 26, 'form_AZS', '2024-05-25 19:21:45', NULL, NULL, NULL, ' l\'application du T.C.E.C.H (Test de Contrôle et évaluation du comportement humain)et du suivit des sergent d\'entrainement. Le soldat devra obligatoirement passer sous les divers sessions de formation militaire. La discipline devra être plus juste, la compétence physique ou mentale devra être plus juste. ', 'oui', 'Demande approuvée', NULL, 'partiel-1717498743778.pdf', NULL, NULL, NULL, NULL, '2024-06-06 11:57:30'),
(73, 26, 'form_AMCT', '2024-05-25 20:04:43', NULL, NULL, NULL, 'Sous l\'application du T.C.E.C.H (Test de Contrôle et évaluation du comportement humain)et du suivit des sergent d\'entrainement. Le soldat devra obligatoirement passer sous les divers sessions de formation militaire. La discipline devra être plus juste, la compétence physique ou mentale devra être plus juste.', 'oui', 'Demande annulée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(74, 26, 'form_CHNSO', '2024-05-25 21:07:43', NULL, NULL, NULL, 'Sous l\'application du T.C.E.C.H (Test de Contrôle et évaluation du comportement humain)et du suivit des sergent d\'entrainement. Le soldat devra obligatoirement passer sous les divers sessions de formation militaire. La discipline devra être plus juste, la compétence physique ou mentale devra être plus juste.', 'oui', 'Demande annulée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(75, 26, 'form_SAA', '2024-05-26 14:11:00', '2024-06-04 20:34:35', NULL, NULL, 'Sous l\'application du T.C.E.C.H (Test de Contrôle et évaluation du comportement humain)et du suivit des sergent d\'entrainement. Le soldat devra obligatoirement passer sous les divers sessions de formation militaire. La discipline devra être plus juste, la compétence physique ou mentale devra être plus juste.', 'oui', 'Demande reçue', NULL, NULL, NULL, '/images/signatures/signature-1717533649419-698485893.jpg', NULL, NULL, NULL),
(76, 29, 'form_SAA', '2024-05-27 13:00:45', NULL, NULL, NULL, 'TEST FFD', 'oui', 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(77, 31, 'form_AZS', '2024-06-01 17:13:51', NULL, NULL, NULL, 'ehebeshgfhsrt', 'oui', 'Résultat final', NULL, 'partiel-1717332717302.pdf', 'final-1717332694282.pdf', NULL, NULL, NULL, '2024-06-06 11:58:15'),
(78, 31, 'form_AMCT', '2024-06-03 14:05:50', NULL, NULL, NULL, '72742', 'oui', 'Résultat partiel', NULL, 'partiel-1717426495614.pdf', NULL, NULL, NULL, NULL, '2024-06-06 11:58:09'),
(80, 27, 'form_SAA', '2024-06-03 17:33:43', NULL, NULL, NULL, 'berbvehreh', 'oui', 'Demande déposée', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(81, 40, 'form_AZS', '2024-06-05 19:38:50', NULL, NULL, NULL, 'test', 'oui', 'Clôturé', NULL, 'partiel-1717617121512.pdf', 'final-1717617171997.pdf', NULL, NULL, NULL, '2024-06-06 11:58:01');

-- --------------------------------------------------------

--
-- Structure de la table `temp_uhplc`
--

CREATE TABLE `temp_uhplc` (
  `id` int(11) NOT NULL,
  `form_UHPLC_id` int(11) DEFAULT NULL,
  `temps` varchar(255) DEFAULT NULL,
  `B` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `temp_uhplc`
--

INSERT INTO `temp_uhplc` (`id`, `form_UHPLC_id`, `temps`, `B`) VALUES
(1, 1, 'SEF', 33.00),
(2, 1, 'VSEVS', 3.00);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `access` int(11) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `structure_id` int(11) DEFAULT NULL,
  `status` enum('Enseignant chercheur','Etudiant') DEFAULT NULL,
  `niveau` enum('License','Master','Doctorat') DEFAULT NULL,
  `picture` varchar(255) DEFAULT '/public/images/profile/default-profile.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `access`, `phone`, `structure_id`, `status`, `niveau`, `picture`) VALUES
(1, 'test edit', 'test@gmail.com', '$2b$10$UZLHnVgfbftqkkx7AYDv5eN7tPEko30oOw8K5PvR2En3ieKdbY1Zm', 1, '0663771981', 66, 'Enseignant chercheur', NULL, '/images/profile/profilePic-1715942201506-552100634.png'),
(3, 'ilyas', 'letexte2001@gmail.com', '$2b$10$ngK2kEl23ZxRxwxxBzBd4OHLYveHQw//aCbTwX9W/Txl4EyDrKa2K', 100, NULL, NULL, NULL, NULL, '/images/profile/default-profile.jpg'),
(15, 'compte', 'compte@gmail.com', '$2b$10$6VFBmdRxZHZt1CHKr0bXJORc/Txj/A2GXfsMmP4ILfz47wHz.4w4.', 1, NULL, NULL, NULL, NULL, '/images/profile/default-profile.jpg'),
(17, 'test', 'tes2@gmail.com', '$2b$10$jLLYz3JEJsHJUeJOkzo6IuNbpTYQn7NxVg4.drgm53vJopFmAQGx2', 1, '0123456789', 87, 'Enseignant chercheur', NULL, '/images/profile/default-profile.jpg'),
(18, 'hasbulah', 'etudiant@gmail.com', '$2b$10$kP8aFGYXzoyO/o3TRB8d9OD.bUJDAJDC.hPD89BSnGRMcmt5EhA/.', 1, '0663771980', 4, 'Enseignant chercheur', NULL, '/images/profile/profilePic-1715168496810-648664858.png'),
(19, 'testaeaeae', 'tesadadat@gmail.com', '$2b$10$7XqpOJDuuZbpUUi5B1Q.qOZsQ03KLd5A8i/.wC7Oe8I5J8NIKN9E.', 1, '0123456789', 66, 'Etudiant', 'License', '/images/profile/default-profile.jpg'),
(21, 'testfefzf', 'tesffffft@gmail.com', '$2b$10$8xIqEmXTfKVwKY9x7LHwku.3dLdYsdTfG1Yyl3F7QXJqxpPeAXwoi', 1, '0663771984', 4, 'Etudiant', 'License', '/images/profile/default-profile.jpg'),
(23, 'bnadm', 'etudiant2@gmail.com', '$2b$10$CgPA.spJlJvjSK9tPRuBK.XYAStwEOclL6dp/d9x8quQ2akkvHvOq', 1, '0663771987', 6, 'Enseignant chercheur', NULL, '/images/profile/default-profile.jpg'),
(25, 'test', 'tesfzfdzfzt@gmail.com', '$2b$10$i.8DDPoQs2VkkAI.CH.9C.pY13a8SkVB9vtT0q2cwpyD41kuWAikG', 1, '0000663771980', 5, 'Enseignant chercheur', NULL, '/images/profile/default-profile.jpg'),
(26, 'user etudiant', 'user@gmail.com', '$2b$10$79qSDuev03iMhKtlM6T2zusNPlqBoC.fAcaTsGsJuZZOmNHK1f2/W', 1, '0663771987', 66, 'Etudiant', 'Master', '/images/profile/default-profile.jpg'),
(27, 'Hakim Ziyech', 'resp_lab@gmail.com', '$2b$10$Om4kWdwtn0IvKSb5iM79WuMX7uVbzdnID07Zq4sW4J5mlM5dA47qC', 5, '0663771985', 66, 'Enseignant chercheur', NULL, '/images/profile/profilePic-1716812881700-305514167.png'),
(28, 'usertest', 'user2@gmail.com', '$2b$10$.YuuLPIh.f5rPof80bsRZOxDiB/mgUBYQIJk3B668v7f3evmycNrO', 1, '0663771985', 66, 'Etudiant', 'Doctorat', '/images/profile/default-profile.jpg'),
(29, 'user MODIFEE', 'user3@gmail.com', '$2b$10$yCcNqQTMXQVfMqKPxkyyWudC7190hVzigp1md8UOhmWpQfHkc3lhO', 1, '0663771944', 9, 'Enseignant chercheur', NULL, '/images/profile/profilePic-1716814543469-272876512.png'),
(30, 'ACM RESP', 'acm@gmail.com', '$2b$10$SpG9LHHL14KS7z3b/d1xgezebqc6JsQxf1s3Io2zlIyGv3pjTSm7.', 10, '0663771911', NULL, '', NULL, '/images/profile/default-profile.jpg'),
(31, 'ali', 'ali@gmail.com', '$2b$10$CX/P7caEwwf/kL5QPvsNNuH7AV1JJcFT1fEQEvGwwiMImm.F0fFHi', 1, '0663771982', 66, 'Enseignant chercheur', NULL, '/images/profile/default-profile.jpg'),
(32, 'admin', 'admin@gmail.com', '$2b$10$ZEH0aXLHre2K48V5tDd30uT9e7IDe3vydaTy9hygNTTYGjofERi1O', 100, '0663771444', NULL, '', NULL, '/images/profile/default-profile.jpg'),
(33, 'encadrant rssp', 'endrt1@gmail.com', '$2b$10$TvQSCRwToiB0gdvziRra9eXWE/JHMUTG7Nn9fjq8L8XfaM.8lX7Wm', 4, '0663771444', 66, 'Enseignant chercheur', NULL, '/images/profile/default-profile.jpg'),
(34, 'encadrant 2', 'endrt2@gmail.com', '$2b$10$BbdKj2h69653uR0A0NuWQeu5JfeD8ILOICH8HW8uC3c3UmzDe5Aem', 4, '0663771444', 66, 'Enseignant chercheur', NULL, '/images/profile/default-profile.jpg'),
(40, 'khalid', 'khalid@gmail.com', '$2b$10$UeiTTmD7smkHNfbrcAN3PORBwE004xm/swCoMsVYVSTSlnN8.Ta02', 100, '0663771980', 66, 'Enseignant chercheur', NULL, '/images/profile/profilePic-1717615607811-26328345.jpg'),
(41, 'user created', 'letexte2017@gmail.com', '$2b$10$GSCcO9jWi2E99lP3FdJWk.VlRIoSQfzpcI5gaT/wgm9AaFd3zB8uy', 5, NULL, NULL, NULL, NULL, '/images/profile/default-profile.jpg');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `centres`
--
ALTER TABLE `centres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `ech_aam`
--
ALTER TABLE `ech_aam`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ech_aam_ibfk_1` (`form_AAM_id`);

--
-- Index pour la table `ech_pic`
--
ALTER TABLE `ech_pic`
  ADD PRIMARY KEY (`id`),
  ADD KEY `form_PIC_id` (`form_PIC_id`);

--
-- Index pour la table `ech_rdmo`
--
ALTER TABLE `ech_rdmo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `form_RDMO_id` (`form_RDMO_id`);

--
-- Index pour la table `equipes`
--
ALTER TABLE `equipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `form`
--
ALTER TABLE `form`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_structure_id` (`structure_id`);

--
-- Index pour la table `form_aam`
--
ALTER TABLE `form_aam`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_submission_id_form_aam` (`submission_id`);

--
-- Index pour la table `form_amct`
--
ALTER TABLE `form_amct`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_submission_id_new` (`submission_id`);

--
-- Index pour la table `form_azs`
--
ALTER TABLE `form_azs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_submission_id` (`submission_id`);

--
-- Index pour la table `form_chnso`
--
ALTER TABLE `form_chnso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Index pour la table `form_pic`
--
ALTER TABLE `form_pic`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Index pour la table `form_rdmo`
--
ALTER TABLE `form_rdmo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Index pour la table `form_saa`
--
ALTER TABLE `form_saa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Index pour la table `form_toc`
--
ALTER TABLE `form_toc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Index pour la table `form_uhplc`
--
ALTER TABLE `form_uhplc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Index pour la table `form_uv`
--
ALTER TABLE `form_uv`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Index pour la table `labs`
--
ALTER TABLE `labs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `structure`
--
ALTER TABLE `structure`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `submission`
--
ALTER TABLE `submission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `temp_uhplc`
--
ALTER TABLE `temp_uhplc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `form_UHPLC_id` (`form_UHPLC_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `centres`
--
ALTER TABLE `centres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `ech_aam`
--
ALTER TABLE `ech_aam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `ech_pic`
--
ALTER TABLE `ech_pic`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `ech_rdmo`
--
ALTER TABLE `ech_rdmo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `equipes`
--
ALTER TABLE `equipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `form`
--
ALTER TABLE `form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `form_aam`
--
ALTER TABLE `form_aam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `form_amct`
--
ALTER TABLE `form_amct`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `form_azs`
--
ALTER TABLE `form_azs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `form_chnso`
--
ALTER TABLE `form_chnso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `form_pic`
--
ALTER TABLE `form_pic`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `form_rdmo`
--
ALTER TABLE `form_rdmo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `form_saa`
--
ALTER TABLE `form_saa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `form_toc`
--
ALTER TABLE `form_toc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `form_uhplc`
--
ALTER TABLE `form_uhplc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `form_uv`
--
ALTER TABLE `form_uv`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `labs`
--
ALTER TABLE `labs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT pour la table `structure`
--
ALTER TABLE `structure`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT pour la table `submission`
--
ALTER TABLE `submission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT pour la table `temp_uhplc`
--
ALTER TABLE `temp_uhplc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `centres`
--
ALTER TABLE `centres`
  ADD CONSTRAINT `centres_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `ech_aam`
--
ALTER TABLE `ech_aam`
  ADD CONSTRAINT `ech_aam_ibfk_1` FOREIGN KEY (`form_AAM_id`) REFERENCES `form_aam` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_form_aam_id_ech_aam` FOREIGN KEY (`form_AAM_id`) REFERENCES `form_aam` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ech_pic`
--
ALTER TABLE `ech_pic`
  ADD CONSTRAINT `ech_pic_ibfk_1` FOREIGN KEY (`form_PIC_id`) REFERENCES `form_pic` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ech_rdmo`
--
ALTER TABLE `ech_rdmo`
  ADD CONSTRAINT `ech_rdmo_ibfk_1` FOREIGN KEY (`form_RDMO_id`) REFERENCES `form_rdmo` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `equipes`
--
ALTER TABLE `equipes`
  ADD CONSTRAINT `equipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `form`
--
ALTER TABLE `form`
  ADD CONSTRAINT `fk_structure_id` FOREIGN KEY (`structure_id`) REFERENCES `structure` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `form_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `form_aam`
--
ALTER TABLE `form_aam`
  ADD CONSTRAINT `fk_submission_id_form_aam` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `form_aam_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`);

--
-- Contraintes pour la table `form_amct`
--
ALTER TABLE `form_amct`
  ADD CONSTRAINT `fk_submission_id_new` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `form_amct_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`);

--
-- Contraintes pour la table `form_azs`
--
ALTER TABLE `form_azs`
  ADD CONSTRAINT `fk_submission_id` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `form_azs_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`);

--
-- Contraintes pour la table `form_chnso`
--
ALTER TABLE `form_chnso`
  ADD CONSTRAINT `form_chnso_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `form_pic`
--
ALTER TABLE `form_pic`
  ADD CONSTRAINT `form_pic_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `form_rdmo`
--
ALTER TABLE `form_rdmo`
  ADD CONSTRAINT `form_rdmo_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `form_saa`
--
ALTER TABLE `form_saa`
  ADD CONSTRAINT `form_saa_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `form_toc`
--
ALTER TABLE `form_toc`
  ADD CONSTRAINT `form_toc_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `form_uhplc`
--
ALTER TABLE `form_uhplc`
  ADD CONSTRAINT `form_uhplc_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `form_uv`
--
ALTER TABLE `form_uv`
  ADD CONSTRAINT `form_uv_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `labs`
--
ALTER TABLE `labs`
  ADD CONSTRAINT `labs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `structure`
--
ALTER TABLE `structure`
  ADD CONSTRAINT `structure_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `submission`
--
ALTER TABLE `submission`
  ADD CONSTRAINT `submission_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `temp_uhplc`
--
ALTER TABLE `temp_uhplc`
  ADD CONSTRAINT `temp_uhplc_ibfk_1` FOREIGN KEY (`form_UHPLC_id`) REFERENCES `form_uhplc` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
