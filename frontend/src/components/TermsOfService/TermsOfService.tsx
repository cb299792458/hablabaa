import { h1Class } from "../../styles";

const TermsOfService = () => {
    return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 className={h1Class}>Terms of Service for Hablabaa</h1><br />

        <h2>1. Introduction</h2>
        <p>Welcome to Hablabaa! These terms and conditions outline the rules and regulations for the use of Hablabaa's website and services.</p>

        <h2>2. Acceptance of Terms</h2>
        <p>By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>

        <h2>3. Description of Service</h2>
        <p>Hablabaa is an AI powered app for foreign language practice. Using your voice or your keyboard, practice conversing with our chatbot in the language of your choice.</p>


        <h2>4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <a className="text-blue-500 font-bold" href="brianrlam@gmail.com">brianrlam@gmail.com</a>
    </div>
    );
};

export default TermsOfService;
