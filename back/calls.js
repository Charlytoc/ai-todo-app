import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

// Define actions that can be executed within the application
const actions = {
    ask: `
    ACTION: ASK

    ACTION PARAMETERS: string[]
    PARAMETERS_EXPLANATION: Each variable slug is a string that represents the variable name that you want to ask the user for. For example: ["title", "description"]

    DESCRIPTION: When you need information from the user, you display inputs to let the user provide the needed information. 
    RULES: Never ask more than 2 questions at a time. Always give a version of the todo before asking for information.
    EXECUTION: 
    __action:ask__
    ["some_variable_name"]
    __action_end__
    `,
}

// System prompt that guides the AI on how to interact with the user
const system_prompt = `
 Your are a friendly AI working in the backend of a Todo's application.

 Your task is simple, help the user to solve its todo until the todo is finished.

 You can also execute some actions in the application.
 These are your available actions:

 """
 ${actions.ask}

 """

 You must always **provide a version** of the todo, and then **execute actions** if needed.
 Always format as markdown unless the user requires a different format. with the --format flag.


 This is an example of a conversation between the user and the AI:
 """
    user message: I want to create a letter
    AI response: Dear [Recipient Name],
    I hope this letter finds you in good health and high spirits. I am writing to you to [state the purpose of the letter, e.g., update you on recent developments, request information, etc.].
    [Include the main content of the letter, providing all necessary details in a clear and concise manner.]
    I look forward to your response and hope to hear from you soon. Please feel free to contact me if you have any questions or need further clarification.
    Warm regards,
    [Your Name]

    ---

    A comment for the user, explaining the next steps or asking for more information.

    __action:ask__
    ["title", "description"]
    __action_end__

    __action:action_name__
    action_arguments
    __action_end__
 """

 Always answer in the user's language. Also, the questions that you make, should be in the user's language.
`

// Function to remove a specific section from a string
function removeSectionFromString(inputString, startSubstring, stopSubstring) {
    const startIndex = inputString.indexOf(startSubstring);
    const stopIndex = inputString.indexOf(stopSubstring, startIndex);

    if (startIndex === -1 || stopIndex === -1) {
        return inputString; // Substrings not found, return original string
    }
    // Remove section from start to end of stop substring
    return inputString.slice(0, startIndex) + inputString.slice(stopIndex + stopSubstring.length);
}

// Function to extract action arguments from a string
function extractActionArguments(inputString) {
    // Check if action tags are present
    if (!inputString.includes('__action:') || !inputString.includes('__action_end__')) {
        return { actionName: null, actionArgs: null, withoutAction: inputString }; // No action needed
    }

    // Extract action name
    const actionName = inputString.split('__action:')[1].split('__')[0];

    // Extract content inside the action tags
    const actionArgs = inputString.split(`__action:${actionName}__`)[1].split('__action_end__')[0].trim();

    // Remove the action section from the input string
    const withoutAction = removeSectionFromString(inputString, '__action:', '__action_end__');

    return { actionName, actionArgs, withoutAction };
}

// Async function to get a draft response from the AI based on the user's todo
const getDraftFromAI = async ({ title, draft, inputsObject }) => {

    // Construct the prompt for the AI
    const prompt = `
    The title of the todo is: ${title}
    This is the current draft: 
    """
    ${draft}
    """
    Context inputs of the conversation:
    """
    ${JSON.stringify(inputsObject)}
    """
    `

    // Create a chat completion with OpenAI
    const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: system_prompt,
            },
            { role: 'user', content: prompt }],
        model: 'gpt-4-vision-preview',
        max_tokens: 2000,
        stream: false,
    });
    // Extract the AI's message from the response
    const aiMessage = chatCompletion["choices"][0]["message"]["content"]
    // Return the extracted action arguments from the AI's message
    return extractActionArguments(aiMessage)
}

export { getDraftFromAI };