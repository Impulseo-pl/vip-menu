/* Dane pokazowe VIP-Menu — przykładowe restauracje z Łodzi.
   Każdy wpis = jedna „strona” portalu (danie), tak jak w panelu sterowania klienta. */
window.VIP_MIASTA = ["Łódź", "Warszawa", "Kraków", "Wrocław", "Poznań", "Gdańsk"];

window.VIP_DANE = (function () {
  var R = {
    sami: { restauracja: "Sami's Restaurant", adres: "ul. Piotrkowska 12", miasto: "Łódź" },
    livia: { restauracja: "Trattoria Da Livia", adres: "ul. 6 Sierpnia 18", miasto: "Łódź" },
    koji: { restauracja: "Kōji Sushi & Ramen", adres: "ul. Traugutta 9", miasto: "Łódź" },
    aniol: { restauracja: "Pierogarnia Pod Aniołem", adres: "ul. Nawrot 7", miasto: "Łódź" },
    smash: { restauracja: "Smash & Co. Burger Bar", adres: "ul. Tymienieckiego 22", miasto: "Łódź" },
    weranda: { restauracja: "Bistro Zielona Weranda", adres: "ul. Moniuszki 4", miasto: "Łódź" }
  };
  var d = [
    ["sami", "Tatar z polędwicy wołowej", "kapary, żółtko przepiórcze, borowik, pikle", 60, "tatar"],
    ["sami", "Krem z pieczonej dyni", "prażone pestki, olej dyniowy, grzanka na maśle", 24, "dynia"],
    ["sami", "Pierś z kaczki", "puree z selera, sos wiśniowy, młode warzywa", 72, "kaczka"],
    ["sami", "Sernik baskijski", "karmel, szczypta soli morskiej", 28, "sernik"],
    ["livia", "Pizza Margherita", "pomidory San Marzano, fior di latte, świeża bazylia", 38, "pizza"],
    ["livia", "Spaghetti carbonara", "guanciale, pecorino romano, żółtko, czarny pieprz", 44, "carbonara"],
    ["livia", "Tiramisu", "mascarpone, espresso, kakao", 26, "tiramisu"],
    ["koji", "Zestaw sushi mix", "24 kawałki: nigiri, maki i uramaki z łososiem i tuńczykiem", 89, "sushi"],
    ["koji", "Uramaki z krewetką", "krewetka w tempurze, awokado, sos spicy mayo", 42, "uramaki"],
    ["koji", "Ramen z wieprzowiną", "bulion tonkotsu, chashu, jajko marynowane, nori", 46, "ramen"],
    ["aniol", "Pierogi ruskie podsmażane", "cebulka, kwaśna śmietana, konfitura", 29, "ruskie"],
    ["aniol", "Pierożki z kaczką w bulionie", "rosół z kaczki, kawior z pstrąga", 36, "pierozki"],
    ["aniol", "Naleśniki z twarogiem", "truskawki, bita śmietana, mięta", 27, "nalesniki"],
    ["smash", "Burger klasyczny", "wołowina 200 g, cheddar, bekon, frytki", 42, "burger"],
    ["smash", "Burger BBQ", "podwójny cheddar, prażona cebula, sos BBQ", 45, "bbq"],
    ["smash", "Frytki z sosem serowym", "belgijskie frytki, sos cheddar, szczypiorek", 16, "frytki"],
    ["weranda", "Talerz meze", "hummus, falafel, pita, pikle, oliwki", 38, "meze"],
    ["weranda", "Szakszuka", "pomidory, jajka, feta, chałka z pieca", 32, "szakszuka"],
    ["weranda", "Gofry z borówkami", "jogurt grecki, miód, świeże borówki", 24, "gofry"]
  ];
  return d.map(function (x, i) {
    var r = R[x[0]];
    return {
      id: "d" + (i + 1), restauracja: r.restauracja, danie: x[1], opis: x[2], cena: x[3],
      foto: "img/" + x[4] + ".jpg", adres: r.adres, miasto: r.miasto, maps: "", www: ""
    };
  });
})();
