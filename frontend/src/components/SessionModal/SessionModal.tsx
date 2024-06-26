import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { Conversation, languageNames } from '../../types';
import { modalStyle } from '../../styles';

Modal.setAppElement('#root');

const SessionModal = ({
    showSessionModal,
    setShowSessionModal,
    email,
    setEmail,
    loadConversation,
    saveConversation,
    conversationId,
    messagesLength,
    createNewConversation,
}: {
    showSessionModal: boolean,
    setShowSessionModal: (showSessionModal: boolean) => void,
    email: string,
    setEmail: (email: string) => void,
    loadConversation: (conversationId: number) => void,
    saveConversation: () => Promise<Conversation>,
    conversationId: number,
    messagesLength: number,
    createNewConversation: () => void,
}) => {
    const [error, setError] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [conversations, setConversations] = React.useState<Conversation[]>([]);
    
    React.useEffect(() => {
        const loadConversations = async () => {
            if (!email) return;
            setLoading(true);
            if (messagesLength) await saveConversation();
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/apples/conversation_list/`, {params: {email}});
                setConversations(response.data);
            } catch (err) {
                console.error(err);
                setError('Sorry, we couldn\'t load your conversations.\nTry again later.');
            }
            setLoading(false);
        };
        loadConversations();

    // eslint-disable-next-line
    }, [email, showSessionModal]);

    const handleSuccess = (response: CredentialResponse) => {
        try {
            const {credential} = response;
            const tokenPayload = credential?.split('.')[1] || '';
            const decodedPayload = JSON.parse(window.atob(tokenPayload));
            setEmail(decodedPayload.email);
        } catch (err) {
            console.error(err);
            setError('Sorry, we couldn\'t verify your Google Account.\nTry another account or try again later.');
        }
    };

    const handleClick = (id: number) => {
        loadConversation(id);
        setShowSessionModal(false);
    };

    return <Modal
        isOpen={showSessionModal}
        contentLabel="Session Modal"
        style={modalStyle}
        onRequestClose={() => setShowSessionModal(false)}
    >
        <div
            className='flex justify-around mb-4'
        >
            <GoogleLogin onSuccess={handleSuccess} />
            <button onClick={createNewConversation} className='ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                Start New Conversation
            </button>
        </div>
        {!email && <div className='flex justify-center w-full'><p className='text-center'>Sign in to save/load conversations.</p></div>}
        {email && (conversations.length ? <ul>
            {conversations.map((conversation) => <li
                key={conversation.id}
                onClick={() => handleClick(conversation.id)}
                className={`cursor-pointer hover:bg-gray-200 p-2 rounded-md 
                    ${conversationId === conversation.id ? 'font-bold' : ''}`}
            >
                {`${conversation.userName}'s conversation with ${conversation.botName},
                in ${languageNames[conversation.practiceLanguage]}, from
                ${(new Date(conversation.startedAt)).toLocaleString()}`}
            </li>)}
        </ul> : <ul><li>{loading ? 'Loading Conversations...' : 'No Conversations Found'}</li></ul>)}
        {error && <p>{error}</p>}
    </Modal>
};

export default SessionModal;
