import React, { Component } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Message from '../components/Message';
import Spinner from 'react-loader-spinner';
import CheckButton from '../components/CheckButton';
import { isEmptyString } from '../helpers/validation';
import { withFirebase } from '../services/Firebase';
import MatchaButton from 'components/MatchaButton';
import Check from 'Icons/Check';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      otherUserId: null,
      conversationId: null,
      messages: [],
      text: '',
      error: null,
      loadingMessages: false,
      limit: 10,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    this.onListenForMessages();
  }

  onListenForMessages = () => {
    const { auth, chats, authUser } = this.props.firebase;
    const currentUser = authUser;
    const otherUserId = this.props.match.params.id;
    const conversationId =
      currentUser.uid < otherUserId
        ? currentUser.uid + otherUserId
        : otherUserId + currentUser.uid;
    this.setState({
      user: currentUser,
      otherUserId: otherUserId,
      conversationId: conversationId,
      error: null,
      loadingMessages: true,
    });
    const chatArea = this.myRef.current;
    try {
      this.firebaseRef = chats(conversationId)
        .orderByChild('createdAt')
        .limitToLast(this.state.limit)
        .on('value', (snapshot) => {
          const messageObject = snapshot.val();

          if (messageObject) {
            const messages = Object.keys(messageObject).map((key) => ({
              ...messageObject[key],
              uid: key,
            }));
            this.setState({ messages, loadingMessages: false });
            chatArea.scrollBy(0, chatArea.scrollHeight);
          } else {
            this.setState({ messages: [], loadingMessages: false });
          }
        });
    } catch (error) {
      this.setState({ error: error.message, loadingMessages: false });
    }
  };

  componentWillUnmount() {
    const { conversationId } = this.state.conversationId;
    this.props.firebase.chats(conversationId).off('value', this.firebaseRef);
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!isEmptyString(this.state.text)) {
      const { chats } = this.props.firebase;
      const { conversationId } = this.state;
      this.setState({ error: null });
      const chatArea = this.myRef.current;
      try {
        await chats(conversationId).push({
          text: this.state.text,
          createdAt: Date.now(),
          userId: this.state.user.uid,
          username: this.state.user.username,
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
      (state) => ({ limit: state.limit + 5 }),
      this.onListenForMessages
    );
  };

  onRemoveMessage = (uid) => {
    const { conversationId } = this.state;
    console.log('trying to remove message with uid = ' + uid);
    this.props.firebase.chat(conversationId, uid).remove();
  };

  render() {
    const { username } = this.props.match.params;
    return (
      <div className=''>
        <Header />
        <div className='m-2 p-2'>
          <MatchaButton
            text='Get more messages'
            type='button'
            onClick={this.onNextPage}
          />
        </div>
        <div
          className='mt-8 p-6 h-2/3 overflow-y-scroll bg-indigo-50'
          ref={this.myRef}
        >
          {this.state.loadingMessages ? (
            <div className='flex items-center justify-center'>
              <Spinner type='Puff' color='#038E9F' height={50} width={50} />
            </div>
          ) : (
            <div className='flex items-center justify-center'>
              <strong>{`Private Chat Page with ${username}`}</strong>
            </div>
          )}
          {/* chat area */}
          {this.state.messages.map((chat) => {
            return (
              <Message
                key={chat.createdAt}
                user={this.state.user}
                chat={chat}
                onRemoveMessage={this.onRemoveMessage}
              ></Message>
            );
          })}
        </div>
        <form onSubmit={this.handleSubmit} className='flex mx-auto max-w-2xl'>
          <textarea
            className='border-solid border-2 w-full rounded-lg '
            name='text'
            onChange={this.handleChange}
            value={this.state.text}
          ></textarea>
          {/* <button type="submit" className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white">Send</button> */}
          <MatchaButton icon={<Check />} />
          {this.state.error ? (
            <p className='text-red-500'>{this.state.error}</p>
          ) : null}
        </form>
        <Footer></Footer>
      </div>
    );
  }
}

export default withFirebase(Chat);
