import { auth } from 'express-oauth2-jwt-bearer';

export const checkJwt = auth({
    audience: process.env.VITE_AUTH0_AUDIENCE,
    issuerBaseURL: process.env.VITE_AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256',
});
