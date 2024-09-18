export function generateMetaDesc(offers, locations) {
  return `${offers} in ${locations} - Onlyfriend.ch - Das Sex & Erotik Portal`;
}

export function generateMetaTitle(locations) {
  return ` in ${locations} – Onlyfriend.ch`;
}

export function generateMetaTitle2({ locations, tags, offers }) {
  if (locations && !tags.length && !offers) {
    const metaTitle = `Sex in ${locations} – Sexkontakte – Onlyfriend.ch `;

    return metaTitle;
  }
  if (!locations.length && tags.length && !offers) {
    const metaTitle = `${tags} – Sextreffen & Sexkontakte – Onlyfriend.ch
    `;

    return metaTitle;
  }

  if (locations.length && tags.length && !offers) {
    const lowerTag = tags.toLowerCase();

    if (lowerTag.includes("massagen")) {
      return `Erotik Massagen in ${locations} & Umgebung – Onlyfriend.ch 
      `;
    }

    if (lowerTag.includes("milf")) {
      return `MILF in  ${locations}  & Umgebung – Onlyfriend.ch 
    `;
    }

    if (lowerTag.includes("webcam")) {
      return ` Webcam Sex Cam in  ${locations}  & Umgebung – Onlyfriend.ch 
  `;
    }
    if (lowerTag.includes("private")) {
      return `Sexchat Videos in  ${locations} – Onlyfans Accounts– Onlyfriend.ch 
  `;
    }
    const metaTitle = `

    ${tags} in ${locations} & Umgebung – Onlyfriend.ch 

    `;

    return metaTitle;
  }
  if (!locations.length && !tags.length && offers) {
    return `${offers} Schweiz – Sex Escort/Sextreffen – Onlyfriend.ch
    `;
  }
  if (locations.length && !tags.length && offers) {
    const lowerOffer = offers.toLowerCase();

    if (lowerOffer.includes("ohne")) {
      return `Blowjob in ${locations} & Umgebung – Sextreffen – Onlyfriend.ch`;
    }
    return `  

    ${offers} in ${locations} & Umgebung – Sextreffen – Onlyfriend.ch

    `;
  }
  if (locations.length && tags.length && offers) {
    const lowerTag = tags.toLowerCase();

    if (lowerTag.includes("massagen")) {
      return `Erotik Massagen in ${locations} & Umgebung – Onlyfriend.ch 
      `;
    }

    if (lowerTag.includes("milf")) {
      return `MILF in  ${locations}  & Umgebung – Onlyfriend.ch 
    `;
    }

    if (lowerTag.includes("webcam")) {
      return ` Webcam Sex Cam in  ${locations}  & Umgebung – Onlyfriend.ch 
  `;
    }
    if (lowerTag.includes("private")) {
      return `Sexchat Videos in  ${locations} – Onlyfans Accounts– Onlyfriend.ch 
  `;
    }
    const metaTitle = `

    ${tags} in ${locations} & Umgebung – Onlyfriend.ch 

    `;

    return metaTitle;
  }

  if (!locations.length && tags.length && offers) {
    const lowerTag = tags.toLowerCase();

    if (lowerTag.includes("massagen")) {
      return `Erotik Massagen in ${locations} & Umgebung – Onlyfriend.ch 
      `;
    }

    if (lowerTag.includes("milf")) {
      return `MILF in  ${locations}  & Umgebung – Onlyfriend.ch 
    `;
    }

    if (lowerTag.includes("webcam")) {
      return ` Webcam Sex Cam in  ${locations}  & Umgebung – Onlyfriend.ch 
  `;
    }
    if (lowerTag.includes("private")) {
      return `Sexchat Videos in  ${locations} – Onlyfans Accounts– Onlyfriend.ch 
  `;
    }
    const metaTitle = `

    ${tags} in ${locations} & Umgebung – Onlyfriend.ch 

    `;

    return metaTitle;
  }

  return `No title`;
}

