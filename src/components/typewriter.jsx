import React, { useState, useEffect } from "react";
import "./type.css";

const Typewriter = () => {
    const [text, setText] = useState(""); // Current text being displayed
    const [wordIndex, setWordIndex] = useState(0); // Index of the current word
    const [isErasing, setIsErasing] = useState(false); // Whether it's erasing
    const words = ["Welcome to LoanApp international ltd", "we are your best finance partner", "we offer affordable, friendly loan", "Need assistance?", "kindly surf through our website", 'nad reach out to our help center']; // Words to type
    const typingSpeed = 50; // Speed of typing (ms per character)
    const eraseSpeed = 5; // Speed of erasing (ms per character)
    const pauseAfterTyping = 1000; // Pause after typing a word (ms)

    useEffect(() => {
        let typingTimeout;

        const type = () => {
            const currentWord = words[wordIndex]; // Current word to type/erase

            if (!isErasing) {
                // Typing
                if (text.length < currentWord.length) {
                    setText(currentWord.substring(0, text.length + 1)); // Add next character
                } else {
                    // Finished typing, start erasing after a pause
                    typingTimeout = setTimeout(() => setIsErasing(true), pauseAfterTyping);
                }
            } else {
                // Erasing
                if (text.length > 0) {
                    setText(currentWord.substring(0, text.length - 1)); // Remove last character
                } else {
                    // Finished erasing, move to the next word
                    setIsErasing(false);
                    setWordIndex((prev) => (prev + 1) % words.length); // Go to the next word
                }
            }
        };

        typingTimeout = setTimeout(type, isErasing ? eraseSpeed : typingSpeed);

        return () => clearTimeout(typingTimeout); // Cleanup timeout on unmount or updates
    }, [text, isErasing, wordIndex, words]);

    return <h1 className="typewriter">{text}</h1>;
};

export default Typewriter;
