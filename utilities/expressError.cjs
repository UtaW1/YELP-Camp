class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); 
        this.message = message; // is not built in
        this.statusCode = statusCode; // built in 
    }
}

module.exports = ExpressError; 