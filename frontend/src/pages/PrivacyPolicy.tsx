import LegalDoc from '../components/LegalDoc';

export default function PrivacyPolicy() {
  return (
    <LegalDoc
      title="Privacy Policy"
      subtitle="How Hotel The Royal Jewel collects, uses, and protects your information."
      updated="8 July 2026"
      metaDescription="Privacy Policy for Hotel The Royal Jewel, Hisar — how we collect, use, and safeguard guest information."
      sections={[
        {
          heading: 'Information We Collect',
          body: [
            'When you make a booking enquiry, contact us, or subscribe to updates, we may collect your name, email address, phone number, stay dates, and any message you send us.',
            'We also collect limited technical information such as your browser type and pages visited to help us improve our website.',
          ],
        },
        {
          heading: 'How We Use Your Information',
          body: [
            'We use your information to respond to enquiries, process and confirm reservations, provide guest services, and communicate important information about your stay.',
            'With your consent, we may send you occasional offers and updates. You can opt out at any time.',
          ],
        },
        {
          heading: 'Sharing of Information',
          body: [
            'We do not sell your personal information. We share it only with trusted service providers who help us operate the hotel and website, and only as necessary to deliver our services, or where required by law.',
          ],
        },
        {
          heading: 'Data Security',
          body: [
            'We apply reasonable technical and organisational measures to protect your information. However, no method of transmission over the internet is completely secure.',
          ],
        },
        {
          heading: 'Your Rights',
          body: [
            'You may request access to, correction of, or deletion of your personal information by contacting us at info@hoteltheroyaljewel.com.',
          ],
        },
        {
          heading: 'Contact Us',
          body: [
            'For any privacy-related questions, email info@hoteltheroyaljewel.com or call +91 99308 71000.',
          ],
        },
      ]}
    />
  );
}
