export const API_ROUTES = {
    HEALTHCHECK: '/api/healthcheck',
    SCORE: '/api/score',
    VALIDATE: (email: string) => '/api/validate?email=' + encodeURIComponent(email),
};
