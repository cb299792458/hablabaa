import React from "react";
import axios from "axios";
import { delay } from "lodash";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { Language, Message, Options, languageNames } from "../../types";
import MessageRow from "../MessageRow";
import WelcomeModal from "../WelcomeModal";
import OptionsModal from "../OptionsModal";
import DictionaryModal from "../DictionaryModal";
import SessionModal from "../SessionModal";

import { blueButtonClass, greenButtonClass, h1Class } from "../../styles";

const googleCloudApiKey: string | undefined = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;

// TODO: move this to the backend and remove dangerouslyAllowBrowser
const openAiApiKey: string | undefined = process.env.REACT_APP_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: openAiApiKey, dangerouslyAllowBrowser: true });

const ChatBox: React.FC = () => {
    const [showWelcomeModal, setShowWelcomeModal] = React.useState<boolean>(true);
    const [showOptionsModal, setShowOptionsModal] = React.useState<boolean>(false);
    const [showDictionaryModal, setShowDictionaryModal] = React.useState<boolean>(false);
    const [showSessionModal, setShowSessionModal] = React.useState<boolean>(false);

    const [userName, setUserName] = React.useState<string>("Guest");
    const [botName, setBotName] = React.useState<string>("Niki");
    const [email, setEmail] = React.useState<string>("");
    const [options, setOptions] = React.useState<Options>({
        autoplayResponseAudio: true,
        hideUserMessageText: false,
        hideUserMessageTranslation: false,
        hideResponseText: false,
        hideResponseTranslation: false,
    });
    const focused = !showOptionsModal && !showWelcomeModal && !showDictionaryModal;
    
    const [practiceLanguage, setPracticeLanguage] = React.useState<string>("es-ES");
    const [preferredLanguage, setPreferredLanguage] = React.useState<string>("en-US");

    const [input, setInput] = React.useState<string>("");
    const [messages, setMessages] = React.useState<Message[]>([]);

    const [speaking, setSpeaking] = React.useState<boolean>(false);
    const [thinking, setThinking] = React.useState<boolean>(false);
    
    const getTranslation = async (text: string) => {
        if (practiceLanguage === preferredLanguage) return text;
        
        const body = {
            q: text,
            source: practiceLanguage,
            target: preferredLanguage,
        };
        
        const res = await axios.post(
            `https://translation.googleapis.com/language/translate/v2?key=${googleCloudApiKey}`, 
            body);
        return res.data.data.translations[0].translatedText;
    }
    
    const addMessage = async (text: string) => {
        const translation = await getTranslation(text);
        
        const newMessage: Message = {
            fromUser: true,
            source: practiceLanguage as Language,
            target: preferredLanguage as Language,
            text,
            translation,
        };
        setMessages((oldMessages) => [...oldMessages, newMessage]);

        setThinking(true);
    };
    
    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (listening || thinking || speaking) return;
        await addMessage(input);
        setInput("");
    };

    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
    } = useSpeechRecognition();
    
    const listenContinuously = () => {
        if (!focused){
            SpeechRecognition.stopListening();
            return () => {};
        };
        SpeechRecognition.startListening({
            continuous: true,
            language: practiceLanguage,
        });

        return () => SpeechRecognition.stopListening();
    };
    
    React.useEffect(listenContinuously, [focused, practiceLanguage]);
    React.useEffect(() => {if (transcript && listening && !thinking && !speaking && focused) setInput(transcript)}, [transcript, listening, thinking, speaking, focused]);
    React.useEffect(() => {
        if (!focused || thinking || speaking) {
            resetTranscript();
            return;
        };
        if (finalTranscript) {
            addMessage(finalTranscript);
            resetTranscript();
            setInput("");
        };
        // eslint-disable-next-line
    }, [interimTranscript, finalTranscript, messages]);
    React.useEffect(() => {
        if (!thinking) return;
        
        const addReply = async () => {
            const systemMessage: ChatCompletionMessageParam[] = [
                {
                    role: "system",
                    content: `You are the user ${userName}'s friend ${botName}, who is helping them practice their ${practiceLanguage}. 
                    You can talk to them in ${practiceLanguage}, but their preferred language is ${preferredLanguage}.`,
                }
            ]
            const pastMessages: ChatCompletionMessageParam[] = messages.map((message) => ({
                role: message.fromUser ? "user" : "assistant",
                content: message.text,
            }));
            
            let text: string = '';

            // try {
            //     const res = await axios.post(
            //         `${process.env.REACT_APP_API_BASE_URL}/chatbot/chat/`,
            //         {messages: systemMessage.concat(pastMessages)},
            //     );
            //     text = res.data.message;
            // } catch {
                const completion = await openai.chat.completions.create({
                    messages: systemMessage.concat(pastMessages),
                    model: "gpt-3.5-turbo",
                    max_tokens: 100,
                });
                if (completion.choices && completion.choices.length) {
                    text = completion.choices[0].message.content || '';
                };
            // }

            const translation = await getTranslation(text);
            
            const newMessage: Message = {
                fromUser: false,
                source: preferredLanguage as Language,
                target: practiceLanguage as Language,
                text,
                translation,
            };
    
            setMessages((oldMessages) => [...oldMessages, newMessage]);
    
            setThinking(false);
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        };

        delay(addReply, 1000); // wait 1000 ms for "thinking"

    // eslint-disable-next-line
    }, [thinking]);

    const handleToggleMode = () => {
        setInput("");
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            listenContinuously();
        }
    };

    const undoLastMessages = () => {
        if (messages.length <= 1 || thinking || speaking) return;
        setMessages(() => messages.slice(0, -2));
    };

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) return <h1>Your browser does not support speech recognition software! Try Chrome desktop, maybe?</h1>;
    return (
        <div>
            <SessionModal
                showSessionModal={showSessionModal}
                setShowSessionModal={setShowSessionModal}
                email={email}
                setEmail={setEmail}
            />
            <WelcomeModal 
                showWelcomeModal={showWelcomeModal}
                setShowWelcomeModal={setShowWelcomeModal}
                userName={userName}
                setUserName={setUserName}
                botName={botName}
                setBotName={setBotName}
                practiceLanguage={practiceLanguage}
                setPracticeLanguage={setPracticeLanguage}
                preferredLanguage={preferredLanguage}
                setPreferredLanguage={setPreferredLanguage}
            />
            <OptionsModal
                showOptionsModal={showOptionsModal}
                setShowOptionsModal={setShowOptionsModal}
                practiceLanguage={practiceLanguage}
                setPracticeLanguage={setPracticeLanguage}
                preferredLanguage={preferredLanguage}
                setPreferredLanguage={setPreferredLanguage}
                options={options}
                setOptions={setOptions}
            />
            <DictionaryModal
                showDictionaryModal={showDictionaryModal}
                setShowDictionaryModal={setShowDictionaryModal}
                translatedLanguage={practiceLanguage as Language}
                originalLanguage={preferredLanguage as Language}
            />

            <h1 className={h1Class}>Chat Ni Ichi</h1>
            <br/>
            <button
                onClick={() => setShowDictionaryModal(!showDictionaryModal)}
                className={greenButtonClass}
            >
                Translation Dictionary
            </button>
            <button
                onClick={() => setShowSessionModal(!showSessionModal)}
                className={greenButtonClass}
            >
                Load Conversation
            </button>

            <div className="flex justify-center items-center">
                <button onClick={undoLastMessages}
                    className={`${greenButtonClass} ${messages.length<2 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                    {'<- Undo Previous Message'}
                </button>
                <form onSubmit={sendMessage} className="flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => !listening && setInput(e.target.value)}
                        className="px-4 py-2 border border-gray-500 rounded-md focus:border-green-500 m-10 w-96 md:w-128"
                        placeholder={listening ? `Speak in ${languageNames[practiceLanguage].replace('_', " ")} into your microphone...` : "Type your message here..."}
                    />
                    <button type="submit"
                        className={greenButtonClass}
                    >
                        {listening ? '<- This is what I\'ve heard!' : '-> Send your typed message!'}
                    </button>
                </form>
            </div>

            <br/>

            <div id="main" className="flex">
                <div id="left" className="p-4 min-w-[320px] flex flex-col items-center">
                    <img src="default.png" alt="default" width={250}/>
                    <span>{userName}</span>
                    <button
                        onClick={() => setShowOptionsModal(!showOptionsModal)}
                        className={blueButtonClass}
                    >
                        Show Options
                    </button>
                </div>

                <div id="center" className="p-4 flex-grow">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="text-green-700 border w-1/10">From</th>
                                <th className="text-green-700 border w-2/5">Text<br/>({languageNames[practiceLanguage].replace('_', " ")})</th>
                                <th className="text-green-700 border w-2/5">Translation<br/>({languageNames[preferredLanguage].replace('_', " ")})</th>
                                <th className="text-green-700 border w-1/10">Play<br/>Audio</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-500 space-x-2">
                            {messages.map((message, i) => <MessageRow
                                message={message} key={i}
                                userName={userName}
                                botName={botName}
                                options={options} 
                                speaking={speaking}
                                setSpeaking={setSpeaking}
                                />
                            )}
                        </tbody>
                    </table>
                </div>

                <div id="right" className="p-4 min-w-[320px]">
                    <div className="flex flex-col items-center">
                        {
                            thinking ? <div>
                                <img src="thinking.png" alt="thinking" width={250}/>
                                <span>{botName} is thinking about how to respond...</span>
                            </div>
                            : speaking ? <div>
                                <img src="speaking.png" alt="speaking" width={250}/>
                                <span>{botName} is speaking...</span>
                            </div>
                            : listening ? <div>
                                <img src="listening.png" alt="listening" width={250}/>
                                <span>{botName} is listening to you speak.</span>
                            </div>
                            : <div>
                                <img src="reading.png" alt="reading" width={250}/>
                                <span>{botName} is ready to read your message.</span>
                            </div>
                        }
                    </div>

                    <button onClick={handleToggleMode}
                        className={blueButtonClass}
                    >
                        {listening ? 'Pause Listening for Typing Input' : 'Switch back to Speaking Input'}
                    </button>
                </div>
            </div>

            <h4
                className="absolute bottom-0 text-gray-500 p-4 w-full text-center"
            >
                Developed by <a className="text-blue-500 font-bold" href="https://www.linkedin.com/in/brian-lam-software-developer/">Brian Lam</a>
            </h4>
        </div>
    );
};

export default ChatBox;
