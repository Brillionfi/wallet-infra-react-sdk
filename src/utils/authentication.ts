import { create } from '@brillionfi/wallet-infra-sdk/dist/utils/stampers/webAuthnStamper/webauthn-json/api.js';

const generateRandomBuffer = (): ArrayBuffer => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return arr.buffer;
};

const base64UrlEncode = (challenge: ArrayBuffer): string => {
  return Buffer.from(challenge).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

function protocolTransportEnumToInternalEnum(protocolEnum: AuthenticatorTransport) {
  switch (protocolEnum) {
    case "internal": {
      return "AUTHENTICATOR_TRANSPORT_INTERNAL";
    }
    case "usb": {
      return "AUTHENTICATOR_TRANSPORT_USB";
    }
    case "nfc": {
      return "AUTHENTICATOR_TRANSPORT_NFC";
    }
    case "ble": {
      return "AUTHENTICATOR_TRANSPORT_BLE";
    }
    case "hybrid": {
      return "AUTHENTICATOR_TRANSPORT_HYBRID";
    }
    default: {
      throw new Error("unsupported transport format");
    }
  }
}

export const getAuthentication = async (domain: string) => {
  const challenge = generateRandomBuffer();
  const authenticatorUserId = generateRandomBuffer();

  const attestation = await create({
    publicKey: {
      rp: {
        id: domain,
        name: 'Wallet Passkey',
      },
      challenge: base64UrlEncode(challenge),
      pubKeyCredParams: [
        {
          type: 'public-key',
          alg: -7,
        },
      ],
      user: {
        id: base64UrlEncode(authenticatorUserId),
        name: domain + " wallet",
        displayName: domain + " wallet",
      },
    },
  });

  return {
    challenge: base64UrlEncode(challenge),
    attestation: {
      credentialId: attestation.rawId,
      attestationObject: attestation.response.attestationObject,
      clientDataJson: attestation.response.clientDataJSON,
      transports: attestation.response.transports.map(protocolTransportEnumToInternalEnum),
    }
  };
};