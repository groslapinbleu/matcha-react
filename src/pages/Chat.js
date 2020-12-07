import React, { Component } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Spinner from 'react-loader-spinner'
import { auth } from "../services/firebase";
import {getValues, setArrayValue } from "../helpers/database"

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      chats: [],
      content: '',
      error: null,
      loadingChats: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    this.setState({ error: null, loadingChats: true });
    const chatArea = this.myRef.current;
    try {
      getValues("chats", snapshot => {
      // db.ref("chats").on("value", snapshot => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        chats.sort(function (a, b) { return a.timestamp - b.timestamp; });
        this.setState({ chats });
        chatArea.scrollBy(0, chatArea.scrollHeight);
        this.setState({ loadingChats: false });
      });
    } catch (error) {
      this.setState({ error: error.message, loadingChats: false });
    }
  }

  handleChange(event) {
    this.setState({
      content: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: null });
    const chatArea = this.myRef.current;
    try {
      // await db.ref("chats").push({
        await setArrayValue("chats",{
        content: this.state.content,
        timestamp: Date.now(),
        uid: this.state.user.uid,
        displayName: this.state.user.displayName
      });
      this.setState({ content: '' });
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
          {this.state.loadingChats
            ? <div className="flex items-center justify-center"><Spinner type='Puff' color='#038E9F' height={50} width={50} /></div>
            : ""}
          {/* chat area */}
          {this.state.chats.map(chat => {
            return <div key={chat.timestamp} className={"p-1 m-2 max-w-2xl rounded-lg break-words speech-bubble " + (this.state.user.uid === chat.uid
              ? "bg-green-300 text-white ml-auto"
              : "bg-gray-200")}>
              {chat.content}
              <span className="text-xs float-right">{(this.state.user.uid === chat.uid ? "myself" : chat.displayName)} - {this.formatTime(chat.timestamp)}</span>
              <div className=""></div>
            </div>
          })}
        </div>
        <form onSubmit={this.handleSubmit} className="mx-auto sticky bottom-0 max-w-2xl">
          <textarea className="border-solid border-2 w-full rounded-lg " name="content" onChange={this.handleChange} value={this.state.content}></textarea>
          <button type="submit" className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white">Send</button>
          {this.state.error ? <p className="text-red-500">{this.state.error}</p> : null}
        </form>
        <Footer></Footer>
      </div>
    );
  }
}