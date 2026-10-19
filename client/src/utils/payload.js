export const toMonthInputValue = (value) => {
  if (!value) return '';

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 7);
};

export const stripImmutableFields = (payload = {}) => {
  const cleaned = { ...payload };

  ['_id', 'id', '__v', 'createdAt', 'updatedAt', 'slug'].forEach((field) => {
    delete cleaned[field];
  });

  return cleaned;
};
