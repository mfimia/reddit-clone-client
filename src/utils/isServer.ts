// if we are on the server, this function returns true because window is undefined
export const isServer = () => typeof window === "undefined";
