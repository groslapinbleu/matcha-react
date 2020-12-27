import React, { Component } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Message from "../components/Message"
import Spinner from 'react-loader-spinner'
import CheckButton from '../components/CheckButton';
import { isEmptyString } from '../helpers/validation'
import { withFirebase } from '../services/Firebase'

class MessagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      messages: [],
      text: '',
      error: null,
      loadingMessages: false,
      limit: 10
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    this.onListenForMessages()
  }

  onListenForMessages = () => {
    const { auth, messages } = this.props.firebase
    this.setState({ user: auth.currentUser })
    this.setState({ error: null, loadingMessages: true });
    const chatArea = this.myRef.current;
    try {
      messages()
        .orderByChild('createdAt')
        .limitToLast(this.state.limit)
        .on("value", snapshot => {
          const messageObject = snapshot.val();

          if (messageObject) {
            const messages = Object.keys(messageObject).map(key => ({
              ...messageObject[key],
              uid: key,
            }))
            this.setState({ messages, loadingMessages: false });
            chatArea.scrollBy(0, chatArea.scrollHeight);
          } else {
            this.setState({ messages: [], loadingMessages: false })
          }
        })
    } catch (error) {
      this.setState({ error: error.message, loadingMessages: false });
    }
  }

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  handleChange(event) {
    this.setState({
      text: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!isEmptyString(this.state.text)) {
      const { messages } = this.props.firebase
      this.setState({ error: null });
      const chatArea = this.myRef.current;
      try {
        await messages().push({
          // await setArrayValue("messages",{
          // db.ref(ref).push(data)
          text: this.state.text,
          createdAt: Date.now(),
          userId: this.state.user.uid,
          displayName: this.state.user.displayName
        });
        this.setState({ text: '' });
        chatArea.scrollBy(0, chatArea.scrollHeight);
      } catch (error) {
        this.setState({ error: error.message });
      }
    }
  }


  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForMessages,
    )
  }

  onRemoveMessage = uid => {
    console.log("trying to remove message with uid = " + uid)
    this.props.firebase.message(uid).remove()
  }

  render() {
    return (
      <div className="">

        <Header />
        <button type="button" className="m-2 p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" onClick={this.onNextPage}>Get more messages</button>

        <div className="mt-8 p-6 h-2/3 overflow-y-scroll bg-indigo-50" ref={this.myRef}>
          {this.state.loadingMessages
            ? <div className="flex items-center justify-center"><Spinner type='Puff' color='#038E9F' height={50} width={50} /></div>
            : ""}
          {/* chat area */}
          {this.state.messages.map(chat => {
            return <Message key={chat.createdAt} user={this.state.user} chat={chat} onRemoveMessage={this.onRemoveMessage}></Message>
          })}
        </div>
        <form onSubmit={this.handleSubmit} className="flex mx-auto max-w-2xl">
          <textarea className="border-solid border-2 w-full rounded-lg " name="text" onChange={this.handleChange} value={this.state.text} ></textarea>
          {/* <button type="submit" className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white">Send</button> */}
          <CheckButton />
          {this.state.error ? <p className="text-red-500">{this.state.error}</p> : null}
        </form>
        <Footer></Footer>
      </div>
    );
  }
}

export default withFirebase(MessagePage)