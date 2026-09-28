/* VIP-Menu — wersja pokazowa. Dane: assets/data.js + zmiany z panelu (zapis w tej przeglądarce). */
(function () {
  "use strict";
  var KLUCZ = "vipmenu_dane_v1", KLUCZ_MIASTO = "vipmenu_miasto";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- ikony ---------- */
  var G = '<defs><linearGradient id="vz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7E48C"/><stop offset=".45" stop-color="#C8952A"/><stop offset=".7" stop-color="#F2D57A"/><stop offset="1" stop-color="#946814"/></linearGradient><radialGradient id="vc" cx=".5" cy=".3" r=".75"><stop offset="0" stop-color="#3B3833"/><stop offset="1" stop-color="#0A0908"/></radialGradient></defs>';
  var IKONY = {
    logo: '<svg viewBox="0 0 120 120" aria-hidden="true">' + G +
      '<circle cx="60" cy="60" r="58" fill="url(#vz)"/><circle cx="60" cy="60" r="50" fill="url(#vc)"/>' +
      '<circle cx="60" cy="60" r="45" fill="none" stroke="#E9C766" stroke-width="1.6" stroke-dasharray="0.1 5.2" stroke-linecap="round" opacity=".85"/>' +
      '<path d="M47 43l5 5.5 8-9.5 8 9.5 5-5.5-2.2 10H49.2z" fill="url(#vz)"/>' +
      '<text x="60" y="84" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="35" letter-spacing="-1" fill="url(#vz)">VIP</text></svg>',
    strzalka: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4 60 32H45V60H19V32H4Z"/></svg>',
    drzwi: '<svg viewBox="0 0 64 52" aria-hidden="true"><defs><linearGradient id="sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#9A958C"/></linearGradient></defs>' +
      '<rect x="1" y="1" width="62" height="50" fill="#141210"/><path d="M24 6h16v45H24z" fill="url(#sw)"/><path d="M7 4l15 3v41L7 51z" fill="#48433A"/><path d="M57 4l-15 3v41l15 3z" fill="#48433A"/><path d="M18 50 24 36h16l6 14z" fill="#DAD5CB" opacity=".55"/></svg>',
    mapa: '<svg viewBox="0 0 104 92" aria-hidden="true"><rect width="104" height="92" fill="#EFE9DA"/>' +
      '<path d="M0 30h104M0 62h104M30 0v92M72 0v92" stroke="#fff" stroke-width="6"/><path d="M0 14 104 80M50 0 38 92" stroke="#fff" stroke-width="3"/>' +
      '<path d="M8 38h16v18H8zM78 8h20v16H78zM40 68h26v18H40z" fill="#CFE0C3"/><path d="M86 34h14v20H86z" fill="#D9D2C0"/><path d="M52 0v92" stroke="#E8C85A" stroke-width="4"/>' +
      '<path d="M52 24c-7 0-12 5-12 11 0 9 12 21 12 21s12-12 12-21c0-6-5-11-12-11z" fill="#A3262A"/><circle cx="52" cy="35" r="4.5" fill="#fff"/></svg>'
  };
  function wstawIkony() { $$("[data-ikona]").forEach(function (el) { el.insertAdjacentHTML("afterbegin", IKONY[el.getAttribute("data-ikona")] || ""); }); }

  /* ---------- dane ---------- */
  var Dane = {
    wszystkie: function () {
      try { var a = JSON.parse(localStorage.getItem(KLUCZ)); if (Array.isArray(a)) return a; } catch (e) {}
      return window.VIP_DANE.slice();
    },
    zapisz: function (a) { try { localStorage.setItem(KLUCZ, JSON.stringify(a)); return true; } catch (e) { return false; } },
    reset: function () { try { localStorage.removeItem(KLUCZ); } catch (e) {} },
    miasto: function () { try { return localStorage.getItem(KLUCZ_MIASTO) || "Łódź"; } catch (e) { return "Łódź"; } },
    ustawMiasto: function (m) { try { localStorage.setItem(KLUCZ_MIASTO, m); } catch (e) {} }
  };
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function zl(n) { n = Number(n); return isNaN(n) ? "-" : (n % 1 ? n.toFixed(2).replace(".", ",") : String(n)) + " zł"; }
  function odm(n, a, b, c) { var d = n % 10, s = n % 100; return n === 1 ? a : (d >= 2 && d <= 4 && (s < 12 || s > 14)) ? b : c; }
  // każde słowo zapytania musi pasować do początku jakiegoś słowa; dłuższe słowa bez końcówki („pierogi” łapie też „pierożki”)
  function pasuje(tekst, q) {
    var slowa = norm(tekst).split(/[^a-z0-9]+/);
    return norm(q).split(/\s+/).filter(Boolean).every(function (w) {
      var rdzen = w.length >= 5 ? w.slice(0, w.length - 2) : w;
      return slowa.some(function (x) { return x.indexOf(rdzen) === 0 || x.indexOf(w) >= 0; });
    });
  }
  function mapsUrl(d) { return d.maps || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(d.restauracja + ", " + d.adres + ", " + d.miasto); }
  function restauracje(lista, miasto) {
    var kolej = [], m = {};
    lista.forEach(function (d) {
      if (miasto && d.miasto !== miasto) return;
      if (!m[d.restauracja + "|" + d.miasto]) { m[d.restauracja + "|" + d.miasto] = []; kolej.push(d.restauracja + "|" + d.miasto); }
      m[d.restauracja + "|" + d.miasto].push(d);
    });
    return kolej.map(function (k) { return { nazwa: m[k][0].restauracja, miasto: m[k][0].miasto, dania: m[k] }; });
  }
  function miasta() {
    var s = window.VIP_MIASTA.slice();
    Dane.wszystkie().forEach(function (d) { if (d.miasto && s.indexOf(d.miasto) < 0) s.push(d.miasto); });
    return s;
  }
  function wypelnijMiasta(sel, wybrane) {
    sel.innerHTML = miasta().map(function (m) { return '<option' + (m === wybrane ? " selected" : "") + ">" + esc(m) + "</option>"; }).join("");
  }
  function podepnijMiasto(naZmiane) {
    $$(".miasto-wybor").forEach(function (sel) {
      wypelnijMiasta(sel, Dane.miasto());
      sel.addEventListener("change", function () { Dane.ustawMiasto(sel.value); naZmiane && naZmiane(sel.value); });
    });
  }

  var toastT;
  function toast(html, ms) {
    var t = $("#toast"); if (!t) return;
    t.innerHTML = html; t.classList.add("widac");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("widac"); }, ms || 3200);
  }
  function potwierdz(tytul, tekst, tak, etykieta) {
    var o = $("#okno"); $("#okno-tytul").textContent = tytul; $("#okno-tekst").textContent = tekst; $("#okno-tak").textContent = etykieta || "Tak, usuń";
    o.hidden = false; $("#okno-nie").focus();
    function zamknij() { o.hidden = true; $("#okno-tak").onclick = $("#okno-nie").onclick = o.onclick = null; document.removeEventListener("keydown", esc_); }
    function esc_(e) { if (e.key === "Escape") zamknij(); }
    document.addEventListener("keydown", esc_);
    $("#okno-tak").onclick = function () { zamknij(); tak(); };
    $("#okno-nie").onclick = zamknij;
    o.onclick = function (e) { if (e.target === o) zamknij(); };
  }

  /* ---------- START ---------- */
  function stronaStart() {
    var pole = $("#szukaj-pole"), sek = $("#wyniki-sekcja"), siatka = $("#wyniki"), tyt = $("#wyniki-tytul");
    function licznik() {
      var m = Dane.miasto(), rs = restauracje(Dane.wszystkie(), m), n = rs.reduce(function (a, r) { return a + r.dania.length; }, 0);
      $("#licznik").textContent = n ? m + ": " + rs.length + " " + odm(rs.length, "restauracja", "restauracje", "restauracji") + " · " + n + " " + odm(n, "danie", "dania", "dań")
        : m + ": jeszcze bez restauracji. Pierwszą dodasz w\u00a0panelu sterowania.";
    }
    function szukaj(q, przewin) {
      var m = Dane.miasto(), nq = norm(q).trim();
      var lista = Dane.wszystkie().filter(function (d) {
        return d.miasto === m && (!nq || pasuje(d.danie + " " + d.opis + " " + d.restauracja, nq));
      });
      tyt.textContent = nq ? "„" + q.trim() + "” w\u00a0mieście " + m + ": " + lista.length : "Wszystkie dania: " + m;
      siatka.innerHTML = lista.length ? lista.map(function (d) {
        return '<a class="karta" href="danie.html?id=' + encodeURIComponent(d.id) + '"><img src="' + esc(d.foto) + '" alt="' + esc(d.danie) + '" loading="lazy" width="450" height="450">' +
          '<span class="karta-tresc"><span class="karta-danie">' + esc(d.danie) + '</span><span class="karta-rest">' + esc(d.restauracja) + " · " + esc(d.adres) +
          '</span><span class="karta-cena">' + zl(d.cena) + "</span></span></a>";
      }).join("") : '<p class="pusto">Nie znaleźliśmy tego dania w\u00a0tym mieście. Spróbuj: tatar, pizza, sushi, pierogi albo burger.</p>';
      sek.hidden = false;
      if (przewin) sek.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    $("#szukaj-form").addEventListener("submit", function (e) { e.preventDefault(); szukaj(pole.value, true); });
    $$(".podpowiedzi button").forEach(function (b) { b.addEventListener("click", function () { pole.value = b.textContent; szukaj(b.textContent, true); }); });
    podepnijMiasto(function () { licznik(); if (!sek.hidden) szukaj(pole.value, false); });
    licznik();
  }

  /* ---------- KARTA DANIA ---------- */
  function stronaDanie() {
    var p = new URLSearchParams(location.search), wszystkie = Dane.wszystkie();
    var start = wszystkie.filter(function (d) { return d.id === p.get("id"); })[0];
    if (start && start.miasto !== Dane.miasto()) Dane.ustawMiasto(start.miasto);
    var rs, ri = 0, di = 0, foto = $("#foto"), karta = $("#karta");

    function ustaw(miasto, losowo) {
      rs = restauracje(wszystkie, miasto);
      ri = 0; di = 0;
      if (!rs.length) return;
      if (losowo) { ri = Math.floor(Math.random() * rs.length); di = Math.floor(Math.random() * rs[ri].dania.length); }
    }
    ustaw(Dane.miasto(), p.get("los") === "1" || !start);
    if (start && rs.length) {
      rs.forEach(function (r, i) { r.dania.forEach(function (d, j) { if (d.id === start.id) { ri = i; di = j; } }); });
    }

    function pokaz(dx, dy) {
      var pusta = $("#pusta");
      if (!rs.length) { $$(".scena > :not(.s-logo):not(.s-miasto)").forEach(function (el) { el.hidden = true; }); pusta.hidden = false; return; }
      $$(".scena > *").forEach(function (el) { el.hidden = false; }); pusta.hidden = true;
      var r = rs[ri], d = r.dania[di];
      $("#r-nazwa").textContent = d.restauracja;
      $("#d-nazwa").textContent = d.danie;
      $("#d-opis").textContent = d.opis ? "(" + d.opis + ")" : "";
      var img = $("#d-foto"); img.src = d.foto; img.alt = d.danie + ", " + d.restauracja;
      $("#d-cena").textContent = zl(d.cena);
      $("#r-adres").textContent = d.adres;
      $("#lnk-mapa").href = mapsUrl(d);
      var w = $("#lnk-wejdz"); w.href = d.www || "#"; w.dataset.pusty = d.www ? "" : "1";
      $("#licz").textContent = "Danie " + (di + 1) + " z " + r.dania.length + " · Restauracja " + (ri + 1) + " z " + rs.length;
      document.title = d.danie + ", " + d.restauracja + " | VIP Menu";
      try { history.replaceState(null, "", "danie.html?id=" + encodeURIComponent(d.id)); } catch (e) {}
      if ((dx || dy) && karta.animate) {
        karta.animate([{ opacity: 0, transform: "translate(" + dx + "px," + dy + "px)" }, { opacity: 1, transform: "none" }],
          { duration: 280, easing: "cubic-bezier(.2,.7,.2,1)" });
      }
      // podładuj sąsiednie zdjęcia, żeby przewijanie było płynne
      [r.dania[(di + 1) % r.dania.length], rs[(ri + 1) % rs.length].dania[0]].forEach(function (n) { if (n) { var i = new Image(); i.src = n.foto; } });
    }
    function danie(k) { if (!rs.length) return; var n = rs[ri].dania.length; di = (di + k + n) % n; pokaz(k > 0 ? 48 : -48, 0); }
    function rest(k) { if (!rs.length) return; ri = (ri + k + rs.length) % rs.length; di = 0; pokaz(0, k > 0 ? 48 : -48); }

    $(".s-lewo").addEventListener("click", function () { danie(-1); });
    $(".s-prawo").addEventListener("click", function () { danie(1); });
    $(".s-gora").addEventListener("click", function () { rest(-1); });
    $(".s-dol").addEventListener("click", function () { rest(1); });
    $("#lnk-wejdz").addEventListener("click", function (e) {
      if (this.dataset.pusty) { e.preventDefault(); toast("Tu podpina się stronę www albo Facebook restauracji. Link dodaje się w\u00a0panelu."); }
    });
    document.addEventListener("keydown", function (e) {
      if (/INPUT|SELECT|TEXTAREA/.test((e.target || {}).tagName || "")) return;
      var k = { ArrowLeft: function () { danie(-1); }, ArrowRight: function () { danie(1); }, ArrowUp: function () { rest(-1); }, ArrowDown: function () { rest(1); } }[e.key];
      if (k) { e.preventDefault(); k(); }
    });
    // przesuwanie palcem po zdjęciu: w bok = dania, w górę/dół = restauracje
    var x0 = null, y0 = null;
    foto.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    foto.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = y0 = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) return;
      if (Math.abs(dx) > Math.abs(dy)) danie(dx < 0 ? 1 : -1); else rest(dy < 0 ? 1 : -1);
    });
    podepnijMiasto(function (m) { ustaw(m, false); pokaz(0, 24); });
    pokaz(0, 0);
  }

  /* ---------- PANEL STEROWANIA ---------- */
  function stronaPanel() {
    var f = $("#form-dodaj"), foto = null;
    var P = function (id) { return $("#p-" + id); };
    wypelnijMiasta(P("miasto"), Dane.miasto());

    function foldery() { return restauracje(Dane.wszystkie(), null); }
    function odswiezListe() {
      $("#rest-lista").innerHTML = foldery().map(function (r) { return '<option value="' + esc(r.nazwa) + '">'; }).join("");
      var q = norm($("#p-szukaj").value).trim();
      var rs = foldery().filter(function (r) { return !q || norm(r.nazwa).indexOf(q) >= 0; });
      $("#lista").innerHTML = rs.length ? rs.map(function (r) {
        return '<div class="folder"><h3>' + esc(r.nazwa) + "<small>" + esc(r.miasto) + " · " + r.dania.length + " " + odm(r.dania.length, "danie", "dania", "dań") + "</small></h3>" +
          r.dania.map(function (d, i) {
            return '<div class="wiersz"><img src="' + esc(d.foto) + '" alt="" loading="lazy"><span class="nazwa">Danie ' + (i + 1) + ": " + esc(d.danie) + "<small>" + zl(d.cena) + "</small></span>" +
              '<a class="btn-male btn-zobacz" href="danie.html?id=' + encodeURIComponent(d.id) + '">Zobacz</a>' +
              '<button type="button" class="btn-male btn-usun" data-id="' + esc(d.id) + '">Usuń</button></div>';
          }).join("") + "</div>";
      }).join("") : '<p class="pusto">Nie ma restauracji o takiej nazwie.</p>';
      $$(".btn-usun").forEach(function (b) {
        b.addEventListener("click", function () {
          var d = Dane.wszystkie().filter(function (x) { return x.id === b.dataset.id; })[0]; if (!d) return;
          potwierdz("Usunąć tę stronę z portalu?", "„" + d.danie + "” z\u00a0restauracji " + d.restauracja + ". Tej operacji nie da się cofnąć.", function () {
            Dane.zapisz(Dane.wszystkie().filter(function (x) { return x.id !== d.id; }));
            odswiezListe(); toast("Usunięto: " + esc(d.danie));
          });
        });
      });
    }
    // wybór istniejącej restauracji = dopisujemy danie do jej folderu i podpowiadamy jej dane
    P("rest").addEventListener("input", function () {
      var r = foldery().filter(function (x) { return norm(x.nazwa) === norm(P("rest").value); })[0];
      var info = $("#folder-info");
      if (!P("rest").value.trim()) { info.textContent = ""; return; }
      if (r) {
        var d0 = r.dania[0];
        if (!P("adres").value) P("adres").value = d0.adres;
        if (!P("www").value) P("www").value = d0.www || "";
        if (!P("maps").value) P("maps").value = d0.maps || "";
        P("miasto").value = d0.miasto;
        info.textContent = "Folder istnieje, dodasz do niego kolejne danie (teraz ma " + r.dania.length + ").";
      } else info.textContent = "Nowy folder restauracji.";
    });
    // zdjęcie: zmniejszamy w przeglądarce, żeby zmieściło się w pamięci wersji pokazowej
    function wczytajFoto(plik) {
      if (!plik || !/^image\//.test(plik.type)) return;
      var rd = new FileReader();
      rd.onload = function () {
        var im = new Image();
        im.onload = function () {
          var s = Math.min(im.width, im.height), c = document.createElement("canvas"), W = Math.min(900, s);
          c.width = c.height = W;
          c.getContext("2d").drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, W, W);
          foto = c.toDataURL("image/jpeg", 0.8);
          $("#podglad").style.backgroundImage = "url(" + foto + ")"; $("#podglad").textContent = "";
          $("#foto-nazwa").textContent = plik.name; P("foto").closest(".pole").classList.remove("blad");
        };
        im.src = rd.result;
      };
      rd.readAsDataURL(plik);
    }
    var fp = $(".foto-pole");
    P("foto").addEventListener("change", function () { wczytajFoto(this.files[0]); });
    ["dragenter", "dragover"].forEach(function (t) { fp.addEventListener(t, function (e) { e.preventDefault(); fp.classList.add("nad"); }); });
    ["dragleave", "drop"].forEach(function (t) { fp.addEventListener(t, function (e) { e.preventDefault(); fp.classList.remove("nad"); }); });
    fp.addEventListener("drop", function (e) { wczytajFoto(e.dataTransfer.files[0]); });

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["rest", "danie", "adres", "cena"].forEach(function (k) {
        var bad = !P(k).value.trim() || (k === "cena" && !(Number(P(k).value.replace(",", ".")) > 0));
        P(k).closest(".pole").classList.toggle("blad", bad); if (bad) ok = false;
      });
      P("foto").closest(".pole").classList.toggle("blad", !foto); if (!foto) ok = false;
      if (!ok) { toast("Uzupełnij zaznaczone pola."); var b = $(".pole.blad input, .pole.blad"); b && b.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      var d = {
        id: "u" + Date.now(), restauracja: P("rest").value.trim(), danie: P("danie").value.trim(), opis: P("opis").value.trim(),
        cena: Number(P("cena").value.replace(",", ".")), foto: foto, adres: P("adres").value.trim(), miasto: P("miasto").value,
        maps: P("maps").value.trim(), www: P("www").value.trim()
      };
      var lista = Dane.wszystkie(); lista.push(d);
      if (!Dane.zapisz(lista)) { toast("Za mało miejsca w pamięci przeglądarki. W\u00a0wersji pokazowej zmieści się kilkanaście nowych zdjęć."); return; }
      Dane.ustawMiasto(d.miasto);
      // restauracja zostaje w formularzu — łatwo dodać kolejne danie do tego samego folderu
      ["danie", "opis", "cena"].forEach(function (k) { P(k).value = ""; });
      P("foto").value = ""; foto = null; $("#podglad").style.backgroundImage = ""; $("#podglad").textContent = "+"; $("#foto-nazwa").textContent = "Wybierz albo przeciągnij zdjęcie";
      P("rest").dispatchEvent(new Event("input"));
      odswiezListe();
      toast('Dodano „' + esc(d.danie) + '” do VIP MENU. <a href="danie.html?id=' + d.id + '">Zobacz stronę →</a>', 6000);
    });
    $("#p-szukaj-form").addEventListener("submit", function (e) { e.preventDefault(); odswiezListe(); });
    $("#p-szukaj").addEventListener("input", odswiezListe);
    $("#reset").addEventListener("click", function () {
      potwierdz("Przywrócić dane pokazowe?", "Dania dodane w panelu znikną, a\u00a0usunięte wrócą.", function () { Dane.reset(); odswiezListe(); toast("Przywrócono dane pokazowe."); }, "Tak, przywróć");
    });
    odswiezListe();
  }

  wstawIkony();
  var s = document.body.getAttribute("data-strona");
  if (s === "start") stronaStart(); else if (s === "danie") stronaDanie(); else if (s === "panel") stronaPanel();

  /* === licznik otwarć demo (buy-signal) v3 — geo po stronie serwera === */
  (function(){try{if(String(location.protocol).indexOf('http')!==0)return;try{if(/[?&#]team=1/.test(location.search+location.hash)){localStorage.setItem('nb_team','1');}}catch(e){}try{if(localStorage.getItem('nb_team')==='1')return;}catch(e){}if(/crm-newbeginning|crm\.impulseo\.pl/.test(document.referrer||''))return;try{if(navigator.webdriver)return;}catch(e){}try{if(/^https?:\/\/(kris20032|impulseo-pl)\.github\.io\/?$/i.test(document.referrer||''))return;}catch(e){}if(sessionStorage.getItem('_dv'))return;sessionStorage.setItem('_dv','1');var seg=(location.pathname.split('/').filter(Boolean)[0])||'';var base=location.origin+(seg?('/'+seg):'');var ua='';try{ua=(navigator.userAgent||'').slice(0,300);}catch(e){}var EP='https://zngfubfinbojfgaxdrbf.supabase.co/functions/v1/demo-view';try{fetch(EP,{method:'POST',keepalive:true,headers:{'Content-Type':'text/plain'},body:JSON.stringify({demo_url:base,page:location.pathname,referrer:(document.referrer||null),user_agent:(ua||null)})}).catch(function(){});}catch(e){}}catch(e){}})();
})();
