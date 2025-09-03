// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase letter, and 1 number
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Case validation functions
export const validateCaseTitle = (title: string): boolean => {
  return !!title.trim();
};

export const validateCaseDescription = (description: string): boolean => {
  return !!description.trim();
};

export const validateCaseCategory = (category: string): boolean => {
  return !!category.trim();
};

export const validateCase = (title: string, description: string, category: string): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!validateCaseTitle(title)) {
    errors.title = "Title is required";
  }

  if (!validateCaseDescription(description)) {
    errors.description = "Description is required";
  }

  if (!validateCaseCategory(category)) {
    errors.category = "Category is required";
  }

  return errors;
};
