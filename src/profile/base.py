import json
from flask import Flask, request, jsonify, render_template
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
    unset_jwt_cookies, jwt_required, JWTManager
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import random
import json
from keras.models import load_model
import numpy as np
import pickle
from nltk.stem import WordNetLemmatizer
import nltk
from flask_cors import CORS
from transformers import BartForConditionalGeneration, BartTokenizer
import aiapi
from bson import ObjectId

nltk.download('popular')
lemmatizer = WordNetLemmatizer()

model = load_model('model.h5')
intents = json.loads(open('data.json').read())
words = pickle.load(open('texts.pkl', 'rb'))
classes = pickle.load(open('labels.pkl', 'rb'))
initprompt_value = None


def clean_up_sentence(sentence):
    # tokenize the pattern - split words into array
    sentence_words = nltk.word_tokenize(sentence)
    # stem each word - create short form for word
    sentence_words = [lemmatizer.lemmatize(
        word.lower()) for word in sentence_words]
    return sentence_words

# return bag of words array: 0 or 1 for each word in the bag that exists in the sentence


def bow(sentence, words, show_details=True):
    # tokenize the pattern
    sentence_words = clean_up_sentence(sentence)
    # bag of words - matrix of N words, vocabulary matrix
    bag = [0]*len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                # assign 1 if current word is in the vocabulary position
                bag[i] = 1
                if show_details:
                    print("found in bag: %s" % w)
    return (np.array(bag))


def predict_class(sentence, model):
    # filter out predictions below a threshold
    p = bow(sentence, words, show_details=False)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    # sort by strength of probability
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list


def getResponse(ints, intents_json):
    tag = ints[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if (i['tag'] == tag):
            result = random.choice(i['responses'])
            break
    return result


def predict(msg):
    ints = predict_class(msg, model)
    return ints


def chatbot_response(msg):
    ints = predict(msg)
    res = getResponse(ints, intents)
    return res, get_emotion(ints)


def get_emotion(ints):
    emotions = {
        "sad": ["sad"],
        "cry": ["noanswer", "bad"],
        "love": ["goodbye", "love"]
    }
    createChats = ["chatbot_type", "chatbot_name",
                   "chatbot_color", "chatbot_platform",
                   "chatbot_features", "chatbot_knowledge",
                   "chatbot_help", "chatbot_personalization",
                   "chatbot_functionality", "chatbot_deployment"
                   ]
    emotion = "happy"  # Default emotion is set to "happy"
    tag = ints[0]['intent']

    # Check if a matching emotion is found
    for e, tags in emotions.items():
        if tag in tags:
            emotion = e
            break  # Exit the loop once a matching emotion is found

    # Set createChat based on whether a matching emotion was found or not
    createChat = "create" if tag in createChats else ""

    return emotion, createChat


def generate_Prompt():
    model = BartForConditionalGeneration.from_pretrained(
        'Kaludi/chatgpt-gpt4-prompts-bart-large-cnn-samsum', from_tf=True)

    tokenizer = BartTokenizer.from_pretrained(
        'Kaludi/chatgpt-gpt4-prompts-bart-large-cnn-samsum')
    example_english_phrase = "Your tasks : you have knowledge about insurance, read contract pdf. Your responses : short and detailed. Your writing style : Formal."
    batch = tokenizer(example_english_phrase, return_tensors="pt")
    generated_ids = model.generate(batch["input_ids"], max_new_tokens=200)
    output = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)
    return output[0]


app = Flask(__name__)
CORS(app)
app.static_folder = 'static'
bcrypt = Bcrypt(app)

app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['user']
collection = db['user']
collectionChat = db['chatbots']

documents = collection.find()


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test@gmail.com" or password != "test":
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"access_token": access_token}
    return response


@app.route('/get_email', methods=["GET"])
@jwt_required()  # This decorator ensures the token is valid
def get_email_from_token():
    email = get_jwt_identity()
    return {"email": email}


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route('/profile')
@jwt_required()
def my_profile():
    response_body = {
        "name": "Nagato",
        "about": "Hello! I'm a full stack developer that loves python and javascript"
    }

    return response_body


