import { Link } from 'react-router-dom';
import { Card, Button } from '../../components/common';
import { ROUTES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

function PaymentSuccess() {
  // Mock data - in a real app, this would come from query params or state
  const paymentDetails = {
    amount: 350.00,
    transactionId: '#TXN_20231024_882',
    dateTime: 'Oct 24, 2023, 10:42 AM',
    paymentMethod: 'Credit Card',
    items: [
      { description: 'Transport Fee (Term 2)', amount: 250.00 },
      { description: 'Lab Charges (Term 2)', amount: 100.00 },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 p-8 flex flex-col items-center justify-center border-b border-green-100">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 ring-8 ring-green-50">
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">Payment Successful!</h1>
            <p className="text-slate-500 mt-2 text-center">Your transaction has been completed successfully.</p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <div className="flex flex-col gap-6">
              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Amount Paid</span>
                  <span className="text-xl font-bold text-slate-900">{formatCurrency(paymentDetails.amount)}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Transaction ID</span>
                  <span className="text-base font-medium text-slate-900 font-mono">{paymentDetails.transactionId}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Date & Time</span>
                  <span className="text-base font-medium text-slate-900">{paymentDetails.dateTime}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Payment Method</span>
                  <div className="flex items-center gap-2 text-base font-medium text-slate-900">
                    <div className="flex items-center justify-center bg-slate-100 rounded p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{paymentDetails.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 w-full"></div>

              {/* Paid Items */}
              <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Paid For</span>
                {paymentDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-900">{item.description}</span>
                    <span className="text-sm font-medium text-slate-900">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button className="flex-1">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download Receipt
                </Button>
                <Link to={ROUTES.FEES} className="flex-1">
                  <Button variant="outline" fullWidth>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    View Payment History
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Payments are secure and encrypted
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
