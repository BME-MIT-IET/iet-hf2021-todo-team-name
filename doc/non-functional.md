# Nem funkcionális jellemzők vizsgálata

## Biztonság

A weboldal használata csak bejelentkezés után lehetséges, a nem bejelentkezett felhasználókat az oldal átirányítja a bejelentkezési felületre. Az autentikáció és autorizáció JSON Web Tokenek segítségével történik, viszont ennek aláírása egy hetes időtartamra történik. Ezen megközelítés biztonsági problémákat jelenthet, ugyanis nincs megoldás az egyes tokenek visszavonására, így egy felhasználó kitiltásakor például még egy hétig fogja tudni használni az alkalmazást, akkor is, ha bejelentkezni már nem tudna. Ez azért lehetséges, mert az alkalmazás nem generál minden munkamenethez új tokent, hanem egyszerűen eltárolja a böngésző LocalStorage API-ján keresztül azt, és minden alkalommal, amikor az oldal megnyitja a felhasználó, előveszi azt. Így a token könnyedén elérhető JavaScriptből is, ezzel a Cross Site Scripting (XSS) biztonsági kockázatát növelve.

## Kompatibilitás

Az alkalmazás két részre bomlik, egy React (TypeScript) alapú frontend és .NET Core alapú backendre. Ezeknek kompatibilitása jó, hiszen a .NET Core a .NET Frameworkkel ellentétben cross-platform, azaz futtatható Windows, Linux, vagy MacOS alapú rendszereken is. A frontend alkalmazás fordításának eredménye HTML, CSS és JavaScript fájlok, amelyeket tetszőleges módszerrel lehet kiszolgálni (akár .NET-ben használatos IIS Expressel is).

## Használhatóság különböző képernyőméretű készülékeken

Az alkalmazás nem skálázódik megfelelően mobil készülékeken. A heti nézetben található naptár átláthatatlan, teljesen lelóg a képernyőről, az egyes cellákban szereplő szövegek kilógnak belőle. A navigációs sáv bár görgethető, használata nem esik kézre.

A feladat nézeten levő oszlopok egymás alá kerültek, így nehezebben elkülöníthetőek, illetve maguk a feladatok nem mozgathatóak drag & drop módszerrel, mint az asztali gépeken. A felugró dialógusok viszont jól skálázódnak, az egészet képernyőt kitöltik, nagyobb hossz esetén görgethetővé válnak.

A keresés, címkék és felhasználó oldalak használhatóan jelennek meg, bár nem szépek, például a címkék az egész oldal szélességét kitöltik, ahelyett, hogy egymást követnék.

Ezenkívül, a nagy méretű felhasznált könyvtárak miatt a letöltött JavaScript fájl nagyon nagy méretű (több mint 10 MB), ez lassabb mobil kapcsolatokon szignifikánsan nagyobb betöltési időt eredményezhet, illetve akár több pénzbe is kerülhet.
