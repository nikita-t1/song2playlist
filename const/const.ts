export const CLIENT_ID: string = process.env.CLIENT_ID ?? "Client ID"
export const CLIENT_SECRET: string = process.env.CLIENT_SECRET ?? "Client Secret"
export const REDIRECT_URI: string = process.env.REDIRECT_URI ??'http://localhost:3000/callback/';
export const STATE: string = process.env.STATE ??'This provides protection against attacks such as cross-site request forgery';

