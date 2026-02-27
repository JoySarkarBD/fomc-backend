// Convert date into BD timezone and remove time part
export const convertToBDDate = (date: Date) => {
  const utcDate = new Date(date);
  const bdDate = new Date(
    utcDate.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
  );
  bdDate.setHours(0, 0, 0, 0);
  return bdDate;
};
