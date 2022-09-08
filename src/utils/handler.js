export const asyncFuncHandler = async (callback) => {
  try {
    const response = await callback();
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

export const asyncFuncHandlerWithParameter = async (callback, e) => {
  try {
    const response = await callback(e);
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

// TODO: look for solution on overloading function in javascript
export const asyncFuncHandlerWithTwoParam = async (callback, a1, a2) => {
  try {
    const response = await callback(a1, a2);
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};
