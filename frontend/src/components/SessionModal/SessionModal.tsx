import React from 'react';
import Modal from 'react-modal';
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { Conversation, languageNames } from '../../types';
import { modalStyle } from '../../styles';
import axios from 'axios';

Modal.setAppElement('#root');

const SessionModal = ({
    showSessionModal,
    setShowSessionModal,
    email,
    setEmail,
    loadConversation
}: {
    showSessionModal: boolean,
    setShowSessionModal: (showSessionModal: boolean) => void,
    email: string,
    setEmail: (email: string) => void,
    loadConversation: (conversationId: number) => void
}) => {
    const [error, setError] = React.useState<string>('');
    const [conversations, setConversations] = React.useState<Conversation[]>([]);
    
    React.useEffect(() => {
        const loadConversations = async () => {
            if (!email) return;
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/apples/conversation_list/`, {params: {email}});
                setConversations(response.data);
            } catch (err) {
                console.error(err);
                setError('Sorry, we couldn\'t load your conversations.\nTry again later.');
            }
        };
        loadConversations();
    }, [email]);

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
    }

    return <Modal
        isOpen={showSessionModal}
        contentLabel="Session Modal"
        style={modalStyle}
        onRequestClose={() => setShowSessionModal(false)}
    >
        <div
            className='flex justify-center mb-4'
        >
            <GoogleLogin onSuccess={handleSuccess} />
        </div>
        {!email && <p>Sign in to load a saved Conversation</p>}
        {email && (conversations.length ? <ul>
            {conversations.map((conversation) => <li
                key={conversation.id}
                onClick={() => handleClick(conversation.id)}
                className='cursor-pointer hover:bg-gray-200 p-2 rounded-md'
            >
                {`${conversation.userName}'s conversation with ${conversation.botName},
                in ${languageNames[conversation.practiceLanguage]}, from
                ${(new Date(conversation.startedAt)).toLocaleString()}`}
            </li>)}
        </ul> : <ul><li>No Conversations Found</li></ul>)}
        {error && <p>{error}</p>}
    </Modal>
}

export default SessionModal;
