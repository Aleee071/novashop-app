import debug from "debug";

// Create different log levels
export const error = debug("app:error"); // For errors
export const databaseLog = debug("app:database"); // For general logs
export const auth = debug("app:auth"); // For authenticaton logs
export const security = debug("app:security"); // For security logs
export const product = debug("app:product"); // For product logs
export const owner = debug("app:owner"); // For owner logs
export const orderLog = debug("app:order"); // For order logs
export const cartLog = debug("app:cart"); // For cart logs
