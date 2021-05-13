# Egys�gtesztel�s �s tesztek k�dlefedetts�g�nek m�r�se

## �sszefoglal�s

A tesztel�s sor�n az alkalmaz�s backend szolg�ltat�s�ra f�kusz�ltunk.
Azon bel�l is a Controllerek tesztel�s�t v�gezt�k, mivel sajnos csak 2 r�teg� architekt�r�t haszn�l a projekt.
A k�t r�teg a Controllerek �s a Repository-k, teh�t API (Application Programming Interface) �s DAL (Data Access Layer).
Mivel nincs k�l�n �zleti logikai r�teg (BLL: Business Logic Layer),
ez�rt a logik�t f�lig a Controllerek, f�lig a Repository-k val�s�tj�k meg.
Ez t�bb szempontb�l is h�tr�nyos:
- Megnehez�ti a tesztel�st.
- Rontja a k�d b�v�thet�s�g�t.
- Kev�sb� �tl�that�, meg�rthet� a k�d.
- Nehezen cser�lhet� az adatok perziszt�l�s�ra szolg�l� technol�gia.
A tesztel�s megval�s�t�s�hoz a .NET keretrendszerhez haszn�latos xUnit eszk�z seg�ts�g�t vett�k.

## Megval�s�t�s

Szerencs�re az alkalmaz�s DI haszn�lat�val kett�bontotta a Controller logik�t a Repository-t�l,
viszont hi�nyzott egy 3. r�teg, ami csak az �zleti logik�t tartalmazn�.
Tov�bb� a DI nem interface megval�s�t�st v�rt, hanem a konkr�t implement�ci�t, ami megnehez�tette a mock adatokkal val� tesztel�st.
Emiatt el�sz�r l�tre kellett hozni Repository interface-eket, azokat haszn�lni a Controllerekben,
illetve a konkr�t Repository-knak implement�lnia kellett azokat.
Miut�n ezzel megvoltunk l�tre kellett hoznunk minden Controllerhez egy-egy hamis Repot, amelyek mock adatokat tudnak visszaadni,
azokon tudnak m�veleteket v�gezni, hogy ezeket felhaszn�lva sikeresen tudjunk unit tesztelni.
A megval�s�tott FakeRepository-k seg�ts�g�vel megkezd�dhetett a unit tesztek �r�sa.
Az egys�gtesztel�s sor�n arra t�rekedt�nk, hogy egyszer�bb tesztek seg�ts�g�vel megbizonyosodjunk egy-egy met�dus helyes m�k�d�s�r�l,
amelyet �gy �sszetettebb tesztek �r�s�ra is fel tudtunk haszn�lni.

### Tesztek eredm�nyei

![](img/test_results.png)

## Konkl�zi�

A tesztel�s sor�n t�bb hib�t is tal�ltunk, amelyekre a tesztek hibajelz�se mutatott r�.
Az egyszer�bb hib�kat igyekezt�nk kijav�tani, ilyen volt pl. az *IssueRepository* *UpdateIssue* f�ggv�nye,
ami akkor is l�trehozott �s visszaadott egy *ClientIssue* p�ld�nyt,
amikor az �tadott ID nem tartozott val�di rekordhoz.
Valamint f�ny der�lt arra is, hogy az IssueRepository eset�n a felhaszn�l�i ID csup�n a
list�z� m�veletekn�l van figyelembe v�ve.
Ez biztons�gi szempontb�l nem a legjobb, hiszen ha nincs ID ellen�rz�s egy t�rl�si m�veletben,
akkor amennyiben b�rki ismeri valamely er�forr�som azonos�t�j�t k�pes lesz azt t�r�lni.
V�g�l ezt is siker�lt kijav�tanunk, �gy m�r ezen tesztek is sikeren lefutottak.

### Controllerek tesztlefedetts�ge

![](img/controllers_coverage.png)

### Entit�s �s kliens oszt�lyok lefedetts�ge

![](img/entities_coverage.png)

![](img/dto_coverage.png)

## Tanuls�gok

A feladat elk�sz�t�se �ltal betekint�st nyerhett�nk egy ASP.NET-es web api tesztel�s�be, xUnit haszn�lat�val.
Meger�s�tette benn�nk azt a gondolkod�sm�dot, hogy b�rmilyen j� is egy fejleszt�, nem lehet t�vedhetetlen.
Minden projekt tartalmaz hib�kat, amelyek szemmel nehezen �szrevehet�ek.
M�g j�l szervezett, �tl�that� k�d eset�n is el�fordulnak probl�m�k,
rosszabb min�s�g� k�dr�l nem is besz�lve.
Az ilyen rendelleness�gek kisz�r�s�re alkalmas egy j�l �tgondolt, lehet�leg minden eshet�s�gre gondol� teszthalmaz.
Seg�ts�g�vel gyorsan �szrevehet� �s jav�that� egy-egy v�ltoztat�s ut�n l�trej�v� hiba.