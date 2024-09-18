import { Checkbox } from "@components/tags/Inputs";
import { API_ADDRESS } from "@utils/API";
import Image from "next/image";

const Verification = ({ id, ad, handleDelete, handleVerify }) => {
  return (
    <div className="verification card">
      <div className="verification__titleButton">
        <p> Verifizierungs-Code: {ad.verificationCode}</p>
        <div style={{ display: "flex", flexDirection: "row", gap: "0.5em" }}>
          <Checkbox
            id="cb-9-0"
            name="cb-9-0"
            label="Verifizieren"
            onChange={() => handleVerify(id)}
          />
          <Checkbox
            id="cb-9-1"
            name="cb-9-1"
            label="Ablehnen"
            onChange={() => handleDelete(id)}
          />
        </div>
      </div>
      <div className="verification__content">
        {ad.verificationImage && (
          <Image
            src={API_ADDRESS + ad.verificationImage}
            width={500}
            height={500}
            alt={"verificationImage"}
            className="verification__image"
            loading="lazy"
          />
        )}
        {ad.video && (
          <video
            id="iv-10-0"
            name="iv-10-0"
            src={API_ADDRESS + ad.video}
            alt={ad.video.name}
            className="image"
          />
        )}
        {ad.images &&
          ad.images.length > 0 &&
          ad.images.map((image, i) => (
            <Image
              key={i}
              src={API_ADDRESS + image}
              width={500}
              height={500}
              alt={"i " + i}
              className="verification__images"
              loading="lazy"
            />
          ))}
      </div>
    </div>
  );
};

export default Verification;
