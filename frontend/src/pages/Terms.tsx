import LegalDoc from '../components/LegalDoc';

export default function Terms() {
  return (
    <LegalDoc
      title="Terms & Conditions"
      subtitle="The terms that govern your use of our website and stay with us."
      updated="8 July 2026"
      metaDescription="Terms & Conditions for Hotel The Royal Jewel, Hisar — booking, payment, check-in, and guest conduct terms."
      sections={[
        {
          heading: 'Acceptance of Terms',
          body: [
            'By accessing our website or making a reservation with Hotel The Royal Jewel, you agree to these Terms & Conditions. Please read them carefully.',
          ],
        },
        {
          heading: 'Reservations & Payment',
          body: [
            'All bookings are subject to availability and confirmation. Rates are quoted in Indian Rupees (INR) and are inclusive or exclusive of taxes as indicated at the time of booking.',
            'A valid credit/debit card or advance payment may be required to guarantee your reservation.',
          ],
        },
        {
          heading: 'Check-in & Check-out',
          body: [
            'Standard check-in is from 2:00 PM and check-out is by 12:00 PM (noon). Early check-in and late check-out are subject to availability and may incur additional charges.',
            'Guests must present a valid government-issued photo ID at check-in.',
          ],
        },
        {
          heading: 'Guest Conduct',
          body: [
            'Guests are expected to behave respectfully towards staff and other guests. The hotel reserves the right to refuse service or terminate a stay for disruptive or unlawful behaviour without refund.',
            'Smoking is permitted only in designated areas. Damage to hotel property may be charged to the guest.',
          ],
        },
        {
          heading: 'Liability',
          body: [
            'The hotel is not liable for loss or damage to personal belongings except as required by law. Please use the in-room safe for valuables.',
          ],
        },
        {
          heading: 'Changes to These Terms',
          body: [
            'We may update these Terms & Conditions from time to time. The version published on this page applies to your booking.',
          ],
        },
      ]}
    />
  );
}
