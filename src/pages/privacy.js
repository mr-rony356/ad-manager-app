import React from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
    },
  };
}

function Privacy() {
  return (
    <>
      <Head>
        <title>Datenschutzerklärung | Onlyfriend.ch</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Entdecken Sie auf unserer Webseite erotische Anzeigen für Sexkontake und Onlyfans Accounts in der Schweiz. Treffen Sie heiße Girls in Ihrer Nähe und erleben Sie prickelnde Abenteuer. Ohne Anmeldung können Sie direkt mit den Girls in Kontakt kommen."
        />
        <meta
          name="keywords"
          content="Erotische Anzeigen, Sex in Zürich, Blowjob in Zürich, Escort in Zürich, Gangbang in Zürich, Girlfriend Sex in Zürich, Striptease in Zürich, Sex in Aargau, Blowjob in Aargau, Escort in Aargau, Gangbang in Aargau, Girlfriend Sex in Aargau, Striptease in Aargau, Sex in Luzern, Blowjob in Luzern, Escort in Luzern, Gangbang in Luzern, Girlfriend Sex in Luzern, Striptease in Bern, Sex in Bern, Blowjob in Bern, Escort in Bern, Gangbang in Bern, Girlfriend Sex in Bern, Striptease in Bern, Sex in Basel, Blowjob in Basel, Escort in Basel, Gangbang in Basel, Girlfriend Sex in Basel, Striptease in Basel, Junge Frauen, Sexy Latinas, Escort, Sexy Studentin, Milf, Sextreffen, Webcam, Sexchat, Sexting, Cam2Cam, Erotik-Kleinanzeigen, Sexkontakte, Begleitservice, Callgirls, Escortservice, Erotische Massagen, Fetisch-Anzeigen, BDSM-Kontakte, Sexpartys, Swinger-Kontakte, Erotikjobs, Erotik-Shops, Webcam-Shows, Adult-Dating, Dominas, Bordell-Inserate, Stripper-Inserate, TS-Inserate, Onlyfans, Onlyfriends,"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div className="info">
        <h1>Datenschutzerklärung</h1>
        <p className="info__text">
          Mit dieser Datenschutzerklärung informieren wir, welche Personendaten
          wir im Zusammenhang mit unserem onlyfriends-Portal und unserem
          sonstigen Online-Angebot wie, wo und wofür bearbeiten. Wir informieren
          mit dieser Datenschutzerklärung ausserdem über die Rechte von
          Personen, deren Daten wir bearbeiten. Für einzelne oder zusätzliche
          Angebote und Leistungen können besondere, ergänzende oder weitere
          Datenschutzerklärungen sowie sonstige rechtliche Dokumente wie
          Allgemeine Geschäftsbedingungen (AGB), Nutzungsbedingungen oder
          Teilnahmebedingungen gelten. Unser Online-Angebot unterliegt dem
          schweizerischen Datenschutzrecht sowie allenfalls anwendbarem
          ausländischem Datenschutzrecht wie insbesondere jenem der Europäischen
          Union (EU) mit der Datenschutz-Grundverordnung (DSGVO). Die
          Europäische Kommission anerkennt, dass das schweizerische
          Datenschutzrecht einen angemessenen Datenschutz gewährleistet.
        </p>
        <ol>
          <li className="info__title">Kontaktadressen</li>
          <div>
            <p style={{ marginBottom: "0.5em" }}>
              Verantwortung für das Online-Angebot:
            </p>
            <h3>Vision Digital Consulting klg </h3>
            <p className="info__text">Schützenstrasse 23</p>
            <p className="info__text">8953 Dietikon</p>
            <p style={{ marginTop: "0.5em", marginBottom: "1em" }}>
              support@onlyfriend.ch
            </p>
          </div>
          <li className="info__title">Bearbeitung von Personendaten</li>
          <ol className="info__section">
            <ol className="info__subsection">
              <li className="info__text">Begriffe</li>
              <p className="info__text">
                Personendaten sind alle Angaben, die sich auf eine bestimmte
                oder bestimmbare Person beziehen. Eine betroffene Person ist
                eine Person, über die Personendaten bearbeitet werden.
                Bearbeiten umfasst jeden Umgang mit Personendaten, unabhängig
                von den angewandten Mitteln und Verfahren, insbesondere das
                Aufbewahren, Bekanntgeben, Beschaffen, Erheben, Löschen,
                Speichern, Verändern, Vernichten und Verwenden von
                Personendaten. Der Europäische Wirtschaftsraum (EWR) umfasst die
                Europäische Union (EU) sowie das Fürstentum Liechtenstein,
                Island und Norwegen. Die Datenschutz-Grundverordnung (DSGVO)
                bezeichnet die Bearbeitung von Personendaten als Verarbeitung
                von personenbezogenen Daten.
              </p>

              <li className="info__text">Rechtsgrundlagen</li>
              <p className="info__text">
                Wir bearbeiten Personendaten im Einklang mit dem schweizerischen
                Datenschutzrecht wie insbesondere dem Bundesgesetz über den
                Datenschutz (DSG) und der Verordnung zum Bundesgesetz über den
                Datenschutz (VDSG).
              </p>
              <p className="info__text">
                Wir bearbeiten – sofern und soweit die
                Datenschutz-Grundverordnung (DSGVO) anwendbar ist –
                Personendaten gemäss mindestens einer der folgenden
                Rechtsgrundlagen:
              </p>
              <ul className="info__subsection">
                <li className="info__text">
                  Art. 6 Abs. 1 lit. b DSGVO für die erforderliche Bearbeitung
                  von Personendaten zur Erfüllung eines Vertrages mit der
                  betroffenen Person sowie zur Durchführung vorvertraglicher
                  Massnahmen.
                </li>
                <li className="info__text">
                  Art. 6 Abs. 1 lit. f DSGVO für die erforderliche Bearbeitung
                  von Personendaten, um die berechtigten Interessen von uns oder
                  von Dritten zu wahren, sofern nicht die Grundfreiheiten und
                  Grundrechte sowie Interessen der betroffenen Person
                  überwiegen. Berechtigte Interessen sind insbesondere unser
                  Interesse, unser Online-Angebot dauerhaft, nutzerfreundlich,
                  sicher und zuverlässig bereitstellen sowie dafür bei Bedarf
                  werben zu können, die Informationssicherheit sowie der Schutz
                  vor Missbrauch und unbefugter Nutzung, die Durchsetzung von
                  eigenen rechtlichen Ansprüchen und die Einhaltung von
                  schweizerischem Recht.
                </li>
                <li className="info__text">
                  Art. 6 Abs. 1 lit. c DSGVO für die erforderliche Bearbeitung
                  von Personendaten zur Erfüllung einer rechtlichen
                  Verpflichtung, der wir gemäss allenfalls anwendbarem Recht von
                  Mitgliedstaaten im Europäischen Wirtschaftsraum (EWR)
                  unterliegen.
                </li>
                <li className="info__text">
                  Art. 6 Abs. 1 lit. e DSGVO für die erforderliche Bearbeitung
                  von Personendaten zur Wahrnehmung einer Aufgabe, die im
                  öffentlichen Interesse liegt.
                </li>
                <li className="info__text">
                  Art. 6 Abs. 1 lit. a DSGVO für die Bearbeitung von
                  Personendaten mit Einwilligung der betroffenen Person.
                </li>
                <li className="info__text">
                  Art. 6 Abs. 1 lit. d DSGVO für die erforderliche Bearbeitung
                  von Personendaten, um lebenswichtige Interessen der
                  betroffenen Person oder einer anderen natürlichen Person zu
                  schützen.
                </li>
              </ul>

              <li className="info__text">Art, Umfang und Zweck</li>
              <p className="info__text">
                Wir bearbeiten jene Personendaten, die erforderlich sind, um
                unser Online-Angebot dauerhaft, nutzerfreundlich, sicher und
                zuverlässig bereitstellen zu können. Solche Personendaten können
                in die Kategorien von Bestandes- und Kontaktdaten, Browser- und
                Gerätedaten, Inhaltsdaten, Meta- beziehungsweise Randdaten und
                Nutzungsdaten, Standortdaten, Verkaufs-, Vertrags- und
                Zahlungsdaten fallen.
              </p>
              <p className="info__text">
                Wir bearbeiten Personendaten während jener Dauer, die für den
                jeweiligen Zweck beziehungsweise die jeweiligen Zwecke oder
                gesetzlich erforderlich ist. Personendaten, deren Bearbeitung
                nicht mehr erforderlich ist, werden anonymisiert oder gelöscht.
                Personen, deren Daten wir bearbeiten, haben grundsätzlich ein
                Recht auf Löschung.
              </p>
              <p className="info__text">
                Wir bearbeiten Personendaten grundsätzlich nur nach Einwilligung
                der betroffenen Person, es sei denn, die Bearbeitung ist aus
                anderen rechtlichen Gründen zulässig, beispielsweise zur
                Erfüllung eines Vertrages mit der betroffenen Person und für
                entsprechende vorvertragliche Massnahmen, um unsere
                überwiegenden berechtigten Interessen zu wahren, weil die
                Bearbeitung aus den Umständen ersichtlich ist oder nach
                vorgängiger Information.
              </p>
              <p className="info__text">
                In diesem Rahmen bearbeiten wir insbesondere Angaben, die eine
                betroffene Person bei der Kontaktaufnahme – beispielsweise per
                Briefpost, E-Mail, Kontaktformular, Social Media oder Telefon –
                oder bei der Registrierung für ein Nutzerkonto freiwillig und
                selbst an uns übermittelt. Wir können solche Angaben
                beispielsweise in einem Adressbuch, in einem Customer
                Relationship Management-System (CRM-System) oder mit
                vergleichbaren Hilfsmitteln speichern. Sofern Sie Personendaten
                über Dritte an uns übermitteln, sind Sie verpflichtet, den
                Datenschutz gegenüber solchen Dritten zu gewährleisten sowie die
                Richtigkeit solcher Personendaten sicherzustellen.
              </p>
              <p className="info__text">
                Wir bearbeiten ausserdem Personendaten, die wir von Dritten
                erhalten, aus öffentlich zugänglichen Quellen beschaffen oder
                bei der Bereitstellung unseres Online-Angebotes erheben, sofern
                und soweit eine solche Bearbeitung aus rechtlichen Gründen
                zulässig ist.
              </p>

              <li className="info__text">
                Bearbeitung von Personendaten durch Dritte, auch im Ausland
              </li>
              <p className="info__text">
                Wir können Personendaten durch beauftragte Dritte bearbeiten
                lassen oder gemeinsam mit Dritten sowie mit Hilfe von Dritten
                bearbeiten oder an Dritte übermitteln. Bei solchen Dritten
                handelt es sich insbesondere um Anbieter, deren Leistungen wir
                in Anspruch nehmen. Wir gewährleisten auch bei solchen Dritten
                einen angemessenen Datenschutz.
              </p>
              <p className="info__text">
                Solche Dritte befinden sich grundsätzlich in der Schweiz sowie
                im Europäischen Wirtschaftsraum (EWR). Solche Dritte können sich
                aber auch in sonstigen Staaten und Territorien auf der Erde
                sowie anderswo im Universum befinden, sofern deren
                Datenschutzrecht nach Einschätzung des Eidgenössischen
                Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) und – sofern
                und soweit die Datenschutz-Grundverordnung (DSGVO) anwendbar ist
                – nach Einschätzung der Europäischen Kommission – einen
                angemessenen Datenschutz gewährleistet, oder wenn aus anderen
                Gründen, wie beispielsweise durch eine entsprechende
                vertragliche Vereinbarung, insbesondere auf Grundlage von
                Standardvertragsklauseln, oder durch eine entsprechende
                Zertifizierung, ein angemessener Datenschutz gewährleistet ist.
                Bei Dritten in den Vereinigten Staaten von Amerika (USA) kann
                die Zertifizierung gemäss dem Privacy Shield einen angemessenen
                Datenschutz gewährleisten. Ausnahmsweise kann sich ein solcher
                Dritter in einem Land ohne angemessenen Datenschutz befinden,
                sofern dafür die datenschutzrechtlichen Voraussetzungen wie
                beispielsweise die ausdrückliche Einwilligung der betroffenen
                Person erfüllt werden.
              </p>
            </ol>
            <li className="info__title">Rechte von betroffenen Personen</li>
            <p className="info__text">
              Betroffene Personen, deren Personendaten wir bearbeiten, verfügen
              über die Rechte gemäss schweizerischem Datenschutzrecht. Dazu
              zählen das Recht auf Auskunft sowie das Recht auf Berichtigung,
              Löschung oder Sperrung der bearbeiteten Personendaten.
            </p>
            <p className="info__text">
              Betroffene Personen, deren Personendaten wir bearbeiten, können –
              sofern und soweit die Datenschutz-Grundverordnung (DSGVO)
              anwendbar ist – unentgeltlich eine Bestätigung, ob wir ihre
              Personendaten bearbeiten und, falls ja, Auskunft über die
              Bearbeitung ihrer Personendaten verlangen, die Bearbeitung ihrer
              Personendaten einschränken lassen, ihr Recht auf
              Datenübertragbarkeit wahrnehmen sowie ihre Personendaten
              berichtigen, löschen («Recht auf Vergessen»), sperren oder
              vervollständigen lassen.
            </p>
            <p className="info__text">
              Betroffene Personen, deren Personendaten wir bearbeiten, können –
              sofern und soweit die DSGVO anwendbar ist – eine erteilte
              Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen und
              jederzeit Widerspruch gegen die Bearbeitung ihrer Personendaten
              erheben.
            </p>
            <p className="info__text">
              Betroffene Personen, deren Personendaten wir bearbeiten, verfügen
              über ein Beschwerderecht bei einer zuständigen Aufsichtsbehörde.
              Aufsichtsbehörde für den Datenschutz in der Schweiz ist der
              Eidgenössische Datenschutz- und Öffentlichkeitsbeauftragte (EDÖB).
            </p>
            <li className="info__title">Datensicherheit</li>
            <p className="info__text">
              Wir treffen angemessene sowie geeignete technische und
              organisatorische Massnahmen, um den Datenschutz und insbesondere
              die Datensicherheit zu gewährleisten. Allerdings kann die
              Bearbeitung von Personendaten im Internet trotz solchen Massnahmen
              immer Sicherheitslücken aufweisen. Wir können deshalb keine
              absolute Datensicherheit gewährleisten.
            </p>
            <p className="info__text">
              Der Zugriff auf unser Online-Angebot erfolgt mittels
              Transportverschlüsselung (SSL / TLS, insbesondere mit dem
              Hypertext Transfer Protocol Secure, abgekürzt HTTPS). Die meisten
              Browser kennzeichnen Transportverschlüsselung mit einem
              Vorhängeschloss in der Adressleiste.
            </p>
            <p className="info__text">
              Der Zugriff auf unser Online-Angebot unterliegt – wie
              grundsätzlich jede Internet-Nutzung – der anlasslosen und
              verdachtsunabhängigen Massenüberwachung sowie sonstigen
              Überwachung durch Sicherheitsbehörden in der Schweiz, in der
              Europäischen Union (EU), in den Vereinigten Staaten von Amerika
              (USA) und in anderen Staaten. Wir können keinen direkten Einfluss
              auf die entsprechende Bearbeitung von Personendaten durch
              Geheimdienste, Polizeistellen und andere Sicherheitsbehörden
              nehmen.
            </p>
            <li className="info__title">Nutzung der Website</li>
            <ol>
              <li className="info__text">Cookies</li>
              <p className="info__text">
                Wir können Cookies für unsere Website verwenden. Bei Cookies –
                bei eigenen Cookies (First-Party-Cookies) als auch bei Cookies
                von Dritten, deren Dienste wir nutzen (Cookies von Dritten
                beziehungsweise Third-Party-Cookies) – handelt es sich um Daten
                in Textform, die in Ihrem Browser gespeichert werden. Cookies
                können keine Programme ausführen oder Schadsoftware wie Trojaner
                und Viren übertragen.
              </p>
              <p className="info__text">
                Cookies können beim Besuch unserer Website in Ihrem Browser
                temporär als «Session Cookies» oder für einen bestimmten
                Zeitraum als sogenannt permanente Cookies gespeichert werden.
                «Session Cookies» werden automatisch gelöscht, wenn Sie Ihren
                Browser schliessen. Permanente Cookies ermöglichen insbesondere,
                Ihren Browser beim nächsten Besuch unserer Website
                wiederzuerkennen und dadurch beispielsweise die Reichweite
                unserer Website zu messen. Permanente Cookies können aber
                beispielsweise auch für Online-Marketing verwendet werden.
              </p>
              <p className="info__text">
                Sie können Cookies in Ihren Browser-Einstellungen jederzeit ganz
                oder teilweise deaktivieren sowie löschen. Ohne Cookies steht
                unser Online-Angebot allenfalls nicht mehr in vollem Umfang zur
                Verfügung. Wir ersuchen Sie – sofern und soweit erforderlich –
                aktiv um Ihre ausdrückliche Einwilligung für die Verwendung von
                Cookies.
              </p>
              <p className="info__text">
                Bei Cookies, die für die Erfolgs- und Reichweitenmessung oder
                für Werbung verwendet werden, ist für zahlreiche Dienste ein
                allgemeiner Widerspruch («Opt-out») über die Network Advertising
                Initiative (NAI), YourAdChoices (Digital Advertising Alliance)
                oder Your Online Choices (European Interactive Digital
                Advertising Alliance, EDAA) möglich.
              </p>

              <li className="info__text">Server-Logdateien</li>
              <p className="info__text">
                Wir können für jeden Zugriff auf unsere Website nachfolgende
                Angaben erfassen, sofern diese von Ihrem Browser an unsere
                Server-Infrastruktur übermittelt werden oder von unserem
                Webserver ermittelt werden können: Datum und Zeit
                einschliesslich Zeitzone, Internet Protocol (IP)-Adresse,
                Zugriffsstatus (HTTP-Statuscode), Betriebssystem einschliesslich
                Benutzeroberfläche und Version, Browser einschliesslich Sprache
                und Version, aufgerufene einzelne Unter-Seite unserer Website
                einschliesslich übertragener Datenmenge, zuletzt im gleichen
                Browser-Fenster aufgerufene Webseite (Referer beziehungsweise
                Referrer).
              </p>
              <p className="info__text">
                Wir speichern solche Angaben, die auch Personendaten darstellen
                können, in Server-Logdateien. Die Angaben sind erforderlich, um
                unser Online-Angebot dauerhaft, nutzerfreundlich und zuverlässig
                bereitstellen sowie um die Datensicherheit und damit
                insbesondere den Schutz von Personendaten sicherstellen zu
                können – auch durch Dritte oder mit Hilfe von Dritten.
              </p>

              <li className="info__text">Zählpixel</li>
              <p className="info__text">
                Wir können Zählpixel auf unserer Website verwenden. Zählpixel
                werden auch als Web-Beacons bezeichnet. Bei Zählpixeln – auch
                von Dritten, deren Dienste wir nutzen – handelt es sich um
                kleine, üblicherweise nicht sichtbare Bilder, die beim Besuch
                unserer Website automatisch abgerufen werden. Mit Zählpixeln
                können die gleichen Angaben wie in Server-Logdateien erfasst
                werden.
              </p>
            </ol>
            <li className="info__title">Benachrichtigungen und Mitteilungen</li>
            <p className="info__text">
              Wir versenden Benachrichtigungen und Mitteilungen wie
              beispielsweise Newsletter per E-Mail und über andere
              Kommunikationskanäle wie beispielsweise Instant Messaging.
            </p>
            <ol>
              <li className="info__text">Einwilligung und Widerspruch</li>
              <p className="info__text">
                Sie müssen grundsätzlich in die Verwendung Ihrer E-Mail-Adresse
                und Ihrer sonstigen Kontaktadressen ausdrücklich einwilligen, es
                sei denn, die Verwendung ist aus anderen rechtlichen Gründen
                zulässig. Für eine allfällige Einwilligung für den Erhalt von
                E-Mails verwenden wir nach Möglichkeit das «Double
                Opt-in»-Verfahren, das heisst Sie erhalten eine E-Mail mit einem
                Weblink, den Sie zur Bestätigung anklicken müssen, damit kein
                Missbrauch durch unberechtigte Dritte erfolgen kann. Wir können
                solche Einwilligungen einschliesslich Internet Protocol
                (IP)-Adresse sowie Datum und Zeit aus Beweis- und
                Sicherheitsgründen protokollieren.
              </p>
              <p className="info__text">
                Sie können sich grundsätzlich jederzeit von Benachrichtigungen
                und Mitteilungen wie beispielsweise Newslettern abmelden.
                Vorbehalten bleiben Benachrichtigungen und Mitteilungen, die für
                unser Online-Angebot zwingend erforderlich sind. Mit der
                Abmeldung können Sie insbesondere der statistischen Erfassung
                der Nutzung für die Erfolgs- und Reichweitenmessung
                widersprechen.
              </p>

              <li className="info__text">
                Erfolgsmessung- und Reichweitenmessung
              </li>
              <p className="info__text">
                Benachrichtigungen und Mitteilungen können Weblinks oder
                Zählpixel enthalten, die erfassen, ob eine einzelne Mitteilung
                geöffnet wurde und welche Weblinks dabei angeklickt wurden.
                Solche Weblinks und Zählpixel können die Nutzung von
                Benachrichtigungen und Mitteilungen auch personenbezogen
                erfassen. Wir benötigen diese statistische Erfassung der Nutzung
                für die Erfolgs- und Reichweitenmessung, um Benachrichtigungen
                und Mitteilungen aufgrund der Bedürfnisse und Lesegewohnheiten
                der Empfängerinnen und Empfänger effektiv und nutzerfreundlich
                sowie dauerhaft, sicher und zuverlässig anbieten zu können
              </p>

              <li className="info__text">
                Dienstleister für Benachrichtigungen und Mitteilungen
              </li>
              <p className="info__text">
                Wir versenden Benachrichtigungen und Mitteilungen über Dienste
                von Dritten oder mit Hilfe von Dienstleistern. Dabei können auch
                Cookies zum Einsatz kommen. Wir gewährleisten auch bei solchen
                Diensten einen angemessenen Datenschutz.
              </p>
            </ol>
            <li className="info__title">Dienste von Dritten</li>
            <p className="info__text">
              Wir verwenden Dienste von Dritten, um unser Online-Angebot
              dauerhaft, nutzerfreundlich, sicher und zuverlässig bereitstellen
              zu können. Solche Dienste dienen auch dazu, Inhalte in unser
              Online-Angebot einbetten zu können. Solche Dienste –
              beispielsweise Hosting- und Speicherdienste, Video-Dienste und
              Zahlungsdienste – benötigen Ihre Internet Protocol (IP)-Adresse,
              da solche Dienste die entsprechenden Inhalte ansonsten nicht
              übermitteln können. Solche Dienste können sich ausserhalb der
              Schweiz und des Europäischen Wirtschaftsraumes (EWR) befinden,
              sofern ein angemessener Datenschutz gewährleistet ist. Für ihre
              eigenen sicherheitsrelevanten, statistischen und technischen
              Zwecke können Dritte, deren Dienste wir nutzen, auch Daten im
              Zusammenhang mit unserem Online-Angebot sowie aus anderen Quellen
              – unter anderem mit Cookies, Logdateien und Zählpixeln –
              aggregiert, anonymisiert oder pseudonymisiert bearbeiten.
            </p>
            <ol>
              <li>
                Schriftarten
                <p className="info__text">
                  Wir verwenden Google Fonts, um ausgewählte Schriftarten in
                  unsere Website einbetten zu können. Dabei kommen keine Cookies
                  zum Einsatz. Es handelt sich um einen Dienst der
                  amerikanischen Google LLC, der unabhängig von anderen
                  Google-Diensten angeboten wird. Für Nutzerinnen und Nutzer im
                  Europäischen Wirtschaftsraum (EWR) und in der Schweiz ist die
                  irische Google Ireland Limited verantwortlich. Weitere Angaben
                  über Art, Umfang und Zweck der Datenbearbeitung finden sich in
                  den Grundsätzen für Datenschutz und Sicherheit sowie in der
                  Datenschutzerklärung von Google.
                </p>
              </li>
              <li>
                Zahlungen
                <p className="info__text">
                  Wir verwenden Zahlungsdienstleister, um Zahlungen unserer
                  Kundinnen und Kunden sicher und zuverlässig abwickeln zu
                  können. Wir verwenden nur Zahlungsdienstleister, bei denen ein
                  angemessener Datenschutz gewährleistet ist. Für die Abwicklung
                  gelten jeweils die Bedingungen der betreffenden
                  Zahlungsdienstleister wie beispielsweise Allgemeine
                  Geschäftsbedingungen (AGB) oder Datenschutzerklärungen.
                </p>
              </li>
              <li>
                Erfolgs- und Reichweitenmessung
                <p className="info__text">
                  Google Analytics Wir verwenden Google Analytics, um zu
                  analysieren, wie unsere Website genutzt wird, wobei wir
                  beispielsweise auch die Reichweite unserer Website und den
                  Erfolg von Verlinkungen Dritter auf unsere Website messen
                  können. Es handelt sich um einen Dienst der amerikanischen
                  Google LLC. Für Nutzerinnen und Nutzer im Europäischen
                  Wirtschaftsraum (EWR) und in der Schweiz ist die irische
                  Google Ireland Limited verantwortlich.
                </p>
                <p className="info__text">
                  Google versucht einzelne Besucherinnen und Besucher unserer
                  Website auch zu erfassen, wenn sie verschiedene Browser oder
                  Geräte nutzen (Cross-Device Tracking). Dabei kommen auch
                  Cookies zum Einsatz. Für Google Analytics wird Ihre Internet
                  Protocol (IP)-Adresse benötigt, die aber nicht mit anderen
                  Daten von Google zusammengeführt wird.
                </p>
                <p className="info__text">
                  In jedem Fall lassen wir Ihre Internet Protocol (IP)-Adresse
                  vor der Analyse durch Google anonymisieren. Im Ergebnis wird
                  Ihre vollständige IP-Adresse grundsätzlich nicht an Google in
                  den USA übertragen.
                </p>
                <p className="info__text">
                  Weitere Angaben über Art, Umfang und Zweck der
                  Datenbearbeitung finden sich in den Grundsätzen für
                  Datenschutz und Sicherheit und in der Datenschutzerklärung
                  jeweils von Google, im Leitfaden zum Datenschutz in
                  Google-Produkten (einschliesslich Google Analytics), in den
                  Informationen, wie Google Daten von Websites verwendet, auf
                  denen Google-Dienste genutzt werden und in den Informationen
                  über Cookies bei Google. Ausserdem besteht die Möglichkeit,
                  das «Browser Add-on zur Deaktivierung von Google Analytics» zu
                  verwenden sowie Widerspruch gegen personalisierte Werbung zu
                  erheben.
                </p>
              </li>
            </ol>
            <li className="info__title">Schlussbestimmungen</li>
            <p className="info__text">
              Wir können diese Datenschutzerklärung jederzeit anpassen und
              ergänzen. Wir werden über solche Anpassungen und Ergänzungen in
              geeigneter Form informieren, insbesondere durch Veröffentlichung
              der jeweils aktuellen Datenschutzerklärung auf unserer Website.
            </p>
          </ol>
        </ol>
      </div>
    </>
  );
}

export default Privacy;
