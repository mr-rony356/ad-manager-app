import { Checkbox } from "@components/tags/Inputs";
import { API_ADDRESS } from "@utils/API";
import Image from "next/image";

const Verification = ({ id, ad, handleDelete, handleVerify }) => (
  <div className="verification card">
    <div className="verification__titleButton">
      <p>Verifizierungs-Code: {ad.verificationCode}</p>
      <div style={{ display: "flex", flexDirection: "row", gap: "0.5em" }}>
        <Checkbox
          id={`verify-${id}`}
          name={`verify-${id}`}
          label="Verifizieren"
          onChange={() => handleVerify(id)}
        />
        <Checkbox
          id={`reject-${id}`}
          name={`reject-${id}`}
          label="Ablehnen"
          onChange={() => handleDelete(id)}
        />
      </div>
    </div>
    <div className="verification__content">
      {ad.verificationImage && (
        <Image
          src={`${API_ADDRESS}${ad.verificationImage}`}
          width={500}
          height={500}
          alt="verificationImage"
          className="verification__image"
          loading="lazy"
        />
      )}
      {ad.video && (
        <video
          controls
          src={`${API_ADDRESS}${ad.video}`}
          className="verification__video"
          width="500"
          height="500"
        />
      )}
      {ad.images?.map((image, index) => (
        <Image
          key={index}
          src={`${API_ADDRESS}${image}`}
          width={500}
          height={500}
          alt={`Additional image ${index + 1}`}
          className="verification__images"
          loading="lazy"
        />
      ))}
    </div>
  </div>
);

export default Verification;
