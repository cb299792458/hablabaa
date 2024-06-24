import React from 'react';
import Modal from 'react-modal';
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { modalStyle } from '../../styles';

Modal.setAppElement('#root');

const SessionModal = ({
    showSessionModal,
    setShowSessionModal,
    email,
    setEmail,
}: {
    showSessionModal: boolean,
    setShowSessionModal: (showSessionModal: boolean) => void,
    email: string,
    setEmail: (email: string) => void,
}) => {
    const [error, setError] = React.useState<string>('');
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
    return <Modal
        isOpen={showSessionModal}
        contentLabel="Session Modal"
        style={modalStyle}
    >
        <GoogleLogin onSuccess={handleSuccess} />
        {email && <p>Logged in as {email}</p>}
        {error && <p>{error}</p>}
        <button onClick={() => setShowSessionModal(false)}>Close</button>
    </Modal>
}

export default SessionModal;
