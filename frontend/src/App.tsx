import './App.css';
import ChatBox from './components/ChatBox';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <div className="App">
                <ChatBox />
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
