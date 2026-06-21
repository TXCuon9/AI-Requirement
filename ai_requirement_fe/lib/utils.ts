export const formatSalary = (salaryValue: number | string | null | undefined, currency?: string): string => {
  if (salaryValue === null || salaryValue === undefined || salaryValue === "") return "";

  const salary = Number(salaryValue);
  if (isNaN(salary)) return String(salaryValue);

  const cur = (currency || "VNĐ").trim();
  const isVND = cur.toUpperCase() === "VNĐ" || cur.toUpperCase() === "VND";

  if (isVND) {
    if (salary > 0 && salary < 1000) {
      return `${salary} triệu VNĐ`;
    }
    if (salary >= 1000000) {
      const millions = salary / 1000000;
      return `${Number.isInteger(millions) ? millions : millions.toFixed(1)} triệu VNĐ`;
    }
  }

  return `${salary.toLocaleString('vi-VN')} ${cur}`;
};

export const formatSalaryRange = (min: number | string | null | undefined, max: number | string | null | undefined, currency?: string): string => {
  if (!min && !max) return "Thỏa thuận";

  // Force VND for large numbers if accidentally saved as USD
  let effectiveCurrency = currency;
  if (effectiveCurrency === "USD" && (Number(min) > 1000000 || Number(max) > 1000000)) {
    effectiveCurrency = "VNĐ";
  }

  const minStr = formatSalary(min, effectiveCurrency);
  const maxStr = formatSalary(max, effectiveCurrency);

  if (min && !max) return `Từ ${minStr}`;
  if (!min && max) return `Lên đến ${maxStr}`;

  if (minStr.includes("triệu VNĐ") && maxStr.includes("triệu VNĐ")) {
    const minNum = minStr.replace(" triệu VNĐ", "");
    return `${minNum} - ${maxStr}`;
  }

  return `${minStr.split(' ')[0]} - ${maxStr}`;
};
