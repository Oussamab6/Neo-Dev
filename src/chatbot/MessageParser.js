import axios from 'axios';

class MessageParser {
  constructor(actionProvider, initprompt) {
    this.actionProvider = actionProvider;
    this.initprompt = initprompt;
  }

  parse(message) {
    console.log(JSON.stringify({ prompt: message }));
    axios({
      method: 'POST',
      url: '/openaires',
      headers: {
        'Content-Type': 'application/json', // Set the Content-Type header manually
      },
      data: JSON.stringify({ prompt: message, initprom: this.initprompt }),
    })
      .then((response) => {
        console.log('heloo', this.initprompt);
        this.actionProvider.greet(response.data.result.answer);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    // console.log(message);
    // const lowercase = message.toLowerCase();

    // if (lowercase.includes('hello')) {
    //   this.actionProvider.greet();
    // }

    // if (lowercase.includes('javascript') || lowercase.includes('js')) {
    //   this.actionProvider.handleJavascriptQuiz();
    // }
  }
}

export default MessageParser;
