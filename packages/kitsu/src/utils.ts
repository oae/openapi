const log = require('@openapi/core').createLogger('kitsu:auth');

export const getAccessToken = async accessTokenParam => {
  // Provide a window of time before the actual expiration to refresh the token
  const EXPIRATION_WINDOW_IN_SECONDS = 300;

  const { token } = accessTokenParam;
  const expirationTimeInSeconds = new Date(token.expires_at).getTime() / 1000;
  const expirationWindowStart = expirationTimeInSeconds - EXPIRATION_WINDOW_IN_SECONDS;

  const nowInSeconds = new Date().getTime() / 1000;
  const shouldRefresh = nowInSeconds >= expirationWindowStart;
  if (shouldRefresh) {
    try {
      return (await accessTokenParam.refresh()).token.access_token;
    } catch (error) {
      log.info('Error refreshing access token: ', error.message);
      return null;
    }
  } else {
    log.info('Returns current access token');
    return accessTokenParam.token.access_token;
  }
};
