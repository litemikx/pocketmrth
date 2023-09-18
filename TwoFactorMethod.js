/** Component to handle all 2FA methods */

import { keyDecoder, keyEncoder } from '@otplib/plugin-thirty-two';
import { Authenticator, TOTP } from '@otplib/core-async';
import { createDigest, createRandomBytes } from '@otplib/plugin-crypto-js';


const TwoFactorMethod = {};

TwoFactorMethod.generateSecretKey = async () => {
    console.log('start generateSecretKey');
    const authenticator = new Authenticator({ createDigest, keyDecoder, keyEncoder, createRandomBytes });
    const secret = await authenticator.generateSecret();
    console.log('secret', secret);
    return secret;
};


export default TwoFactorMethod;