export function generateMetaDesc2({ locations, tags, offers }) {
  if (locations && !tags.length && !offers) {
    const metaDesc = `Sex in ${locations} – Heisse Sextreffen / Sex Kontakte & Escort in ${locations} Blowjob in ${locations} und Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;

    return metaDesc;
  }

  if (!locations.length && tags.length && Array.isArray(tags) && !offers) {
    const lowerTag = tags.join(", ").toLowerCase();

    if (lowerTag.includes("sie sucht")) {
      return `Sie sucht ihn – Heisse Sextreffen / Sex Kontakte & Escorts! Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("er sucht")) {
      return `Er sucht sie – Heisse Sextreffen / Sex Kontakte & Escorts! Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("sex-party")) {
      return `Sex Party / Swinger – Heisse Sextreffen / Sex Kontakte & Escorts! Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("shemale")) {
      return `Shemale / Transen – Heisse Sextreffen / Sex Kontakte & Escorts! Ladyboy Schweiz. Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("domina")) {
      return `Domina / BDSM Sex – Heisse Sextreffen / Sex Kontakte & Escorts! Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("escort")) {
      return `Escort Service – Escort Kontakte  / Sex Kontakte & Escort  - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("massagen")) {
      return `Erotische Massagen – Massage mit Happy End  / Sex Kontakte & Escort  - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("milf")) {
      return `Reife Frauen / MILF – MILF für eine Nacht / Sex Kontakte & Escort  - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("webcam")) {
      return `Sex Cam Show – Videochat mit bildhübschen Frauen / Sex Kontakte & Escort  - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("private")) {
      return `Sexchat / Nacktvideos  – Videochat mit bildhübschen Frauen / Onlyfans Inserate mit Wapp Nr für direkten Kontakt! - Onlyfriend.ch – Das Onlyfans Portal`;
    }
  }

  if (locations.length && tags.length && Array.isArray(tags) && !offers) {
    const lowerTag = tags.join(", ").toLowerCase();
    if (lowerTag.includes("sie sucht")) {
      return `Sie sucht Sex in ${locations} – Sie sucht Sextreffen in Aargau / Sex Kontakte & Escort in Aargau! Blowjob in Aargau. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("er sucht")) {
      return `Er sucht sie – Heisse Sextreffen / Sex Kontakte & Escorts! Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("sex-party")) {
      return `Sex Party in ${locations} & Umgebung – Swinger Sextreffen in ${locations} / Sex Kontakte & Escort in ${locations}! Blowjob in ${locations} - Onlyfriend.ch - Das Sex & Erotik Portal`;
    }
    if (lowerTag.includes("shemale")) {
      return `Shemale / Transen in ${locations} & Umgebung – Lady Boy in ${locations} / Sex Kontakte & Escort in ${locations}! Blowjob in ${locations} - Onlyfriend.ch - Das Sex & Erotik Portal`;
    }
    if (lowerTag.includes("domina")) {
      return `Domina in ${locations} & Umgebung – BDSM Kontakte in ${locations} / Sex Kontakte & Escort in ${locations}! Blowjob in ${locations} - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("escort")) {
      return `Escort Service in ${locations} & Umgebung – Escort Kontakte in ${locations} / Sex Kontakte & Escort in ${locations}! - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("massagen")) {
      return `Erotische Massagen in ${locations} & Umgebung – Massage mit Happy End in ${locations} / Sex Kontakte & Escort in ${locations}! - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("milf")) {
      return `Reife Frauen / MILF in ${locations} & Umgebung – MILF für eine Nacht / Sex Kontakte & Escort in ${locations}! - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("webcam")) {
      return `Sex Cam Show in ${locations} & Umgebung – Videochat mit bildhübschen Frauen / Sex Kontakte & Escort in ${locations}! - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("private")) {
      return `Sexchat / Nacktvideos in ${locations} – Videochat mit bildhübschen Frauen / Onlyfans Inserate mit Wapp Nr für direkten Kontakt! - Onlyfriend.ch – Das Onlyfans Portal`;
    }
  }

  if (!locations.length && !tags.length && offers) {
    return `${offers} in der Schweiz – Sextreffen Schweiz / Sex Kontakte & Escort in der Schweiz! Onlyfriend.ch – Das Schweizer Sex & Erotik Portal

    `;
  }

  if (locations.length && !tags.length && offers) {
    if (offers.includes("ohne")) {
      return `BlowJob in ${locations} und Umgebung – Sextreffen Schweiz / Sex Kontakte & Escort in der Schweiz! Onlyfriend.ch – Das Schweizer Sex & Erotik Portal
`;
    }
    return `${offers} in ${locations} und Umgebung – Sextreffen Schweiz / Sex Kontakte & Escort in der Schweiz! Onlyfriend.ch – Das Schweizer Sex & Erotik Portal

    `;
  }

  if (!locations.length && tags.length && Array.isArray(tags) && offers) {
    const lowerTag = tags.join(", ").toLowerCase();

    if (lowerTag.includes("sie sucht")) {
      return `Sie sucht ihn – Heisse Sextreffen / Sex Kontakte & Escorts! Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("er sucht")) {
      return `Er sucht sie – Heisse Sextreffen / Sex Kontakte & Escorts! Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("sex-party")) {
      return `Sex Party / Swinger – Heisse Sextreffen / Sex Kontakte & Escorts! Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("shemale")) {
      return `Shemale / Transen – Heisse Sextreffen / Sex Kontakte & Escorts! Ladyboy Schweiz. Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("domina")) {
      return `Domina / BDSM Sex – Heisse Sextreffen / Sex Kontakte & Escorts! Blowjob in Ihrer Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;
    }
    if (lowerTag.includes("escort")) {
      return `Escort Service – Escort Kontakte  / Sex Kontakte & Escort  - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("massagen")) {
      return `Erotische Massagen – Massage mit Happy End  / Sex Kontakte & Escort  - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("milf")) {
      return `Reife Frauen / MILF – MILF für eine Nacht / Sex Kontakte & Escort  - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("webcam")) {
      return `Sex Cam Show – Videochat mit bildhübschen Frauen / Sex Kontakte & Escort  - Onlyfriend.ch – Das Schweizer Sex & Erotik Portal`;
    }
    if (lowerTag.includes("private")) {
      return `Sexchat / Nacktvideos  – Videochat mit bildhübschen Frauen / Onlyfans Inserate mit Wapp Nr für direkten Kontakt! - Onlyfriend.ch – Das Onlyfans Portal`;
    }
  }
  if (locations && tags.length && offers) {
    const metaDesc = `Sex in ${locations} – Heisse Sextreffen / Sex Kontakte & Escort in ${locations} Blowjob in ${locations} und Umgebung. Onlyfriend.ch – Das Schweizer Sex & Erotik Portal.
    `;

    return metaDesc;
  }

  return `No Desc`;
}
