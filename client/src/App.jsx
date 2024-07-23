import React, { useState } from 'react';
import './App.css';
import { LampDemo } from './assets/Lamp';

/**
 * App component for text embedding, auto-completion, and game commands.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
    const [text, setText] = useState('');
    const [question, setQuestion] = useState('');
    const [prefix, setPrefix] = useState('');
    const [gameCommand, setGameCommand] = useState('');
    const [currentLocation, setCurrentLocation] = useState('');
    const [embeddings, setEmbeddings] = useState(null);
    const [answer, setAnswer] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [gameResponse, setGameResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:3000/api';

    /**
     * Generic function to make API requests.
     * @param {string} endpoint - The API endpoint.
     * @param {object} body - The request body.
     * @returns {Promise<object>} The response data.
     */
    const makeRequest = async (endpoint, body) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Server response was not ok');
            }

            return await response.json();
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle embedding request.
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleEmbeddings = async (e) => {
        e.preventDefault();
        setEmbeddings(null);

        try {
            const data = await makeRequest('/embed', { text });
            setEmbeddings(data.embeddings);
        } catch (error) {
            console.error('Error getting embeddings:', error);
        }
    };

    /**
     * Handle answer request.
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleAnswer = async (e) => {
        e.preventDefault();
        setAnswer('');

        try {
            const data = await makeRequest('/answer', { question });
            setAnswer(data.answer);
        } catch (error) {
            console.error('Error getting answer:', error);
        }
    };

    /**
     * Handle autocomplete request.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleAutocomplete = async (e) => {
        setPrefix(e.target.value);
        setSuggestions([]);

        try {
            const data = await makeRequest('/autocomplete', { prefix: e.target.value });
            setSuggestions(data.suggestions);
        } catch (error) {
            console.error('Error getting autocomplete suggestions:', error);
        }
    };

    /**
     * Handle game command request.
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleGameCommand = async (e) => {
        e.preventDefault();
        setGameResponse(null);

        try {
            const data = await makeRequest('/game', { command: gameCommand, currentLocation });
            setGameResponse(data);
            setCurrentLocation(data.location);
        } catch (error) {
            console.error('Error processing game command:', error);
        }
    };

    /**
     * Handle suggestion click.
     * @param {string} suggestion - The selected suggestion.
     */
    const handleSuggestionClick = (suggestion) => {
        setPrefix(suggestion);
        setSuggestions([]);
    };

    return (
        <div>
               
            <div className='App'>
                <h1>Text Embedding, Auto-completion, and Game Commands</h1>
                
                <form onSubmit={handleAnswer}>
                    <h2>Ask a question Like Capital of India</h2>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question"
                    />
                    <button type="submit" disabled={isLoading}>Get Answer</button>
                    {answer && <p>Answer: {answer}</p>}
                </form>

                <form onSubmit={handleEmbeddings}>
                    <h2>Get Embeddings Of Any text</h2>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text for embedding"
                    />
                    <button type="submit" disabled={isLoading}>Get Embedding</button>
                    {embeddings && <p>Embeddings: {JSON.stringify(embeddings)}</p>}
                </form>

              

                <form onSubmit={handleGameCommand}>
                    <h2>Game Command Type Swim or Mountain</h2>
                    <input
                        type="text"
                        value={gameCommand}
                        onChange={(e) => setGameCommand(e.target.value)}
                        placeholder="Enter game command"
                    />
                    <input
                        type="text"
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        placeholder="Current location (optional)"
                    />
                    <button type="submit" disabled={isLoading}>Send Command</button>
                    {gameResponse && (
                        <div>
                            <p>Location: {gameResponse.location}</p>
                            <p>Description: {gameResponse.description}</p>
                        </div>
                    )}
                </form>

                <div>
                    <h2>Auto-complete Type ca or Mo</h2>
                    <input
                        type="text"
                        value={prefix}
                        onChange={handleAutocomplete}
                        placeholder="Start typing..."
                    />
                    {suggestions.length > 0 && (
                        <ul>
                            {suggestions.map((suggestion, index) => (
                                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {isLoading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
            </div>
            <LampDemo/>
        </div>
    );
}

export default App;