import { samplePhrases } from './prompts/movie-critic';
// import { samplePhrases } from "./prompts/tour-guide";
import {
  userQuestions,
  chatbotQuestions,
  userSuggestions,
} from './prompts/user-guide';

export const appConfig = {
  historyLength: 8,
  samplePhrases,
  userQuestions,
  chatbotQuestions,
  userSuggestions,
};
