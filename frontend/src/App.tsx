import './App.css';
import ChatBox from './components/ChatBox';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
function App() {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/" element={<ChatBox />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
