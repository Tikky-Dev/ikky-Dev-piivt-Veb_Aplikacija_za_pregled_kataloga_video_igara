# Aplikacija za pregled kataloga video igara

Ovo je projekat za ispit iz predmeta **Praktikum - Internet i Veb Tehnologije**.

**Broj Indeksa:** 2018/200935
**Ime i Prrezime:** Gregor Stojanović
**Školska godina:** 2021/2022

## Projektni zahtev

Aplikacija treba da omogući administratoru da se prijavi sa svojim pristupim parametrima i da uređuje podatke u bazi, među kojima su kategorije video igara, platforme video igara i same video igre. Podatke za spisak kategorija igara i platforme video igara samostalno pribaviti. U podacima o video igri se čuvaju naslov, slika, naziv izdavačke kuće, godina izdanja, opis igre, kao i ESRB znak, uz spisak činjenica o tome šta podrazumeva konkretna ESRB oznaka za svaku igru pojedinačno. Za svaku igru, administrator unosi podatak u tome da li je u ponudi za prodaju i po kojoj ceni. Posetioci sajta ne treba da se registruju i prijave da bi pregledali katalog. Međutim, da bi mogli da napišu svoj komentar i daju ocenu o video igri, moraju da se registruju i prijave. Korisnik za registraciju unosi svoje ime, prezime, adresu, mesto, jedinstvenu adresu elektronske pošte i jedinstveni broj telefona. Korisnik može da ostavi samo jednu ocenu sa komentarom za jednu video igru. Ukoliko želi da promeni svoju ocenu ili komentar, može to da učini. Uz ocenu i komentar se ističu puno ime, prezime i mesto korisnika koji je komentar ostavio. Ocena igre se računa kao prosečna ocena svih unetih ocena korisnika na sajtu. Administrator ima pravo da uređuje tekst komentara, dok se ocena odmah primenjuje i prikazuje na profilu igre, dok se komentar prikazuje tek kada ga administrator odobri. Ukoliko administrator ne želi da odobri komentar, može da napiše poruku sa obrazloženjem i razlogom odbijanja objavljivanja komentara, koji će stajati prikazan umesto teksta komentara uz ocenu na sajtu igre. Kada korisnik promeni ocenu ili komentar, ona se ponovo obeležava kao neproverena i administrator mora da je pregleda i komentar ponovo ili odobri ili uz obrazloženje odbije. Na sajtu mora da postoji stranica za kontakt prodavnice.

## Tehnička ograničenja

