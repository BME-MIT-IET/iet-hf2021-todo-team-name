# Nem funkcionális jellemzők vizsgálata

## Biztonság

A weboldal használata csak bejelentkezés után lehetséges, a nem bejelentkezett felhasználókat az oldal átirányítja a bejelentkezési felületre. Az autentikáció és autorizáció JSON Web Tokenek segítségével történik, viszont ennek aláírása egy hetes időtartamra történik. Ezen megközelítés biztonsági problémákat jelenthet, ugyanis nincs megoldás az egyes tokenek visszavonására, így egy felhasználó kitiltásakor például még egy hétig fogja tudni használni az alkalmazást, akkor is, ha bejelentkezni már nem tudna. Ez azért lehetséges, mert az alkalmazás nem generál minden munkamenethez új tokent, hanem egyszerűen eltárolja a böngésző LocalStorage API-ján keresztül azt, és minden alkalommal, amikor az oldal megnyitja a felhasználó, előveszi azt. Így a token könnyedén elérhető JavaScriptből is, ezzel a Cross Site Scripting (XSS) biztonsági kockázatát növelve.
