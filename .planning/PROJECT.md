# grile-ReziNOTE

## What This Is

O platforma SaaS de pregatire pentru examenul de rezidentiat in medicina dentara. Studentii pot exersa grile pe capitole sau amestecate, simula examene reale (200 intrebari: 50 complement simplu + 150 complement multiplu), urmari progresul detaliat prin dashboard-uri vizuale, si se compara anonim cu alti utilizatori. Adminul gestioneaza intrebarile, capitolele si datele istorice de admitere printr-un panel dedicat.

## Core Value

Studentii pot simula examene reale de rezidentiat si vedea instant daca ar fi fost admisi si unde, pe baza datelor istorice reale — motivatia #1 de a reveni pe platforma.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Landing page de prezentare profesionala cu branding complet
- [ ] Sistem de autentificare (email + parola, verificare email, reset parola)
- [ ] Sistem de plata cu Stripe (subscriptii lunare/anuale)
- [ ] Capitole flexibile — adminul le defineste din panel
- [ ] Teste pe capitole individuale (fara limita de timp)
- [ ] Teste pe toate capitolele amestecate (fara limita de timp)
- [ ] Optiune per test: vezi raspuns corect imediat sau la final
- [ ] Simulare examen real: 200 intrebari (50 CS + 150 CM), random din tot, cu timp
- [ ] La simulare: rezultat doar la final (nu pe parcurs)
- [ ] Scor simulare + comparatie cu praguri admitere din ultimii 5 ani
- [ ] Sistem de comparatie anonima cu alti utilizatori (percentila, distributie, medie/mediana, ranking anonim)
- [ ] Dashboard utilizator cu statistici per capitol si generale
- [ ] Trend/progres pe zile si saptamani, istoric raspunsuri corecte/gresite
- [ ] Statistici dinamice per capitol cu vizualizari wow
- [ ] Mesaje de incurajare si "stiai ca" generate automat din performanta
- [ ] Admin panel: CRUD grile (intrebare, optiuni, CS/CM, raspuns corect, sursa/carte)
- [ ] Import/export grile in format Excel si CSV
- [ ] Admin panel: gestionare date istorice admitere (praguri, locuri, specialitati)
- [ ] PWA — instalabila ca app din browser, merge bine pe mobil
- [ ] Branding complet: logo, paleta culori, fonturi — profesional dar friendly

### Out of Scope

- Mobile app nativ — web + PWA acopera nevoile
- OAuth/Google login — email + parola suficient pentru v1
- Real-time chat/forum — nu e core
- Video lessons/tutoriale — focus pe grile
- AI-generated explanations — pastram sursa/cartea ca referinta

## Context

- **Domeniu:** Pregatire rezidentiat medicina dentara, Romania
- **Structura examen real:** 200 intrebari — primele 50 complement simplu (un singur raspuns corect), urmatoarele 150 complement multiplu (mai multe raspunsuri corecte)
- **Intrebarile vin din capitole (materii)** — capitolele sunt flexibile, definite de admin
- **Fiecare grila are:** intrebare, optiuni de raspuns, tip (CS/CM), raspuns(uri) corect(e), sursa (carte/referinta)
- **Date istorice admitere:** ultimii 5 ani, cu praguri si locuri per specialitate, introduse manual de admin
- **Comparatia intre utilizatori:** doar din simulari complete, anonima (fara nume), include percentila, grafic distributie scoruri, medie/mediana, ranking
- **Mesaje motivationale:** generate automat de sistem bazat pe performanta studentului
- **Baza de grile initiala:** 500-2000 intrebari, creste in timp
- **Monetizare:** SaaS cu subscriptie prin Stripe

## Constraints

- **Plati:** Stripe — singura optiune de payment gateway
- **Auth:** Email + parola — fara OAuth in v1
- **Platform:** Web + PWA — fara app nativ
- **Capitole:** Flexibile, definite din admin (nu hardcodate)
- **Stil vizual:** Profesional dar friendly — credibil, nu corporatist, accesibil pentru studenti
- **Limba:** Interfata si continut in romana

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Stripe pentru plati | Functioneaza in Romania, usor de integrat | — Pending |
| Capitole flexibile din admin | Adminul poate adauga/sterge capitole fara modificari de cod | — Pending |
| PWA in loc de app nativ | Acoperire mobile fara cost extra de dezvoltare | — Pending |
| Comparatie anonima | Motivatie prin competitie fara presiune sociala | — Pending |
| Email + parola (fara OAuth) | Simplitate pentru v1, OAuth se poate adauga in v2 | — Pending |
| Mesaje auto-generate | Scalabilitate — nu depinde de admin sa le scrie manual | — Pending |

---
*Last updated: 2026-03-02 after initialization*
