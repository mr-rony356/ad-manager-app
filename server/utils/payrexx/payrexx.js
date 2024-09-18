const qs = require("qs");
const axios = require("axios");
const Base64 = require("crypto-js/enc-base64");
const hmacSHA256 = require("crypto-js/hmac-sha256");

/**
 * Creates a payrexx instance
 * */
exports.init = function (instance, secret) {
  // Builds the signature
  function buildSignature(query = "") {
    return Base64.stringify(hmacSHA256(query, secret));
  }

  // Builds the base url
  function buildBaseUrl(path) {
    const baseUrl = "https://api.payrexx.com/v1.0/";
    return baseUrl + path + "?instance=" + instance;
  }

  return {
    // Create a paylink
    createPaylink: function (params) {
      const queryParams = Object.assign({}, params);
      const queryString = qs.stringify(queryParams);
      const signature = buildSignature(queryString);

      queryParams.ApiSignature = signature;
      const queryStringSigned = qs.stringify(queryParams);

      const baseUrl = buildBaseUrl("Invoice/");
      return axios.post(baseUrl, queryStringSigned);
    },
  };
};
