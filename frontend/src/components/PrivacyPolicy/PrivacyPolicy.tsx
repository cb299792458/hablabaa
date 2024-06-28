import { h1Class } from "../../styles";

const PrivacyPolicy = () => {
    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className={h1Class}>Privacy Policy for Hablabaa</h1><br />
            <p><strong>Effective Date:</strong> 06/28/2024</p>

            <h2>1. Introduction</h2>
            <p>At Hablabaa, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share information when you use our services, including when you use Google OAuth to access our application.</p>

            <h2>2. Information We Collect</h2>
            <p>When you use Google OAuth to sign into our application, we only collect your basic profile information. This includes your name, email address, and profile picture.</p>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information collected through Google OAuth only for Authentication, to verify your identity and keep track of your saved Conversations on our platform.</p>

            <h2>4. Sharing Your Information</h2>
            <p>We do not share your personal information with third parties, except in the following circumstances:</p>
            <ul>
                <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
                <li><strong>To Protect Our Rights:</strong> We may share your information to protect our rights, privacy, safety, or property, and/or that of our users.</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure.</p>

            <h2>6. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. To exercise these rights, please contact us at the link below.</p>

            <h2>7. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website. You are advised to review this Privacy Policy periodically for any changes.</p>

            <h2>8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <a className="text-blue-500 font-bold" href="brianrlam@gmail.com">brianrlam@gmail.com</a>
        </div>
    );
};

export default PrivacyPolicy;
