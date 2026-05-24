// Why: Every API response should have the same structure.
// Frontend developers (including future-you) can always expect:
// { success, message, data }

class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
  }
}

module.exports = ApiResponse;