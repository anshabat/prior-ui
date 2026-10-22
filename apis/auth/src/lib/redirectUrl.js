/**
 * Set or remove the error search param on an absolute return URL.
 * @param {string} returnUrl
 * @param {string} [error]
 * @returns {string}
 */
const buildRedirectUrl = (returnUrl, error) => {
  const url = new URL(returnUrl);

  if (error) {
    url.searchParams.set("error", error);
  } else {
    url.searchParams.delete("error");
  }

  return url.href;
};

/**
 * Set or remove the success search param on an absolute return URL.
 * @param {string} returnUrl
 * @param {string} [success]
 * @returns {string}
 */
const buildSuccessRedirectUrl = (returnUrl, success) => {
  const url = new URL(returnUrl);

  if (success) {
    url.searchParams.set("success", success);
  } else {
    url.searchParams.delete("success");
  }

  return url.href;
};

module.exports = { buildRedirectUrl, buildSuccessRedirectUrl };
