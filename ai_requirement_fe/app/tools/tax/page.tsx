"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calculator, HelpCircle, ChevronRight, PieChart, TrendingUp, Info } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const REGIONS = {
  I: 4960000,
  II: 4410000,
  III: 3860000,
  IV: 3450000,
};

const BASE_SALARY = 2340000;
const MAX_BHXH_SALARY = BASE_SALARY * 20;

export default function TaxCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState<string>('15000000');
  const [insuranceSalaryStr, setInsuranceSalaryStr] = useState<string>('');
  const [dependents, setDependents] = useState<number>(0);
  const [region, setRegion] = useState<keyof typeof REGIONS>('I');
  
  // Format numbers for input display
  const formatNumber = (num: string) => {
    if (!num) return '';
    return parseInt(num.replace(/[^\d]/g, '') || '0').toLocaleString('vi-VN');
  };

  const handleGrossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    setGrossSalary(rawValue);
  };

  const handleInsuranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    setInsuranceSalaryStr(rawValue);
  };

  const calculateTax = () => {
    const gross = parseInt(grossSalary || '0');
    const insuranceSalaryInput = insuranceSalaryStr ? parseInt(insuranceSalaryStr) : gross;
    
    // Limits
    const maxBhtnSalary = REGIONS[region] * 20;
    
    const salaryForBhxh = Math.min(insuranceSalaryInput, MAX_BHXH_SALARY);
    const salaryForBhtn = Math.min(insuranceSalaryInput, maxBhtnSalary);

    const bhxh = salaryForBhxh * 0.08;
    const bhyt = salaryForBhxh * 0.015;
    const bhtn = salaryForBhtn * 0.01;
    const totalInsurance = bhxh + bhyt + bhtn;

    const incomeBeforeTax = gross - totalInsurance;
    
    const personalDeduction = 11000000;
    const dependentDeduction = 4400000 * dependents;
    
    let taxableIncome = Math.max(0, incomeBeforeTax - personalDeduction - dependentDeduction);
    let remainingTaxable = taxableIncome;
    let tax = 0;
    let taxBreakdown = [];

    // Brackets
    const brackets = [
      { limit: 5000000, rate: 0.05, maxTax: 250000 },
      { limit: 5000000, rate: 0.10, maxTax: 500000 },
      { limit: 8000000, rate: 0.15, maxTax: 1200000 },
      { limit: 14000000, rate: 0.20, maxTax: 2800000 },
      { limit: 20000000, rate: 0.25, maxTax: 5000000 },
      { limit: 28000000, rate: 0.30, maxTax: 8400000 },
      { limit: Infinity, rate: 0.35, maxTax: Infinity }
    ];

    let currentTier = 0;
    while (remainingTaxable > 0 && currentTier < brackets.length) {
      const b = brackets[currentTier];
      const amountInBracket = Math.min(remainingTaxable, b.limit);
      const taxForBracket = amountInBracket * b.rate;
      
      if (taxForBracket > 0) {
        taxBreakdown.push({
          tier: currentTier + 1,
          rate: b.rate * 100,
          amount: amountInBracket,
          tax: taxForBracket
        });
      }

      tax += taxForBracket;
      remainingTaxable -= amountInBracket;
      currentTier++;
    }

    const net = gross - totalInsurance - tax;

    return {
      gross,
      net,
      bhxh,
      bhyt,
      bhtn,
      totalInsurance,
      taxableIncome,
      tax,
      taxBreakdown,
      personalDeduction,
      dependentDeduction
    };
  };

  const results = useMemo(() => calculateTax(), [grossSalary, insuranceSalaryStr, dependents, region]);

  const toCurrency = (num: number) => num.toLocaleString('vi-VN') + ' ₫';

  // Calculate percentages for progress bars
  const netPct = results.gross > 0 ? (Math.max(0, results.net) / results.gross) * 100 : 0;
  const insPct = results.gross > 0 ? (results.totalInsurance / results.gross) * 100 : 0;
  const taxPct = results.gross > 0 ? (results.tax / results.gross) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#4876EF] transition-colors">Trang chủ</Link>
          <ChevronRight className="size-4" />
          <Link href="#" className="hover:text-[#4876EF] transition-colors">Công cụ</Link>
          <ChevronRight className="size-4" />
          <span className="text-slate-800 font-medium">Tính thuế thu nhập cá nhân</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
            <Calculator className="size-8 text-[#E52329]" />
            Công cụ tính thuế thu nhập cá nhân (PIT)
          </h1>
          <p className="text-slate-600">
            Tính toán chính xác lương Gross sang Net, các khoản bảo hiểm bắt buộc và thuế thu nhập cá nhân theo quy định mới nhất.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <TrendingUp className="size-5 text-[#4876EF]" />
                Nhập thông tin thu nhập
              </h2>

              <div className="space-y-5">
                {/* Gross Salary */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Thu nhập tháng (VND) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formatNumber(grossSalary)}
                      onChange={handleGrossChange}
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#4876EF] focus:ring-2 focus:ring-[#4876EF]/20 outline-none transition-all font-medium text-slate-800 text-lg"
                      placeholder="VD: 20,000,000"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">VNĐ</div>
                  </div>
                </div>

                {/* Insurance Salary */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    Lương đóng bảo hiểm 
                    <div className="group relative cursor-help">
                      <HelpCircle className="size-4 text-slate-400" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center">
                        Để trống nếu đóng bảo hiểm trên toàn bộ mức thu nhập tháng.
                      </div>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formatNumber(insuranceSalaryStr)}
                      onChange={handleInsuranceChange}
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-[#4876EF] focus:ring-2 focus:ring-[#4876EF]/20 outline-none transition-all font-medium text-slate-800"
                      placeholder="Mặc định: Bằng thu nhập tháng"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">VNĐ</div>
                  </div>
                </div>

                {/* Dependents */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Số người phụ thuộc
                  </label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setDependents(Math.max(0, dependents - 1))}
                      className="w-12 h-12 flex items-center justify-center border border-slate-300 rounded-l-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={dependents}
                      onChange={(e) => setDependents(Math.max(0, parseInt(e.target.value) || 0))}
                      className="h-12 w-full text-center border-y border-slate-300 focus:outline-none font-medium text-slate-800"
                    />
                    <button 
                      onClick={() => setDependents(dependents + 1)}
                      className="w-12 h-12 flex items-center justify-center border border-slate-300 rounded-r-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Vùng
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['I', 'II', 'III', 'IV'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRegion(r)}
                        className={`h-10 rounded-lg text-sm font-bold border transition-all ${
                          region === r 
                            ? 'bg-[#4876EF] text-white border-[#4876EF] shadow-md shadow-blue-500/20' 
                            : 'bg-white text-slate-600 border-slate-300 hover:border-[#4876EF] hover:text-[#4876EF]'
                        }`}
                      >
                        Vùng {r}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    * Vùng đóng vai trò xác định mức trần đóng Bảo hiểm Thất nghiệp (BHTN).
                  </p>
                </div>
                
              </div>
            </div>

            {/* General Rules Info */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                <Info className="size-4" />
                Thông số luật áp dụng
              </h3>
              <ul className="text-xs text-blue-800 space-y-1.5 list-disc pl-4">
                <li>Lương cơ sở: <strong>2,340,000đ</strong> (Từ 01/07/2024)</li>
                <li>Giảm trừ gia cảnh bản thân: <strong>11,000,000đ/tháng</strong></li>
                <li>Giảm trừ người phụ thuộc: <strong>4,400,000đ/người/tháng</strong></li>
                <li>Tỷ lệ đóng bảo hiểm: BHXH (8%), BHYT (1.5%), BHTN (1%)</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Net Salary Highlight */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl overflow-hidden text-white">
              <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10">
                <div className="text-center md:text-left">
                  <p className="text-slate-400 font-medium mb-1">LƯƠNG GROSS</p>
                  <p className="text-3xl font-bold">{toCurrency(results.gross)}</p>
                </div>
                <div className="hidden md:block w-px h-16 bg-white/10"></div>
                <div className="text-center md:text-right">
                  <p className="text-[#ff6b6b] font-bold mb-1 tracking-wider text-sm">LƯƠNG NET (NHẬN VỀ)</p>
                  <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-[#E52329] drop-shadow-md">
                    {toCurrency(Math.max(0, results.net))}
                  </p>
                </div>
              </div>

              {/* Progress Bar Visualization */}
              <div className="p-6 bg-white/5">
                <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-300">
                  <span>Chi tiết tỷ trọng</span>
                  <PieChart className="size-4 opacity-50" />
                </div>
                <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div style={{ width: `${netPct}%` }} className="h-full bg-gradient-to-r from-[#E52329] to-red-400 transition-all duration-500" title={`Lương Net: ${netPct.toFixed(1)}%`}></div>
                  <div style={{ width: `${insPct}%` }} className="h-full bg-[#4876EF] transition-all duration-500" title={`Bảo hiểm: ${insPct.toFixed(1)}%`}></div>
                  <div style={{ width: `${taxPct}%` }} className="h-full bg-amber-400 transition-all duration-500" title={`Thuế: ${taxPct.toFixed(1)}%`}></div>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-xs justify-center md:justify-start">
                  <div className="flex items-center gap-1.5"><div className="size-3 rounded-sm bg-[#E52329]"></div>Lương Net ({netPct.toFixed(1)}%)</div>
                  <div className="flex items-center gap-1.5"><div className="size-3 rounded-sm bg-[#4876EF]"></div>Bảo hiểm ({insPct.toFixed(1)}%)</div>
                  <div className="flex items-center gap-1.5"><div className="size-3 rounded-sm bg-amber-400"></div>Thuế TNCN ({taxPct.toFixed(1)}%)</div>
                </div>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Diễn giải chi tiết</h3>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-sm text-slate-600">
                  <tbody>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-6 font-medium">Lương Gross</td>
                      <td className="py-3 px-6 text-right font-bold text-slate-900">{toCurrency(results.gross)}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-6 font-medium text-blue-600">Bảo hiểm bắt buộc</td>
                      <td className="py-3 px-6 text-right font-bold text-blue-600">-{toCurrency(results.totalInsurance)}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors bg-slate-50/30">
                      <td className="py-2 px-6 pl-10 text-xs">- BHXH (8%)</td>
                      <td className="py-2 px-6 text-right text-xs">-{toCurrency(results.bhxh)}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors bg-slate-50/30">
                      <td className="py-2 px-6 pl-10 text-xs">- BHYT (1.5%)</td>
                      <td className="py-2 px-6 text-right text-xs">-{toCurrency(results.bhyt)}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors bg-slate-50/30">
                      <td className="py-2 px-6 pl-10 text-xs">- BHTN (1%)</td>
                      <td className="py-2 px-6 text-right text-xs">-{toCurrency(results.bhtn)}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-6 font-medium">Thu nhập trước thuế</td>
                      <td className="py-3 px-6 text-right font-bold text-slate-900">{toCurrency(results.gross - results.totalInsurance)}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-6 font-medium text-emerald-600">Giảm trừ gia cảnh</td>
                      <td className="py-3 px-6 text-right font-bold text-emerald-600">-{toCurrency(results.personalDeduction + results.dependentDeduction)}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors bg-slate-50/30">
                      <td className="py-2 px-6 pl-10 text-xs">- Bản thân</td>
                      <td className="py-2 px-6 text-right text-xs">-{toCurrency(results.personalDeduction)}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors bg-slate-50/30">
                      <td className="py-2 px-6 pl-10 text-xs">- Người phụ thuộc ({dependents})</td>
                      <td className="py-2 px-6 text-right text-xs">-{toCurrency(results.dependentDeduction)}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors bg-amber-50/30">
                      <td className="py-3 px-6 font-medium text-amber-700">Thu nhập chịu thuế</td>
                      <td className="py-3 px-6 text-right font-bold text-amber-700">{toCurrency(results.taxableIncome)}</td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors bg-red-50/30">
                      <td className="py-3 px-6 font-bold text-red-600">Thuế thu nhập cá nhân (PIT)</td>
                      <td className="py-3 px-6 text-right font-bold text-red-600">-{toCurrency(results.tax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tax Brackets Detail if Tax > 0 */}
            {results.taxBreakdown.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-800">Chi tiết biểu thuế lũy tiến</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-6">Bậc</th>
                        <th className="py-3 px-6">Phần thu nhập</th>
                        <th className="py-3 px-6 text-center">Thuế suất</th>
                        <th className="py-3 px-6 text-right">Tiền nộp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.taxBreakdown.map((b, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-6">Bậc {b.tier}</td>
                          <td className="py-2 px-6 font-medium text-slate-800">{toCurrency(b.amount)}</td>
                          <td className="py-2 px-6 text-center">
                            <span className="bg-amber-100 text-amber-700 py-0.5 px-2 rounded font-bold">{b.rate}%</span>
                          </td>
                          <td className="py-2 px-6 text-right font-bold text-red-500">{toCurrency(b.tax)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
      </main>

      <Footer />
    </div>
  );
}
