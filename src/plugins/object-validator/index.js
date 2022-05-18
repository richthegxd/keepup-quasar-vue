/**
 * It takes a string, tries to parse it as JSON, and returns true if it's a valid JSON object with the
 * properties stateData and notesData
 * @param obj - The object to validate.
 * @returns A function that takes in an object and returns a boolean.
 */
function validateObject(obj) {
  try {
    const object = JSON.parse(obj);

    if(!object.stateData || !object.notesData) return false;

    return true;
  }
  catch {
    return false;
  }
}


export { validateObject };
