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

const AGB = () => {
  return (
    <>
      <Head>
        <title>
          Erotische Anzeigen für Sexkontakte und Onlyfans Accounts in der
          Schweiz - Die besten Sex & Erotik Anzeigen der Schweiz: Für jeden
          Geschmack! onlyfriend.ch ▷ Das Schweizer Sex & Erotik Inserate Portal.
        </title>
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

      <div className="info page">
        <h1>AGB</h1>
        <p className="info__date">Stand: 1. Januar 2023 </p>
        <p>
          onlyfriends ist ein Sex-Portal in der Schweiz für die Veröffentlichung
          von Inseraten und sonstiger Werbung (nachfolgend das «Portal»).
          Betreiberin der Plattform ist die schweizerische OF Digital Solutions
          klg (nachfolgend die «Betreiberin»). Diese Allgemeinen
          Geschäftsbedingungen (AGB) regeln die Rechte und Pflichten sowohl der
          Betreiberin als auch der Portal-Nutzerinnen und -Nutzer (nachfolgend
          einheitlich die «Nutzer»). Für einzelne oder zusätzliche Funktionen
          und Leistungen können ergänzende oder weitere Bedingungen und sonstige
          rechtliche Dokumente bestehen. Informationen zum Datenschutz finden
          sich in der Datenschutzerklärung.
        </p>
        <ol>
          <li className="info__title">
            Funktionen und Leistungen von onlyfriend.ch
          </li>
          <ol className="info__section">
            <li className="info__text">
              Das Portal richtet sich einerseits an Nutzer, die Inserate und
              sonstige Werbung (nachfolgend gemeinsam die «Inserate») für
              Dienstleistungen, die sie eigenständig und unabhängig vom Portal
              anbieten und erbringen (nachfolgend die «Dienstleistungen»),
              erfassen und veröffentlichen möchten (nachfolgend einheitlich die
              «Inserenten»). Das Portal richtet sich andererseits an Nutzer,
              welche das Portal besuchen, um Inserate für Dienstleistungen
              abrufen und Inserenten kontaktieren zu können (nachfolgend
              einheitlich die «Besucher»).
            </li>
            <li className="info__text">
              Die Betreiberin ist im Zusammenhang mit Dienstleistungen weder
              Vertragspartei noch Vertreterin von Nutzern. Die Betreiberin
              übernimmt keine Gewähr dafür, dass Nutzer allfälligen
              untereinander bestehenden vertraglichen und sonstigen rechtlichen
              Verpflichtungen nachkommen. Die Abwicklung und / oder Durchsetzung
              von Verträgen obliegt allein den beteiligten Nutzern.
            </li>
            <li className="info__text">
              Die Nutzer, das heisst Inserenten und Besucher, kommunizieren
              direkt und in eigener Verantwortung, insbesondere über
              veröffentlichte Kontaktadressen. Die Nutzer schliessen allfällige
              Verträge im Zusammenhang mit Dienstleistungen in eigener
              Verantwortung. Aus allfälligen Verträgen zwischen Nutzern sowie
              aus einem allfälligen vorvertraglichen Austausch werden
              ausschliesslich der beteiligten Nutzer verpflichtet. Die
              Vertragserfüllung liegt ausschliesslich in der Verantwortung der
              beteiligten Nutzer. Angaben, Benachrichtigungen und sonstige
              Inhalte auf dem Portal dienen ausschliesslich der Information der
              betreffenden Nutzer.
            </li>
            <li className="info__text">
              Die Betreiberin ist nicht verpflichtet, das Verhalten von Nutzern
              auf dem Portal zu kontrollieren. Die Betreiberin ist insbesondere
              nicht verpflichtet, Inserate und sonstige Inhalte von Nutzern
              vorsorglich auf ihre Rechtmässigkeit oder sonstige Zulässigkeit zu
              überprüfen. Die Betreiberin übernimmt keinerlei Gewähr für
              Inserate sowie sonstige Inhalte von Nutzern. Im Zweifelsfall sind
              Nutzer verpflichtet, Inserate und sonstige Inhalte von anderen
              Nutzern selbst zu überprüfen.
            </li>
            <li className="info__text">
              Die Betreiberin stellt den Nutzern das Portal auf Zusehen hin zur
              Verfügung. Die Betreiberin kann Funktionen und Leistungen auf dem
              Portal kostenlos oder kostenpflichtig anbieten. Der jeweils
              aktuelle Funktions- und Leistungsumfang sowie allfällige Gebühren
              und sonstige Kosten sind in Form von Preislisten und sonstigen
              Informationen auf dem Portal ersichtlich. Die Betreiberin ist
              berechtigt, die angebotenen Funktionen und Leistungen sowie
              allfällige Gebühren und sonstigen Kosten jederzeit anzupassen. Die
              Betreiberin kann Nutzern ermöglichen, Credits zu erwerben und
              anderweitig über ein Guthaben zu verfügen, um kostenpflichtige
              Funktionen und Leistungen bezahlen zu können.
            </li>
            <li className="info__text">
              Die Betreiberin ist berechtigt, den Nutzern Mitteilungen per
              Instant Messaging, SMS und über sonstige Kommunikationskanäle zu
              senden. Solche Mitteilungen können auch Werbung enthalten. Nutzer
              können dem Empfang von Mitteilungen, die Werbung enthalten, bei
              jeder empfangenen Mitteilung für die Zukunft widersprechen
              («Opt-out»).
            </li>
          </ol>
          <li className="info__title">
            Inserate und sonstige Inhalte bei onlyfriend.ch
          </li>
          <ol className="info__section">
            <li className="info__text">
              Die Betreiberin kann die Veröffentlichung von Inseraten und
              sonstigen Inhalten jederzeit ohne Angabe von Gründen ablehnen. Die
              Betreiberin darf Inserate mit Metadaten anreichern und ist
              berechtigt, Inserate jederzeit nach eigenem Ermessen und ohne
              Rücksprache anzupassen, insbesondere um Erscheinungsbild,
              Formatierung oder Lesbarkeit zu verbessern.
            </li>
            <li className="info__text">
              Mit der Erfassung von Inseraten und sonstigen Inhalten erklären
              Nutzer ihr Einverständnis zur Veröffentlichung auf dem Portal und
              über allfällige weitere Kommunikations- beziehungsweise
              Publikationskanäle der Betreiberin. Die Veröffentlichung umfasst
              auch Kontaktadressen, damit Besucher den Kontakt aufnehmen können.
              Nutzer gewähren der Betreiberin ein nicht ausschliessliches,
              örtlich und zeitlich unbeschränktes, übertragbares und
              unterlizenzierbares Nutzungsrecht an den erfassten Inhalten
              einschliesslich marken- und urheberechtlich geschützten Inhalten.
            </li>
            <li className="info__text">
              Die Betreiberin haftet nicht für Inserate, die nicht oder
              fehlerhaft veröffentlicht werden. Inserenten sind verpflichtet,
              die Betreiberin auf nicht oder fehlerhafte veröffentlichte
              Inserate hinzuweisen, damit die Betreiberin geeignete Massnahmen
              ergreifen kann.
            </li>
            <li className="info__text">
              Inserenten verpflichten sich, die Aktualität, Qualität,
              Richtigkeit und Vollständigkeit von Inseraten zu gewährleisten.
              Inserate dürfen sich insbesondere nur auf Dienstleistungen
              beziehen, die von Inserenten tatsächlich erbracht werden.
              Inserenten tragen die alleinige Verantwortung für sämtliche
              Inhalte von Inseraten. Inserate, die nicht mehr aktuell sind,
              müssen von Inserenten unverzüglich gelöscht werden.
            </li>
            <li className="info__text">
              Nutzer verpflichten sich weiter, keine Inhalte zu erfassen, die
              falsche, irreführende oder mangelhafte Angaben oder – sowohl
              direkt als auch indirekt – Werbung für vergleichbare Betreiber wie
              die Betreiberin und vergleichbare Portale wie das Portal
              enthalten. Die Erfassung von Inhalten im Zusammenhang mit
              Arbeitsvermittlung, Geldspielen, Heimarbeiten, Netzwerk-Marketing,
              Personalverleih, Schneeballsystemen, Schenkkreisen oder
              Stelleninseraten ist untersagt. Weiter ist die Erfassung von
              Inhalten, die Immaterialgüterrechte, Persönlichkeitsrechte oder
              sonstige Rechte Dritter verletzen untersagt.
            </li>
            <li className="info__text">
              Nutzer verpflichten sich, ausschliesslich Inserate und sonstige
              Inhalte zu erfassen, die rechtskonform sind. Nutzer verpflichten
              sich insbesondere, keine diskriminierenden,
              persönlichkeitsverletzenden, rassistischen, schädlichen,
              strafbaren, unlauteren oder unsicheren Inhalte zu veröffentlichen.
              Inserate und sonstige Inhalte, die Geschlechtsteile,
              Gewaltdarstellungen oder menschliche Ausscheidungen zeigen oder
              anderweitig bewerben, sind untersagt. Inserate und sonstige
              Inhalte, die sexuelle Handlungen mit Minderjährigen – auch mit
              scheinbar Minderjährigen und mit Minderjährigen in virtueller Form
              – oder Tieren sowie ungeschützten Geschlechtsverkehr zeigen oder
              anderweitig bewerben, sind untersagt. Die Betreiberin ist bei
              Inhalten, die mutmasslich strafbar oder anderweitig rechtswidrig
              sind, jederzeit berechtigt, gegen die betreffenden Nutzer
              Strafantrag zu stellen oder Strafanzeige zu erheben.
            </li>
          </ol>
          <li className="info__title">Nutzung von onlyfriend.ch</li>
          <ol className="info__section">
            <li className="info__text">
              Die Portal-Nutzung ist auf natürliche und juristische Personen
              beschränkt, die unbeschränkt handlungsfähig sind. Natürliche
              Personen, welche das Portal nutzen, müssen volljährig, das heisst
              18 Jahre oder älter, sein.
            </li>
            <li className="info__text">
              Nutzer dürfen ausschliesslich für ihren eigenen, auch
              gewerbsmässigen, Gebrauch auf das Portal zugreifen. Nutzer
              verpflichten sich, das Portal – direkt oder indirekt – in jeder
              Hinsicht ausschliesslich rechtskonform zu nutzen.
            </li>
            <li className="info__text">
              Nutzer verpflichten sich, jederzeit sämtlichen Verpflichtungen
              gegenüber der Betreiberin fristgerecht und vollumfänglich
              nachzukommen. Nutzer verpflichten sich insbesondere, allfällige
              Gebühren und sonstige Kosten fristgerecht zu bezahlen. Die
              Betreiberin ist berechtigt, kostenpflichtige Funktionen und
              Leistungen von Akonto- und Vorauszahlungen abhängig zu machen. Es
              gibt keinen Anspruch auf die Rückerstattung von bezahlten Gebühren
              und sonstigen Kosten.
            </li>
            <li className="info__text">
              Die Portal-Nutzung kann, insbesondere aus technischen Gründen,
              zeitweilig sowie teilweise oder vollständig nicht möglich sein.
              Die Betreiberin übernimmt keinerlei Gewährleistung für die
              Portal-Verfügbarkeit.
            </li>
            <li className="info__text">
              Die Registrierung mit falschen oder fiktiven Angaben ist
              untersagt. Für jede Person ist nur eine Registrierung erlaubt. Die
              Angaben von Nutzern müssen – auch nach erfolgter Registrierung –
              jederzeit vollständig und wahrheitsgetreu sein. Die Betreiberin
              ist – auch nachträglich – berechtigt, Angaben von Nutzern zu
              prüfen oder durch Dritte prüfen zu lassen sowie von Nutzern
              ergänzende Angaben zu fordern.
            </li>
            <li className="info__text">
              Die Betreiberin kann für die Portal-Nutzung oder für die Nutzung
              von einzelnen Funktionen und Leistungen eine obligatorische
              Registrierung als Nutzer vorsehen. Die Betreiberin ist berechtigt,
              die Registrierung jederzeit – auch nachträglich – und ohne Angabe
              von Gründen zu verweigern.
            </li>
            <li className="info__text">
              Registrierte Nutzer verpflichten sich, ihre Zugangsdaten zum
              Portal vertraulich zu behandeln und ausschliesslich selbst zu
              verwenden. Nutzer sind nicht berechtigt, ihren Zugang zum Portal
              direkt oder indirekt Dritten entgeltlich oder unentgeltlich zur
              Verfügung zu stellen.
            </li>
            <li className="info__text">
              Die Betreiberin ist berechtigt, Nutzern den Zugang zum Portal
              jederzeit und ohne Angabe von Gründen zu verweigern. Sofern der
              Zugriff aufgrund einer Verletzung dieser AGB verweigert wird,
              bleiben allfällige Gebühren sowie sonstige Kosten geschuldet und
              es erfolgt keine Rückerstattung von allenfalls bereits bezahlten
              Gebühren und sonstigen Kosten.
            </li>
            <li className="info__text">
              Allfällige Gebühren und sonstige Kosten sind per sofort
              geschuldet, sofern durch die Betreiberin keine Zahlungsfrist
              gewährt wird. Nutzer geraten bei nicht fristgerechter Bezahlung
              ohne Zahlungserinnerung automatisch in Verzug. Die Betreiberin ist
              bei Verzug berechtigt, einen Verzugszins von 10.0 % pro Jahr sowie
              eine Gebühr von jeweils CHF 25.00 für Zahlungserinnerungen in
              Rechnung zu stellen. Die Betreiberin ist berechtigt, säumigen
              Nutzern den Zugang zum Portal zu verweigern sowie Forderungen
              gegenüber Nutzern an Dritte abzutreten oder Dritte mit dem Inkasso
              zu beauftragen.
            </li>
          </ol>
          <li className="info__title">Haftung</li>
          <ol className="info__section">
            <li className="info__text">
              Nutzer haften gegenüber der Betreiberin und allfälligen Dritten
              unabhängig vom Verschulden ausdrücklich und vollumfänglich für
              sämtliche direkten und indirekten Kosten sowie für Schäden, welche
              aufgrund von Verletzungen dieser AGB oder im Zusammenhang mit dem
              Portal entstehen. Bei Betrug, Betrugsversuchen und Verletzungen
              dieser AGB im Zusammenhang mit Credits und Guthaben sowie mit der
              Bezahlung von kostenpflichtigen Funktionen und Leistungen ist die
              Betreiberin berechtigt, eine Vertragsstrafe von pauschal CHF
              10&apos;000.00 gegen die fehlbaren Nutzer zu verhängen.
            </li>
            <li className="info__text">
              Die Betreiberin haftet nur für direkte Schäden, die durch eigene
              grobfahrlässige oder vorsätzliche Handlungen verursacht wurden.
              Jegliche weitere Haftung der Betreiberin für direkte Schäden ist
              ausdrücklich und vollumfänglich ausgeschlossen. Jegliche Haftung
              der Betreiberin für indirekte Schäden und Mangelfolgeschäden, für
              Ansprüche anderer Nutzer oder allfälliger Dritter sowie für
              entgangenen Gewinn ist ausdrücklich und vollumfänglich
              ausgeschlossen. Jegliche Haftung für Hilfspersonen wird
              wegbedungen.
            </li>
            <li className="info__text">
              Die Schadloshaltung umfasst auch Ansprüche anderer Nutzer oder
              allfälliger Dritter. Die betreffenden Nutzer stellen die
              Betreiberin von sämtlichen Ansprüchen anderer Nutzer sowie
              allfälliger Dritter frei und verpflichten sich, sämtliche Kosten –
              auch Anwalts- und Gerichtskosten – und Schäden der Betreiberin in
              diesem Zusammenhang zu tragen.
            </li>
          </ol>
          <li className="info__title">Schlussbestimmungen</li>
          <ol className="info__section">
            <li className="info__text">
              Der automatisierte Zugriff auf das Portal, beispielsweise mit
              Bots, Skripten oder vergleichbaren Mitteln, ist untersagt.
            </li>
            <li className="info__text">
              Sollte sich eine Bestimmung dieser AGB als unerfüllbar, ungültig
              oder unwirksam erweisen, so soll dadurch die Erfüllbarkeit,
              Gültigkeit und Wirksamkeit der übrigen Bestimmungen nicht
              beeinträchtigt werden. In diesem Fall verpflichten sich die
              Parteien, die unerfüllbare, ungültige oder unwirksame Bestimmung
              durch eine erfüllbare, gültige oder wirksame Bestimmung zu
              ersetzen, die inhaltlich und wirtschaftlich der ursprünglichen
              Absicht der Parteien am nächsten kommt. Diese salvatorische
              Klausel gilt nicht für Nutzer, die Konsumenten beziehungsweise
              Verbraucher sind.
            </li>
            <li className="info__text">
              Die Betreiberin ist berechtigt, den Portal-Betrieb jederzeit
              dauerhaft oder zeitweilig sowie ganz oder teilweise ohne
              Ankündigung und ohne Angabe von Gründen einzustellen. Die
              Betreiberin ist berechtigt, einzelne oder alle Rechte und
              Pflichten aus diesen AGB durch Dritte ausüben zu lassen oder an
              Dritte zu übertragen.
            </li>
            <li className="info__text">
              Die Betreiberin ist berechtigt, diese AGB jederzeit und ohne
              Angabe von Gründen anzupassen. Die Nutzer werden in geeigneter Art
              und Weise über relevante Änderungen dieser AGB informiert.
            </li>
            <li className="info__text">
              Diese AGB unterstehen ausschliesslich schweizerischem Recht mit
              ausschliesslichem Erfüllungsort und Gerichtsstand am Sitz der
              Betreiberin, sofern die Nutzer keine Konsumenten beziehungsweise
              Verbraucher sind. Für Klagen von Konsumenten beziehungsweise
              Verbrauchern bei Streitigkeiten aus Konsumenten- beziehungsweise
              Verbraucherverträgen ist insbesondere das Gericht am Wohnsitz oder
              Sitz einer der beiden Parteien zuständig und die Konsumenten
              beziehungsweise Verbraucher können sich insbesondere auf das Recht
              an ihrem Wohnsitz berufen.
            </li>
          </ol>
        </ol>
      </div>
    </>
  );
};

export default AGB;
