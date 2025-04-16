export const formatUTC = (dateInt: number | Date, addOffset = false) => {
    const date =
      !dateInt || dateInt.toString().length < 1
        ? new Date()
        : new Date(dateInt);

    const offset = addOffset
      ? date.getTimezoneOffset()
      : -date.getTimezoneOffset();
    const offsetDate = new Date();
    offsetDate.setTime(date.getTime() + offset * 60000);
    return offsetDate;
  };