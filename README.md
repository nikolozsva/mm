# Mind Match

This project is a chat application that aims to personalize the learning experience by adapting to the user's unique learning style and interests. It leverages the power of Google's large language model, Gemini, to engage in conversations and generate quizzes to evaluate the user's knowledge.

## Features

* **Learning Style Detection:**  Users can either specify their preferred learning style (visual, auditory, reading/writing) or take a quiz to identify it.
* **Interest-Based Conversations:** The chatbot adapts its communication style and content based on the user's stated hobbies, expertise, childhood interests, and age range. 
* **Knowledge Evaluation:**  After finishing a chat, the application generates a quiz to test the user's understanding of the information discussed.
* **User Profile:**  User data about learning styles and interests are saved and used to personalize future interactions. 

## Technical Stack

* **Frontend:** React, Material UI (Joy UI), Firebase Authentication
* **Backend:** Node.js, Express, Google Generative AI (Gemini)
* **Database:** Firestore

## Setup 

**Set up Firebase:**

    * Create a Firebase project and enable Firestore and Authentication.
    * Add your Firebase service account details to `./backend/src/configs/firebase_key.json`.
    * Add your Firebase Config details to `./frontend/src/firebase/config.js`.

**Set up Google Generative AI (Gemini):**

    * Obtain an API key for Gemini and add it to `./backend/src/configs/gemini_key.json`.

## Disclaimer

This project is a proof of concept and is not intended for production use. The accuracy and reliability of the chatbot and quizzes are not guaranteed.
Use code with caution.
