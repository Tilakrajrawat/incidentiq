export function getApiErrorMessage(error, fallback = "Something went wrong") {
  if (!error?.response) return "Network error. Please check your connection and try again.";

  const { data, status } = error.response;
  if (status === 401) return "Your session has expired. Please sign in again.";

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((entry) => entry.msg).join("; ");
  }

  return data?.message || fallback;
}
