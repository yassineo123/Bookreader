Open Bibliotheek

Een moderne webapplicatie waarmee gebruikers boeken kunnen zoeken, ontdekken en bewaren in een persoonlijke boekenplank — volledig aangedreven door de Gutendex API (Project Gutenberg).

features

Boekenlijst
Toont willekeurige boeken van Gutendex


Bewerkbare acties:
Wil ik lezen

Mijn Boekenplank.html
Persoonlijke opslag
Twee tabbladen:
Wil ik lezen
Gelezen


Boekdetailpagina:
Dynamische detailweergave van een boek
Mogelijkheid om te bewaren, markeren of notities toe te voegen

Primaire kleuren
Kleur	                Hex	         Gebruik
Bruin / Roestbruin	    #B85C38	     Buttons, navbar, accenten
Donkerbruin	            #A54D2E	     Hover-states
Dieprood / Bourgondisch	#7D2E2E	     Actie-knoppen, detailpagina

Neutrale kleuren
Kleur	                Hex	         Gebruik
Beige licht 1	        #FAF6F0	     Achtergrond gradient
Beige licht 2	        #F4EBD9	     Achtergrond, boxen
Donkergrijs	          #333	       Tekst
Grijs licht	          #999	       Iconen en achtergrond elementen

Overige kleuren
Kleur	               Hex	         Gebruik
Footer zwart	       #2C2C2C	     Footer achtergrond
Footer grijs	       #444	       Footer border

Technische Stack
Frontend	HTML5, CSS3, JavaScript
Icons	Lucide Icons
API	Gutendex (https://gutendex.com)

Data-opslag	localStorage + sessionStorage
Projectstructuur

 project-root
│
├── index.html              # Homepage met zoekfunctie en trending boeken
├── boekenlijst.html        # Overzichtspagina van meer boeken
├── mijn-boekenplank.html   # Persoonlijke boekenplank
├── boek-detail.html        # Dynamische detailpagina
│
├── script.js               # Alle API-calls, UI-logica en opslagfuncties
│
├── /css
│   └── main.css            # Layout, styling en responsive design
│
└── /img                    # Afbeeldingen

Installatie & Gebruik
Download of clone het project
git clone https://github.com/jouw-repo/open-bibliotheek.git

Open het project lokaal
Je kunt het project direct openen in je browser:
index.html


Internet vereist sinds de data wordt opgehaald vanuit gutendex


Data-opslag

wantToRead	array met boeken die opgeslagen zijn als “wil ik lezen”
read	array met boeken die de gebruiker heeft gelezen
currentBook	tijdelijk opgeslagen data voor detailpagina

Responsive Design
Het project bevat maar 1 stylesheet (main.css) met:
Responsive grid voor boeken
Kleine en grote weergave voor detailpagina
Automatisch schalende hero-secties, voor werkende


Licentie

Dit project gebruikt publieke en rechtenvrije boeken via Project Gutenberg.

Auteur

Yassine Airad
