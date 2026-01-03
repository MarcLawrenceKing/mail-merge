const VERIFY_EMAIL_KEY = "verify_email";

// saves email when in the EMAIL SUBMISSION so that even when page is refresh, the email is not lost

export const setVerifyEmail = (email: string) => {
  sessionStorage.setItem(VERIFY_EMAIL_KEY, email);
};

export const getVerifyEmail = () => {
  return sessionStorage.getItem(VERIFY_EMAIL_KEY);
};

export const clearVerifyEmail = () => {
  sessionStorage.removeItem(VERIFY_EMAIL_KEY);
};
