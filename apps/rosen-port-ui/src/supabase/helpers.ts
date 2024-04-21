export const isDbDataNotNullOrEmpty = (data: string | any[] | null) => {
  return data !== null && data.length > 0;
};
