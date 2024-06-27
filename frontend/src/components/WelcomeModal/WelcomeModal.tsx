import Modal from "react-modal"
import { Language } from "../../types";
import { blueButtonClass, h2Class, inputClass, modalStyle } from "../../styles";
import posthog from 'posthog-js'

Modal.setAppElement('#root');
posthog.init('phc_Kz2UulgJvjU0LU32hr7LzOyRn8entzJ77AmwAiMtMan',
    {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    }
)

const WelcomeModal = ({
    showWelcomeModal, setShowWelcomeModal,
    userName, setUserName, botName, setBotName,
    practiceLanguage, setPracticeLanguage,
    preferredLanguage, setPreferredLanguage,
    setShowSessionModal, saveConversation, 
    email, 
}: {
    showWelcomeModal: boolean,
    setShowWelcomeModal: (showWelcomeModal: boolean) => void,
    userName: string,
    setUserName: (userName: string) => void,
    botName: string,
    setBotName: (botName: string) => void,
    practiceLanguage: string,
    setPracticeLanguage: (practiceLanguage: string) => void,
    preferredLanguage: string,
    setPreferredLanguage: (preferredLanguage: string) => void,
    setShowSessionModal: (showSessionModal: boolean) => void,
    saveConversation: () => Promise<void>,
    email: string,
}) => {
    const handleClick = async () => {
        posthog.capture('conversation_started', {
            user_name: userName,
            bot_name: botName,
            practice_language: practiceLanguage,
            preferred_language: preferredLanguage,
        });
        setShowWelcomeModal(false);
        if (email) {
            await saveConversation();
        }
    }

    const switchToSessionModal = () => {
        setShowWelcomeModal(false);
        setShowSessionModal(true);
    }
    return <Modal
        isOpen={showWelcomeModal}
        contentLabel="Welcome Modal"
        style={modalStyle}
    >
        <h2 className={h2Class}>Welcome!</h2>
        <p className="max-w-lg">
            Welcome to Hablabaa, a free app for language practice.
            Try speaking in your chosen foreign language into your microphone, and when you
            pause, the AI will respond in the same language. Transcriptions and
            translations will also be shown to assist your understanding. You can also type your message 
            instead by clicking the input button on the right. Enjoy! ¡Pa'lante! 加油!
        </p>
        <br/>

        <div className="flex justify-center mb-4">
            <img src='lambs.png' alt="lambs" className="w-80 h-auto max-w-full"/>
        </div>

        Your Name:{" "}
        <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={inputClass}
        /><br/>
        Chat Bot's Name:{" "}
        <input
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className={inputClass}
        /><br/>
        
        I want to practice my:{" "}
        <select onChange={(e) => setPracticeLanguage(e.target.value)} value={practiceLanguage} className={inputClass}>
            {Object.entries(Language).map(([name, code]) => <option value={code} key={code}>{name.replace('_', " ")}</option>)}
        </select><br/>

        Translate for me into:{" "} 
        <select onChange={(e) => setPreferredLanguage(e.target.value)} value={preferredLanguage} className={inputClass}>
            {Object.entries(Language).map(([name, code]) => <option value={code} key={code}>{name.replace('_', " ")}</option>)}
        </select><br/>

        <div
            className="flex justify-between mt-2"
        >
            <button onClick={handleClick} className={blueButtonClass}>
                Let's Chat!
            </button>

            {!email && <button onClick={switchToSessionModal} className={blueButtonClass}>
                Sign In and Load Previous Conversation
            </button>}
        </div>
    </Modal>
}

export default WelcomeModal;
