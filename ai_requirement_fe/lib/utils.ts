export const formatSalary = (salary: number | null | undefined, currency?: string): string => {
  if (salary === null || salary === undefined) return "";
  
  const cur = currency || "VNĐ";
  const isVND = cur === "VNĐ" || cur === "VND";

  if (isVND) {
    if (salary > 0 && salary < 1000) {
      return `${salary} Triệu`;
    }
    if (salary >= 1000000) {
      const millions = salary / 1000000;
      return `${Number.isInteger(millions) ? millions : millions.toFixed(1)} Triệu`;
    }
  }

  return `${salary.toLocaleString('vi-VN')} ${cur}`;
};

export const formatSalaryRange = (min: number | null | undefined, max: number | null | undefined, currency?: string): string => {
  if (!min && !max) return "Thỏa thuận";
  
  const minStr = formatSalary(min, currency);
  const maxStr = formatSalary(max, currency);
  
  if (min && !max) return `Từ ${minStr}`;
  if (!min && max) return `Lên đến ${maxStr}`;
  
  if (minStr.includes("Triệu") && maxStr.includes("Triệu")) {
    const minNum = minStr.replace(" Triệu", "");
    return `${minNum} - ${maxStr}`;
  }
  
  return `${minStr.split(' ')[0]} - ${maxStr}`;
};
