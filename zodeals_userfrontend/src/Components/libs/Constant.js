// API base URL. Set VITE_API_URL at build time (e.g. on Railway) to override.
// production
// export const hosturl = "https://api.zodeals.in"; 
//local
// export const hosturl = "http://10.196.124.161:6006";
export const hosturl = import.meta.env.VITE_API_URL || "https://api.zodeals.in";