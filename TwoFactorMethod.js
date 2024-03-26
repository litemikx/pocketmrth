/** Component to handle all 2FA methods */

import { keyDecoder, keyEncoder } from '@otplib/plugin-thirty-two';
import { Authenticator, TOTP } from '@otplib/core-async';
import { createDigest, createRandomBytes } from '@otplib/plugin-crypto-js';


const TwoFactorMethod = {};

TwoFactorMethod.generateSecretKey = async () => {
    const authenticator = new Authenticator({ createDigest, keyDecoder, keyEncoder, createRandomBytes });
    const secret = await authenticator.generateSecret();
    return secret;
};


export default TwoFactorMethod;