@app.route('/savedata', methods=['POST'])
def save_data():
    try:
        data = request.json
        username = data['username']
        email = data['email-address']
        password = data['password']

        # Check if the email already exists in the database
        existing_user = collection.find_one({'email': email})
        if existing_user:
            return jsonify({'message': 'Email already exists'}), 400

        hashed_password = bcrypt.generate_password_hash(
            password).decode('utf-8')
        collection.insert_one({
            "username": username,
            "email": email,
            "password": hashed_password
        })
        access_token = create_access_token(identity=email)
        response = {'access_token': access_token}

        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    try:

        data = request.json
        email = data['email']
        password = data['password']

        user = collection.find_one({'email': email})
        if user:
            hashed_password = user['password']
            is_valid = bcrypt.check_password_hash(hashed_password, password)
            if is_valid:
                access_token = create_access_token(identity=email)
                response = {'access_token': access_token}
                return jsonify(response), 200
            else:
                return jsonify({'msg': 'Invalid credentials'}), 401
        else:
            return jsonify({'msg': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @app.route('/saveChatbot', methods=['POST'])
# @jwt_required()
# def saveChatbot():
#     global initprompt_value
#     print(initprompt_value)
#     try:
#         data = request.json
#         email = get_jwt_identity()
#         collectionChat.insert_one({
#             "email": email,
#             "data": data,
#             "prompt": initprompt_value
#         })

#         return jsonify({'msg': 'Save Chatbot Dones'}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
@app.route('/insertChatbot', methods=['POST'])
@jwt_required()
def insertChatbot():
    try:
        email = get_jwt_identity()
        prompt = request.json

        result = collectionChat.insert_one({
            "email": email,
            "prompt": prompt
        })
        print('eeeee', str(result.inserted_id))
        return jsonify({'msg': 'Chatbot Inserted', 'inserted_id': str(result.inserted_id)}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/getprompt/<string:chatbots_id>", methods=['GET'])
def chat1(chatbots_id):
    # Convert the string chatbots_id to ObjectId
    chatbots_id_obj = ObjectId(chatbots_id)

    # Query the database using the ObjectId
    chatbot = collectionChat.find_one({'_id': chatbots_id_obj})

    if chatbot:
        # Extract the 'prompt' field and return it
        prompt = chatbot.get('prompt')
        if prompt:
            return jsonify({'prompt': prompt}), 200
        else:
            return jsonify({"message": "Prompt not found in chatbot"}), 404
    else:
        return jsonify({"message": "Chatbot not found"}), 404


@app.route('/saveChatbot/<string:doc_id>', methods=['POST'])
@jwt_required()
def saveChatbot(doc_id):
    data = request.json
    email = get_jwt_identity()
    chatbots_id_obj = ObjectId(doc_id)
    # Update the document if it exists and belongs to the user's email
    result = collectionChat.update_one(
        {"_id": chatbots_id_obj, "email": email},
        {"$set": {"data": data}}
    )

    if result.matched_count > 0:
        return jsonify({'msg': 'Chatbot Updated'}), 200
    else:
        return jsonify({'msg': 'Chatbot not found or unauthorized'}), 404


@ app.route("/get", methods=["POST"])
def get_bot_response():

    data = request.get_json()
    messages = data.get('message', '')
    result = messages["content"]
   # result = cont.get('content', '')
    userText = result
    print(userText)
    ints = predict(userText)
    res = getResponse(ints, intents)
    emot, crChat = get_emotion(ints)
    return jsonify(response=res, emotion=emot, createChat=crChat)


@ app.route("/getPrompt", methods=["POST"])
def get_generated_prompt():
    global initprompt_value
    data = request.get_json()
    messages = data.get('messages', '')
    print(messages)
    model = BartForConditionalGeneration.from_pretrained(
        'Kaludi/chatgpt-gpt4-prompts-bart-large-cnn-samsum', from_tf=True)

    tokenizer = BartTokenizer.from_pretrained(
        'Kaludi/chatgpt-gpt4-prompts-bart-large-cnn-samsum')
    example_english_phrase = "Your tasks : you have knowledge about insurance, read contract pdf. Your responses : short and detailed. Your writing style : Formal."
    batch = tokenizer(messages, return_tensors="pt")
    generated_ids = model.generate(batch["input_ids"], max_new_tokens=200)
    output = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)
    resultt = output[0]
    initprompt_value = resultt
    return jsonify(result=resultt)


################## OPEN AI OPEN AI #######################################


@app.route("/initialpompt", methods=['GET'])
def initi():
    global initprompt_value
    return initprompt_value


@app.route("/openaires", methods=['POST'])
def index():
    data = request.json
    prompt = data.get('prompt')
    print(prompt)
    initprom = data.get('initprom')
    global initprompt_value
    answer = aiapi.generate_chatbot_response(prompt, initprom)

    # Replace <br> tags with line breaks
    answer = answer.replace('<br>', '\n')

    res = {"answer": answer}
    print(res)
    return jsonify(result=res), 200


@app.route("/chatboturl/<string:chatbots_id>", methods=['GET'])
def chat(chatbots_id):
    # Convert the string chatbots_id to ObjectId
    chatbots_id_obj = ObjectId(chatbots_id)

    # Query the database using the ObjectId
    chatbot = collectionChat.find_one({'_id': chatbots_id_obj})

    if chatbot:
        # Convert the ObjectId to its string representation
        chatbot['_id'] = str(chatbot['_id'])
        return jsonify(chatbot), 200
    else:
        return jsonify({"message": "Chatbot not found"}), 404


@app.route('/get_data', methods=['GET'])
@jwt_required()  # Requires a valid JWT token
def get_data():
    email = get_jwt_identity()

    # Query MongoDB for data
    data = collectionChat.find({'email': email})

    result = []
    for entry in data:
        result.append({
            'email': entry.get('email'),
            'prompt': entry.get('prompt'),
            '_id': str(entry.get('_id')),
            'chatIconColor': entry.get('data').get('chatIconColor'),
            'firstbotletter': entry.get('data').get('firstbotletter'),
            'botName': entry.get('data').get('botName')

            # Add more fields as needed
        })

    return jsonify(result)


@app.route('/delete_chatbot/<string:chatbot_id>', methods=['DELETE'])
@jwt_required()  # Requires a valid JWT token
def delete_chatbot(chatbot_id):
    email = get_jwt_identity()

    # Check if the chatbot belongs to the current user
    chatbot = collectionChat.find_one(
        {'_id': ObjectId(chatbot_id), 'email': email})
    if chatbot is None:
        return jsonify({'message': 'Chatbot not found or unauthorized'}), 403

    # Delete the chatbot
    collectionChat.delete_one({'_id': ObjectId(chatbot_id)})

    return jsonify({'message': 'Chatbot deleted successfully'}), 200


if __name__ == "__main__":
    app.run()
