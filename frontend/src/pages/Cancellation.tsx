import LegalDoc from '../components/LegalDoc';

export default function Cancellation() {
  return (
    <LegalDoc
      title="Cancellation Policy"
      subtitle="Our policy on booking cancellations, modifications, and refunds."
      updated="8 July 2026"
      metaDescription="Cancellation Policy for Hotel The Royal Jewel, Hisar — cancellation windows, charges, refunds, and no-show terms."
      sections={[
        {
          heading: 'Free Cancellation Window',
          body: [
            'Reservations cancelled at least 48 hours before the scheduled check-in date are eligible for a full refund of any advance paid.',
          ],
        },
        {
          heading: 'Late Cancellation',
          body: [
            'Cancellations made within 48 hours of check-in are charged one night’s room tariff. The balance, if any, is refunded to the original payment method.',
          ],
        },
        {
          heading: 'No-Show',
          body: [
            'In case of a no-show (failure to arrive without prior cancellation), the full booking amount, or a minimum of one night’s tariff, will be charged.',
          ],
        },
        {
          heading: 'Modifications',
          body: [
            'You may request changes to your booking dates subject to availability. Rate differences may apply. Please contact us as early as possible to modify a reservation.',
          ],
        },
        {
          heading: 'Peak & Special Periods',
          body: [
            'During festivals, weddings, and peak seasons, stricter cancellation terms may apply. Any such terms will be communicated at the time of booking.',
          ],
        },
        {
          heading: 'How to Cancel',
          body: [
            'To cancel or modify a booking, email info@hoteltheroyaljewel.com or call +91 99308 71000 with your booking reference.',
          ],
        },
      ]}
    />
  );
}