- Aplikacija mora da bude realizovana na Node.js platformi korišćenjem Express biblioteke. Aplikacija mora da bude podeljena u dve nezavisne celine: back-end veb servis (API) i front-end (GUI aplikacija). Sav kôd aplikacije treba da bude organizovan u jednom Git spremištu u okviru korisničkog naloga za ovaj projekat, sa podelom kao u primeru zadatka sa vežbi.
- Baza podataka mora da bude relaciona i treba koristiti MySQL ili MariaDB sistem za upravljanje bazama podataka (RDBMS) i u spremištu back-end dela aplikacije mora da bude dostupan SQL dump strukture baze podataka, eventualno sa inicijalnim podacima, potrebnim za demonstraciju rada projekta.
- Back-end i front-end delovi projekta moraju da budi pisani na TypeScript jeziku, prevedeni TypeScript prevodiocem na adekvatan JavaScript. Back-end deo aplikacije, preveden na JavaScript iz izvornog TypeScript koda se pokreće kao Node.js aplikacija, a front-end deo se statički servira sa rute statičkih resursa back-end dela aplikacije i izvršava se na strani klijenta. Za postupak provere identiteta korisnika koji upućuje zahteve back-end delu aplikacije može da se koristi mehanizam sesija ili JWT (JSON Web Tokena), po slobodnom izboru.
- Sav generisani HTML kôd koji proizvodi front-end deo aplikacije mora da bude 100% validan, tj. da prođe proveru W3C Validatorom (dopuštena su upozorenja - Warning, ali ne i greške - Error). Grafički korisnički interfejs se generiše na strani klijenta (client side rendering), korišćenjem React biblioteke, dok podatke doprema asinhrono iz back-end dela aplikacije (iz API-ja). Nije neophodno baviti se izradom posebnog dizajna grafičkog interfejsa aplikacije, već je moguće koristiti CSS biblioteke kao što je Bootstrap CSS biblioteka. Front-end deo aplikacije treba da bude realizovan tako da se prilagođava različitim veličinama ekrana (responsive design).
- Potrebno je obezbediti proveru podataka koji se od korisnika iz front-end dela upućuju back-end delu aplikacije. Moguća su tri sloja zaštite i to: (1) JavaScript validacija vrednosti na front-end-u; (2) Provera korišćenjem adekvatnih testova ili regularnih izraza na strani servera u back-end-u (moguće je i korišćenjem izričitih šema - Schema za validaciju ili drugim pristupima) i (3) provera na nivou baze podataka korišćenjem okidača nad samim tabelama baze podataka.
- Neophodno je napisati prateću projektnu dokumentaciju o izradi aplikacije koja sadrži (1) model baze podataka sa detaljnim opisom svih tabela, njihovih polja i relacija; (2) dijagram baze podataka; (3) dijagram organizacije delova sistema, gde se vidi veza između baze, back-end, front-end i korisnika sa opisom smera kretanja informacija; (4) popis svih aktivnosti koje su podržane kroz aplikaciju za sve uloge korisnika aplikacije prikazane u obliku Use-Case dijagrama; kao i (5) sve ostale elemente dokumentacije predviđene uputstvom za izradu dokumentacije po ISO standardu.
- Izrada oba dela aplikacije (projekata) i promene kodova datoteka tih projekata moraju da bude praćene korišćenjem alata za verziranje koda Git, a kompletan kôd aplikacije bude dostupan na javnom Git spremištu, npr. na besplatnim GitHub ili Bitbucket servisima, jedno spremište za back-end projekat i jedno za front-end projekat. Ne može ceo projekat da bude otpremljen u samo nekoliko masovnih Git commit-a, već mora da bude pokazano da je projekat realizovan u kontinuitetu, da su korišćene grane (branching), da je bilo paralelnog rada u više grana koje su spojene (merging) sa ili bez konflikata (conflict resolution).

## Primer pristupnih parametara

### User

Email: nocetepa@mailo.icu
Password: Test123

### Admin

Username: newadmin,
Password: Admin123
## Baza podataka

MySQL baza:

<img src="./DocumentationImg/PodaciOgranicenjaBazaPodataka.png"
     alt="" />


### ERD Dijagram

<img src="./DocumentationImg/ErdDiagram.png"
     alt="" />
## Use-Case dijagrami

<img src="./DocumentationImg/UseCase.png"
     alt="" />

### Uloge

**Administrator**

- Uredjivanje Kategorija:
    - Dodavanje nove kategorije
    - Izmena postojecih kategorija
    - Pregled svih postojecih kategorija
- Uredjivanje Platformi:
    - Dodavanje nove platforme
    - Izmena postojecih platformi
    - Pregled svih postojecih platformi
- Uredjivanje Administratora:
    - Dodavanje novog admina
    - Izmena postojecih admina
    - Pregled svih postojecih admina
    - deaktiviranje admina
- Uredjivanje Korisnika:
    - Dodavanje novog korisnika
    - Izmena postojecih korisnika
        - Izmena imena i prezimena
    - Pregled svih postojecih korisnika
    - deaktiviranje admina
- Odobravanje komentara
- Uredjivanje igara
    - Dodavanje igara
    - Dodavanje kategorija igri
    - Dodavanje platformi igri
    - izmena igara
    - deaktiviranje igara
    - Upravljanje fotografijama
        - Dodavanje fotografija
        - izmena fotografija
- Odjavi

**Korisnik**

- Pregled
    - igara
    - kategorija
    - platformi
    - ocena
- Oceni igru
- Izmeni komentar
- Izmeni svoje podatke
- Odjavi

**Posetilac**

- Pregled
    - igara
    - kategorija
    - platformi
    - ocena
- Registracija korisnika
- Logovanje
    - kao administrator
    - kao korisnik