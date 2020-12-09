import React, { Component } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Spinner from 'react-loader-spinner'
// import { auth } from "../services/firebase";
// import {getValues, setArrayValue } from "../helpers/database"
import { FirebaseContext } from '../services/Firebase'

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      messages: [],
      text: '',
      error: null,
      loadingMessages: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    const { auth, messages } = this.context
    this.setState({ user: auth.currentUser })
    this.setState({ error: null, loadingMessages: true });
    const chatArea = this.myRef.current;
    try {
      //getValues("messages", snapshot => {
      // this.context.db.ref("messages").on("value", snapshot => {
        messages().on("value", snapshot => {
        let messages = [];
        snapshot.forEach((snap) => {
          messages.push(snap.val());
        });
        messages.sort(function (a, b) { return a.createdAt - b.createdAt; });
        this.setState({ messages });
        chatArea.scrollBy(0, chatArea.scrollHeight);
        this.setState({ loadingMessages: false });
      });
    } catch (error) {
      this.setState({ error: error.message, loadingMessages: false });
    }
  }

  handleChange(event) {
    this.setState({
      text: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { messages } = this.context
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

  formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {
    return (
      <div className="">
        <Header />
        <div className="mt-16 p-6 h-2/3 overflow-y-scroll bg-indigo-50" ref={this.myRef}>
          {this.state.loadingMessages
            ? <div className="flex items-center justify-center"><Spinner type='Puff' color='#038E9F' height={50} width={50} /></div>
            : ""}
          {/* chat area */}
          {this.state.messages.map(chat => {
            return <div key={chat.createdAt} className={"p-1 m-2 max-w-2xl rounded-lg break-words speech-bubble " + (this.state.user.uid === chat.userId
              ? "bg-green-300 text-white ml-auto"
              : "bg-gray-200")}>
              {chat.text}
              <span className="text-xs float-right">{(this.state.user.uid === chat.userId ? "myself" : chat.displayName)} - {this.formatTime(chat.createdAt)}</span>
              <div className=""></div>
            </div>
          })}
        </div>
        <form onSubmit={this.handleSubmit} className="mx-auto sticky bottom-0 max-w-2xl">
          <textarea className="border-solid border-2 w-full rounded-lg " name="text" onChange={this.handleChange} value={this.state.text}></textarea>
          <button type="submit" className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white">Send</button>
          {this.state.error ? <p className="text-red-500">{this.state.error}</p> : null}
        </form>
        <Footer></Footer>
      </div>
    );
  }
}
// tells Chat that it can use a context
Chat.contextType = FirebaseContext