import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | PostJet',
  description: 'PostJet refund terms, eligibility criteria, and how to contact support for a refund.',
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 md:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Refund Policy</p>
          <h1 className="text-5xl font-semibold text-white">Transparent, fair refunds for PostJet customers</h1>
          <p className="text-zinc-400 max-w-3xl leading-8">
            If your purchase does not meet expectations, PostJet provides a clear refund process for eligible subscriptions. This page explains eligibility, exclusions, and how to submit a refund request.
          </p>
        </header>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Refund eligibility</h2>
          <p className="text-zinc-300 leading-8">
            PostJet offers a 7-day money-back guarantee for all new paid subscriptions. If you cancel within 7 days of the initial purchase and you are not satisfied, you may request a full refund.
          </p>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">What is not refundable</h2>
          <ul className="list-disc ml-6 space-y-3 text-zinc-300 leading-8">
            <li>Requests submitted after the 7-day refund window.</li>
            <li>Accounts found to be in violation of the Terms of Service.</li>
            <li>Partial months already consumed after the initial refund period.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">How to request a refund</h2>
          <p className="text-zinc-300 leading-8">
            Send an email to <span className="text-blue-400 font-medium">support@postjet.com</span> with your account email address, purchase date, and transaction ID. Our team will review and respond as quickly as possible.
          </p>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Processing timeline</h2>
          <p className="text-zinc-300 leading-8">
            Approved refunds are usually processed within 5-10 business days and are returned to the original payment method used at checkout.
          </p>
        </section>

        <footer className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 text-zinc-400">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-3">Need support?</p>
          <p className="leading-7">
            If you have any questions about this policy, reach out to our support team at <span className="text-blue-400 font-medium">support@postjet.com</span>.
          </p>
        </footer>
      </div>
    </div>
  );
}
