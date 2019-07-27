-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 27 Lip 2019, 19:03
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
('4ec74a9b-f4e4-4d77-b160-c26c3a8ac138', 1564257795, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":3}}');

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
(454, 'MBA', '-14.00', '2019-03-18', 'Rozrywka', 'kino', 'Śnieżka', 'moje', 'Piotrek', '', '', '2019-07-27', 3);

--
-- Indeksy dla zrzutów tabel
--

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
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `wydatki`
--
ALTER TABLE `wydatki`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=455;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
