import React from "react";
export default function DateTime({  date ,className}) {
  function CheckIfEquals(date1, date2) {
    return date1.toDateString() === date2.toDateString();
  }
  function CheckIfToday() {
    return CheckIfEquals(date, new Date());
  }
  function CheckIfYesterday() {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    const clonetimeset = new Date(date.getTime());
    clonetimeset.setTime(clonetimeset.getTime() - 1);
    return CheckIfEquals(yesterday, clonetimeset);
  }
  function CheckDate() {
    if (CheckIfToday()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    if (CheckIfYesterday()) return "Yesterday";
    return new Date(date).toLocaleDateString("pt-PT");
  }
  return <span className={className}>{date ? CheckDate() : ""}</span>;
}
