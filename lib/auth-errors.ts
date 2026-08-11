export function getAuthErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: unknown }).code);

    switch (code) {
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
        return "Invalid email or password.";

      case "auth/user-not-found":
        return "No account was found with this email.";

      case "auth/wrong-password":
        return "Incorrect password.";

      case "auth/email-already-in-use":
        return "An account already exists with this email.";

      case "auth/weak-password":
        return "Password is too weak. Please choose a stronger password.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      default:
        break;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
