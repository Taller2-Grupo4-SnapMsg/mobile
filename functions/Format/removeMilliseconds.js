export default function RemoveMillisecondsFromDateStr(dateStr) {
    const parts = dateStr.split('.');
    if (parts.length === 2) {
      return parts[0];
    }
    return dateStr;
  }