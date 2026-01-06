import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Table } from '../../components/common';
import { ROUTES, PAYMENT_METHODS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

// Summary Stat Card
function StatCard({ title, value, icon, iconColor }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</p>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-slate-900 text-2xl lg:text-3xl font-bold tracking-tight">{value}</p>
    </Card>
  );
}

// Payment Method Option
function PaymentMethodOption({ method, label, icon, isSelected, onSelect }) {
  return (
    <label className="cursor-pointer relative group">
      <input
        type="radio"
        name="payment_method"
        value={method}
        checked={isSelected}
        onChange={() => onSelect(method)}
        className="peer sr-only"
      />
      <div className={`p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-slate-200 bg-white hover:border-primary-300'
      }`}>
        <div className="flex flex-col gap-3 items-center text-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? 'bg-white text-primary-600'
              : 'bg-slate-100 text-slate-600 group-hover:text-primary-600'
          }`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-slate-900">{label}</span>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-3 right-3 text-primary-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </label>
  );
}

function FeePayment() {
  const navigate = useNavigate();
  const [selectedFees, setSelectedFees] = useState([1, 2]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CARD);

  // Mock data - will be replaced with API calls
  const feeBreakdown = [
    { id: 1, description: 'Transport Fee', term: 'Term 2', amount: 250.00 },
    { id: 2, description: 'Lab Charges', term: 'Term 2', amount: 100.00 },
  ];

  const paymentHistory = [
    { id: 1, date: 'Oct 20, 2023', description: 'Tuition Fee - Term 2', paymentId: '#TXN99882', status: 'paid', amount: 900.00 },
    { id: 2, date: 'Sep 15, 2023', description: 'Term 1 Fees', paymentId: '#TXN98234', status: 'paid', amount: 1250.00 },
    { id: 3, date: 'May 10, 2023', description: 'Annual Admission Fee', paymentId: '#TXN81273', status: 'paid', amount: 500.00 },
  ];

  const totalOutstanding = feeBreakdown.reduce((sum, fee) => sum + fee.amount, 0);
  const selectedTotal = feeBreakdown
    .filter((fee) => selectedFees.includes(fee.id))
    .reduce((sum, fee) => sum + fee.amount, 0);

  const toggleFeeSelection = (feeId) => {
    setSelectedFees((prev) =>
      prev.includes(feeId)
        ? prev.filter((id) => id !== feeId)
        : [...prev, feeId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFees.length === feeBreakdown.length) {
      setSelectedFees([]);
    } else {
      setSelectedFees(feeBreakdown.map((fee) => fee.id));
    }
  };

  const handlePayNow = () => {
    // In a real app, this would process the payment
    navigate(ROUTES.FEES_SUCCESS);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Fee Payment</h1>
          <p className="text-slate-500">Academic Session 2023-2024</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-primary-600 rounded-full text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Secure Payment
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Outstanding"
          value={formatCurrency(totalOutstanding)}
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          }
          iconColor="text-orange-500"
        />
        <StatCard
          title="Due Date"
          value="Oct 15th, 2023"
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
          iconColor="text-slate-400"
        />
        <StatCard
          title="Last Payment"
          value="Success"
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          }
          iconColor="text-green-500"
        />
      </div>

      {/* Fee Breakdown */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900">Fee Breakdown</h2>
        <Card className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-16 px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedFees.length === feeBreakdown.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-4 text-slate-500 text-sm font-semibold">Description</th>
                <th className="px-6 py-4 text-slate-500 text-sm font-semibold">Term</th>
                <th className="px-6 py-4 text-slate-500 text-sm font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {feeBreakdown.map((fee) => (
                <tr key={fee.id}>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedFees.includes(fee.id)}
                      onChange={() => toggleFeeSelection(fee.id)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{fee.description}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{fee.term}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium text-right">{formatCurrency(fee.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/50">
                <td colSpan="3" className="px-6 py-4 text-right text-slate-900 font-bold text-lg">Total Payable</td>
                <td className="px-6 py-4 text-right text-primary-600 font-bold text-xl">{formatCurrency(selectedTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </Card>
      </div>

      {/* Payment Method & Summary */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Payment Methods */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PaymentMethodOption
              method={PAYMENT_METHODS.CARD}
              label="Credit/Debit Card"
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              }
              isSelected={paymentMethod === PAYMENT_METHODS.CARD}
              onSelect={setPaymentMethod}
            />
            <PaymentMethodOption
              method={PAYMENT_METHODS.NET_BANKING}
              label="Net Banking"
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1.586l-.293-.293a1 1 0 10-1.414 1.414l2 2 .002.002a.997.997 0 001.41 0l.002-.002 2-2a1 1 0 00-1.414-1.414l-.293.293V9z" clipRule="evenodd" />
                </svg>
              }
              isSelected={paymentMethod === PAYMENT_METHODS.NET_BANKING}
              onSelect={setPaymentMethod}
            />
            <PaymentMethodOption
              method={PAYMENT_METHODS.UPI}
              label="UPI / Wallets"
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              }
              isSelected={paymentMethod === PAYMENT_METHODS.UPI}
              onSelect={setPaymentMethod}
            />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Summary</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 text-sm">Subtotal</span>
              <span className="text-slate-900 font-medium">{formatCurrency(selectedTotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 text-sm">Processing Fee</span>
              <span className="text-slate-900 font-medium">{formatCurrency(0)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-300 mb-6">
              <span className="text-slate-900 font-bold">Total</span>
              <span className="text-2xl font-bold text-primary-600">{formatCurrency(selectedTotal)}</span>
            </div>
            <Button
              fullWidth
              onClick={handlePayNow}
              disabled={selectedFees.length === 0}
              className="shadow-lg shadow-primary-500/20"
            >
              Pay Now
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Encrypted & Secure
            </div>
          </Card>
        </div>
      </div>

      {/* Payment History */}
      <div className="flex flex-col gap-4 pb-8">
        <h2 className="text-xl font-bold text-slate-900">Fee Paid History</h2>
        <Card className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-slate-500 text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-slate-500 text-sm font-semibold">Description</th>
                <th className="px-6 py-4 text-slate-500 text-sm font-semibold">Payment ID</th>
                <th className="px-6 py-4 text-slate-500 text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-slate-500 text-sm font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 text-slate-900 text-sm">{payment.date}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{payment.description}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-mono">{payment.paymentId}</td>
                  <td className="px-6 py-4">
                    <Badge variant="success" size="sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                      Paid
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-medium text-right">{formatCurrency(payment.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default FeePayment;
