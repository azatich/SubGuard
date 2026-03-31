const AUTH_ERRORS: Record<string, string> = {
  "Invalid login credentials": "Неверный email или пароль",
  "Email not confirmed": "Пожалуйста, подтвердите вашу почту перед входом",
  "User already registered": "Пользователь с таким email уже существует",
  "Password should be at least 6 characters": "Пароль должен быть не менее 6 символов",
  "To security purposes, you can only request this after": "Слишком много попыток. Попробуйте позже",
  "Internal server error": "Внутренняя ошибка сервера. Мы уже чиним!",
};

export const translateAuthError = (errorMessage?: string): string => {
  if (!errorMessage) return "Произошла непредвиденная ошибка";
  
  if (AUTH_ERRORS[errorMessage]) {
    return AUTH_ERRORS[errorMessage];
  }
  
  return "Произошла ошибка авторизации. Попробуйте еще раз.";
};