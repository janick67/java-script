-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 20 Sie 2019, 18:08
-- Wersja serwera: 10.3.16-MariaDB
-- Wersja PHP: 7.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `wydatki`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `columns`
--

CREATE TABLE `columns` (
  `col_id` int(11) NOT NULL,
  `col_name` varchar(30) NOT NULL,
  `col_json` varchar(2047) NOT NULL,
  `col_userId` int(11) DEFAULT NULL,
  `col_createdDate` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `columns`
--

INSERT INTO `columns` (`col_id`, `col_name`, `col_json`, `col_userId`, `col_createdDate`) VALUES
(1, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":true,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powi?zane\",\"show\":false,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":false,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-07-28'),
(13, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":false,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powi?zane\",\"show\":false,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":false,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-07-31'),
(14, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":true,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powi?zane\",\"show\":false,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":false,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-07-31'),
(15, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":true,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-07-31'),
(16, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":true,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-07-31'),
(17, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":true,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-07-31'),
(18, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":true,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-07-31'),
(19, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":true,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-07-31'),
(20, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":false,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-07-31'),
(21, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":false,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":false,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-08-01'),
(22, 'szablon', '[{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":false,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-08-01'),
(23, 'szablon', '[{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Bank\",\"show\":false,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-08-01'),
(24, 'szablon', '[{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Bank\",\"show\":false,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"}]', 3, '2019-08-01'),
(25, 'szablon', '[{\"name\":\"Bank\",\"show\":false,\"fieldInSql\":\"bank\",\"priority\":\"3\"},{\"name\":\"Kwota\",\"show\":true,\"fieldInSql\":\"kwota\",\"priority\":\"1\"},{\"name\":\"Data\",\"show\":true,\"fieldInSql\":\"data\",\"priority\":\"2\"},{\"name\":\"Typ2\",\"show\":true,\"fieldInSql\":\"typ2\",\"priority\":\"3\"},{\"name\":\"Id\",\"show\":false,\"fieldInSql\":\"id\",\"priority\":\"0\"},{\"name\":\"Osoba\",\"show\":true,\"fieldInSql\":\"osoba\",\"priority\":\"0\"},{\"name\":\"Gdzie\",\"show\":true,\"fieldInSql\":\"gdzie\",\"priority\":\"4\"},{\"name\":\"Kogo\",\"show\":true,\"fieldInSql\":\"kogo\",\"priority\":\"4\"},{\"name\":\"Powiazane\",\"show\":true,\"fieldInSql\":\"powiazane\",\"priority\":\"0\"},{\"name\":\"Opis\",\"show\":true,\"fieldInSql\":\"opis\",\"priority\":\"4\"},{\"name\":\"Typ\",\"show\":true,\"fieldInSql\":\"typ\",\"priority\":\"2\"}]', 3, '2019-08-05');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('7ab7cbde-e8f6-41df-ac27-077045ef7839', 1566328083, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":3}}');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `creationdate` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `creationdate`) VALUES
(1, 'test', 'test@test.com', 'password', '2019-07-27'),
(2, 'test2', 'test2@test.com', 'password', '2019-07-27'),
(3, 'janick67a@interia.pl', 'janick67a@interia.pl', 'janick67a', '2019-07-27');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `wydatki`
--

CREATE TABLE `wydatki` (
  `id` int(10) NOT NULL,
  `bank` varchar(10) NOT NULL DEFAULT 'PKO',
  `kwota` decimal(10,2) NOT NULL,
  `data` date DEFAULT NULL,
  `typ` set('Pożyczone','Studia','Przelew','Jedzenie','elektronika','Samochód','Sport','Rozrywka','wyplata','Ubrania','dostałem','zdrowie','tech','inne','podróż') NOT NULL,
  `typ2` set('Pożyczone','Przelew','Oddane','Jedzenie','Paliwo','prezent','smartdom','praca','słodycze','bus','inne','Lodowisko','Higiena','tel','basen','picie','pizza','rolki','buty','Czesne','kebab','usługa','spodnie','nagroda','kino','siatka','elegancko','góry','koszulka','stypendium','gry','sport','części','łyżwy','bielizna','okulary','escape','koszulki','narzędzia','hotel') NOT NULL,
  `gdzie` varchar(10) NOT NULL,
  `kogo` varchar(10) NOT NULL DEFAULT 'moje',
  `osoba` varchar(20) DEFAULT NULL,
  `powiazane` varchar(50) NOT NULL DEFAULT '0',
  `opis` text NOT NULL,
  `createdData` date NOT NULL DEFAULT current_timestamp(),
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `wydatki`
--

INSERT INTO `wydatki` (`id`, `bank`, `kwota`, `data`, `typ`, `typ2`, `gdzie`, `kogo`, `osoba`, `powiazane`, `opis`, `createdData`, `userId`) VALUES
(449, 'PKO', '-15.00', '2019-03-13', 'Studia', 'bus', 'Kraków', 'moje', NULL, '0', '', '2019-07-27', 3),
(450, 'BGZ', '-34.00', '2019-03-12', 'Jedzenie', 'pizza', 'Maleńka', 'moje', '', '', '', '2019-07-27', 3),
(451, 'PKO', '30000.00', '2019-03-12', 'Studia', 'bus', 'Kraków', 'moje', '', '', '', '2019-07-27', 3),
(452, 'PKO', '23.00', '2019-03-12', 'Studia', 'pizza', 'Kraków', 'moje', '', '', '', '2019-07-27', 3),
(453, 'PKO', '23.45', '2019-03-14', 'Studia', 'bus', 'Kraków', 'moje', '', '', '', '2019-07-27', 3),
(454, 'MBA', '-14.00', '2019-03-18', 'Rozrywka', 'kino', 'Śnieżka', 'moje', 'Piotrek', '', '', '2019-07-27', 3),
(455, 'BGZ', '12.00', '2019-08-08', 'Jedzenie', 'pizza', 'Kraków', 'moje', '', '', '', '2019-08-08', 3),
(456, 'BGZ', '12.00', '2019-08-08', 'Jedzenie', 'pizza', 'Kraków', 'moje', '', '', '', '2019-08-08', 3),
(457, 'BGZ', '12.00', '2019-08-08', 'Jedzenie', 'pizza', 'Kraków', 'moje', '', '', '', '2019-08-08', 3),
(458, 'PKO', '123.00', '2019-08-08', 'Studia', 'bus', 'Kraków', 'moje', '', '', '', '2019-08-08', 3),
(459, 'PKO', '124.00', '2019-08-01', 'Jedzenie', 'pizza', 'Kraków', 'moje', '', '', '', '2019-08-08', 3),
(460, 'PKO', '123.00', '2019-08-01', 'Jedzenie', 'pizza', 'Maleńka', 'moje', '', '', '', '2019-08-08', 3),
(461, 'BGZ', '123.00', '2019-08-01', 'Jedzenie', 'bus', 'Kraków', 'moje', '', '', '', '2019-08-08', 3),
(462, 'PKO', '43.00', '2019-08-09', 'Rozrywka', 'kino', 'Śnieżka', 'moje', '', '', '', '2019-08-09', 3),
(463, 'BGZ', '43.00', '2019-08-09', 'Jedzenie', 'bus', 'Kraków', 'moje', '', '', '', '2019-08-09', 3),
(464, 'BGZ', '32.00', '2019-08-09', 'Studia', 'bus', 'Kraków', 'moje', '', '', '', '2019-08-09', 3),
(465, 'PKO', '89.00', '2019-08-09', 'Studia', 'bus', 'Kraków', 'moje', '', '', '', '2019-08-09', 3),
(466, 'BGZ', '34.00', '2019-08-09', 'Jedzenie', 'bus', 'Śnieżka', 'moje', '', '', '', '2019-08-09', 3),
(467, 'PKO', '67.00', '2019-08-13', 'Jedzenie', 'pizza', 'Kraków', 'moje', '', '', '', '2019-08-18', 3),
(468, 'gfhj', '567.00', '2019-08-18', 'Studia', 'pizza', 'Kraków', 'moje', '', '', '', '2019-08-18', 3),
(469, 'PKO', '1234.00', '2019-08-19', 'Studia', 'bus', 'Kraków', 'moje', '', '', '', '2019-08-19', 3),
(470, 'PKO', '1234.00', '2019-08-19', 'Studia', 'bus', 'Kraków', 'moje', '', '', '', '2019-08-19', 3),
(471, 'BGZ', '321.00', '2019-08-20', 'Jedzenie', 'pizza', 'Maleńka', 'moje', '', '', '', '2019-08-19', 3),
(472, 'MBA', '456.00', '2019-08-20', 'Rozrywka', 'kino', 'Maleńka', 'moje', 'Piotrek', '', '', '2019-08-19', 3),
(473, 'MBA', '456.00', '2019-08-20', 'Rozrywka', 'kino', 'Maleńka', 'moje', 'Piotrek', '', '', '2019-08-19', 3),
(474, 'gfhj', '678.00', '2019-08-21', 'Rozrywka', 'bus', 'Maleńka', 'moje', '', '', '', '2019-08-19', 3),
(475, 'BGZ', '876.00', '2019-08-21', 'Studia', 'pizza', 'Śnieżka', 'moje', '', '', '', '2019-08-19', 3),
(476, 'BGZ', '876.00', '2019-08-21', 'Studia', 'pizza', 'Śnieżka', 'moje', '', '', '', '2019-08-19', 3),
(477, 'BGZ', '876.00', '2019-08-21', 'Studia', 'pizza', 'Śnieżka', 'moje', '', '', '', '2019-08-19', 3),
(478, 'BGZ', '876.00', '2019-08-21', 'Studia', 'pizza', 'Śnieżka', 'moje', '', '', '', '2019-08-19', 3),
(479, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-19', 0),
(480, 'GOT', '-10.00', '2019-07-06', 'Rozrywka', 'picie', 'Festyn', 'moje', 'Kinga', '0', 'Piwo dla mnie i Kingi na pól + postawiłem Piotrkowi', '2019-08-19', 0),
(481, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-19', 0),
(482, 'GOT', '-10.00', '2019-07-06', 'Rozrywka', 'picie', 'Festyn', 'moje', 'Kinga', '0', 'Piwo dla mnie i Kingi na pól + postawiłem Piotrkowi', '2019-08-19', 0),
(483, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-19', 3),
(484, 'GOT', '-10.00', '2019-07-06', 'Rozrywka', 'picie', 'Festyn', 'moje', 'Kinga', '0', 'Piwo dla mnie i Kingi na pól + postawiłem Piotrkowi', '2019-08-19', 3),
(485, 'BGZ', '-86.00', '2019-08-20', 'Jedzenie', 'bus', 'Maleńka', 'tata', '', '', '', '2019-08-19', 3),
(486, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-20', 3),
(487, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-20', 3),
(488, 'GOT', '-10.00', '2019-07-06', 'Rozrywka', 'picie', 'Fes', 'moje', 'Kinga', '0', 'Piwo dla mnie i Kingi na pól + postawiłem Piotrkowi', '2019-08-20', 3),
(489, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-20', 3),
(490, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-20', 3),
(491, 'GOT', '-10.00', '2019-07-06', 'Rozrywka', 'picie', 'Festyn', 'moje', 'Kinga', '0', 'Piwo dla mnie i Kingi na pól + postawiłem Piotrkowi', '2019-08-20', 3),
(492, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-20', 3),
(493, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-20', 3),
(494, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-20', 3),
(495, 'GOT', '-10.00', '2019-07-06', 'Rozrywka', 'picie', 'Festyn', 'moje', 'Kinga', '0', 'Piwo dla mnie i Kingi na pól + postawiłem Piotrkowi', '2019-08-20', 3),
(496, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-20', 3),
(497, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-20', 3),
(498, 'GOT', '-100.00', '2019-06-27', 'Pożyczone', 'Pożyczone', 'Tata', 'tata', NULL, '0', '200 na 2 za paliwo', '2019-08-20', 3);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `columns`
--
ALTER TABLE `columns`
  ADD PRIMARY KEY (`col_id`);

--
-- Indeksy dla tabeli `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeksy dla tabeli `wydatki`
--
ALTER TABLE `wydatki`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `columns`
--
ALTER TABLE `columns`
  MODIFY `col_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `wydatki`
--
ALTER TABLE `wydatki`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=499;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
