--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: mobiteli; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mobiteli (
    ime_modela character varying(255) NOT NULL,
    tvrtka character varying(255) NOT NULL,
    godina_proizvodnje integer
);


ALTER TABLE public.mobiteli OWNER TO postgres;

--
-- Name: verzije; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verzije (
    verzija_id integer NOT NULL,
    ime_modela character varying(255),
    naziv_verzije character varying(255) NOT NULL,
    cijena integer,
    operacijski_sustav character varying(255),
    ram integer,
    tezina_gram integer,
    kamera_mp integer,
    visina_inch numeric(4,2),
    baterija_mah integer
);


ALTER TABLE public.verzije OWNER TO postgres;

--
-- Name: verzije_verzija_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.verzije_verzija_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.verzije_verzija_id_seq OWNER TO postgres;

--
-- Name: verzije_verzija_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.verzije_verzija_id_seq OWNED BY public.verzije.verzija_id;


--
-- Name: verzije verzija_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verzije ALTER COLUMN verzija_id SET DEFAULT nextval('public.verzije_verzija_id_seq'::regclass);


--
-- Data for Name: mobiteli; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mobiteli (ime_modela, tvrtka, godina_proizvodnje) FROM stdin;
Samsung Galaxy S24	Samsung	2024
Google Pixel 9	Google	2024
iPhone 16	Apple	2024
OnePlus Open	OnePlus	2023
Samsung Galaxy Z Flip 6	Samsung	2024
Nokia 6600	Nokia	2003
iPhone 4	Apple	2011
Huawei Mate 20	Huawei	2018
Xiaomi Redmi Note 8	Xiaomi	2019
LG G3	LG	2014
\.


--
-- Data for Name: verzije; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verzije (verzija_id, ime_modela, naziv_verzije, cijena, operacijski_sustav, ram, tezina_gram, kamera_mp, visina_inch, baterija_mah) FROM stdin;
1	Samsung Galaxy S24	S24 Ultra	1200	Android 14	12	233	200	7.00	5000
2	Samsung Galaxy S24	S24+	1000	Android 14	8	220	108	6.80	4500
3	Samsung Galaxy S24	S24	900	Android 14	8	200	50	6.50	4200
4	iPhone 16	16 Pro Max	1300	iOS 18	8	240	48	7.00	4350
5	iPhone 16	16 Pro	1100	iOS 18	8	220	48	6.70	4200
6	iPhone 16	16	950	iOS 18	6	210	12	6.10	3800
7	Huawei Mate 20	Mate 20 Pro	800	Android 10	6	189	40	6.40	4200
8	Huawei Mate 20	Mate 20 Lite	600	Android 9	4	180	20	6.10	4000
9	Google Pixel 9	Pixel 9 Pro	950	Android 14	12	210	50	7.00	5050
10	OnePlus Open	Open	850	Android 13	16	239	48	7.00	4800
11	Samsung Galaxy Z Flip 6	Z Flip 6	1000	Android 14	8	187	12	6.80	3700
12	Nokia 6600	6600	150	Symbian OS	0	125	0	2.00	850
13	iPhone 4	4S	500	iOS 9	1	140	8	4.00	1430
14	Xiaomi Redmi Note 8	Note 8	200	Android 9	4	190	48	6.00	4000
15	LG G3	G3	300	Android 5	3	149	13	6.00	3000
\.


--
-- Name: verzije_verzija_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.verzije_verzija_id_seq', 15, true);


--
-- Name: mobiteli mobiteli_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mobiteli
    ADD CONSTRAINT mobiteli_pkey PRIMARY KEY (ime_modela);


--
-- Name: verzije verzije_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verzije
    ADD CONSTRAINT verzije_pkey PRIMARY KEY (verzija_id);


--
-- Name: verzije verzije_ime_modela_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verzije
    ADD CONSTRAINT verzije_ime_modela_fkey FOREIGN KEY (ime_modela) REFERENCES public.mobiteli(ime_modela) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

