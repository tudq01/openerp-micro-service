const dayjs = require("dayjs");

export const formatDate = (date) => {
  if (!date) return null;
  return dayjs(date).format("DD/MM/YYYY");
};


export const convertEmptyStringsToUndefined = (obj) => {
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] == null || (typeof obj[key] === "string" && obj[key].trim().length === 0)) {
          obj[key] = null;
        } else if (typeof obj[key] === "object") {
          obj[key] = convertEmptyStringsToUndefined(obj[key]);
        }
      }
    }
  }
  return obj;
};

export const getDirtyFields = (
  formData,
  dirtyFields
) => {
  const requestBody = {};

  const dataSubmit = convertEmptyStringsToUndefined(formData);
  for (const key in dirtyFields) {
    if (dirtyFields[key]) {
      requestBody[key] = dataSubmit[key];
    }
  }

  return requestBody;
};
