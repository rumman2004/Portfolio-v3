export const assertValidObjectId = (id, resourceName = "resource") => {
  if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) {
    const error = new Error(`Invalid ${resourceName} id`);
    error.statusCode = 400;
    error.code = "INVALID_ID";
    throw error;
  }

  return id;
};

export const notFoundError = (resourceName) => {
  const error = new Error(`${resourceName} not found`);
  error.statusCode = 404;
  return error;
};
