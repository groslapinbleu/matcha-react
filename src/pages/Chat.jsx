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
import { withTranslation } from 'react-i18next';

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
    const { auth, subscribeToChats, authUser } = this.props.firebase;
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
      this.firebaseRef = subscribeToChats(
        conversationId,
        this.state.limit,
        (messages) => {
          if (messages) {
            this.setState({ messages, loadingMessages: false });
            chatArea.scrollBy(0, chatArea.scrollHeight);
          } else {
            this.setState({ messages: [], loadingMessages: false });
          }
        }
      );
    } catch (error) {
      this.setState({ error: error.message, loadingMessages: false });
    }
  };

  componentWillUnmount() {
    const { conversationId } = this.state.conversationId;
    this.props.firebase.unsubscribeFromChats(conversationId, this.firebaseRef);
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!isEmptyString(this.state.text)) {
      const { createChat } = this.props.firebase;
      const { conversationId } = this.state;
      this.setState({ error: null });
      const chatArea = this.myRef.current;
      try {
        await createChat(conversationId, {
          text: this.state.text,
          userId: this.state.user.uid,
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
    this.props.firebase.deleteChat(conversationId, uid);
  };

  render() {
    const { t } = this.props;
    const { username } = this.props.location.state.user;
    return (
      <div className=''>
        <Header />
        <div className='m-2 p-2'>
          <MatchaButton
            text={t('chat.get_more_messages_button', 'Get more messages')}
            type='button'
            onClick={this.onNextPage}
          />
        </div>
        <div className='flex items-center justify-center'>
          <strong>
            {t('chat.private_chat_page', 'Private Chat Page with ')}
            {username}
          </strong>
        </div>
        <div
          className='mt-8 mx-1 p-6 max-h-96 overflow-y-scroll bg-indigo-50'
          ref={this.myRef}
        >
          {this.state.loadingMessages ? (
            <div className='flex items-center justify-center'>
              <Spinner type='Puff' color='#038E9F' height={50} width={50} />
            </div>
          ) : (
            ''
          )}
          {/* chat area */}
          {this.state.messages.map((chat) => {
            return (
              <Message
                key={chat.created}
                user={this.state.user}
                otherUser={this.props.location.state.user}
                chat={chat}
                onRemoveMessage={this.onRemoveMessage}
              ></Message>
            );
          })}
        </div>
        <form onSubmit={this.handleSubmit} className='flex mx-auto max-w-2xl'>
          <input
            className='border-solid border-2 w-full rounded-lg '
            name='text'
            onChange={this.handleChange}
            value={this.state.text}
          />
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

export default withTranslation()(withFirebase(Chat));
