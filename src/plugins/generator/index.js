/**
 * Generate a random string of characters that is 36 
 * characters long and contains numbers and lowercase
 * letters
 * @returns A string of numbers and letters.
 */
export default function generateId() {
  return `${Date.now().toString(36) + Math.random().toString(36).substr(2)}`;
}
