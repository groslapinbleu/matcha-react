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

class MessagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
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
    const { auth, messages, authUser } = this.props.firebase;
    const currentUser = authUser;
    this.setState({ user: currentUser });
    this.setState({ error: null, loadingMessages: true });
    const chatArea = this.myRef.current;
    try {
      messages()
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
    this.props.firebase.messages().off();
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!isEmptyString(this.state.text)) {
      const { messages } = this.props.firebase;
      this.setState({ error: null });
      const chatArea = this.myRef.current;
      try {
        await messages().push({
          text: this.state.text,
          createdAt: Date.now(),
          userId: this.state.user.uid,
          username: this.state.user.username,
          photoURL: this.state.user.photoURL,
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
    console.log('trying to remove message with uid = ' + uid);
    this.props.firebase.message(uid).remove();
  };

  render() {
    const { t } = this.props;

    return (
      <div className=''>
        <Header />
        <div className='m-2 p-2'>
          <MatchaButton
            text={t(
              'message_page.get_more_messages_button',
              'Get more messages'
            )}
            type='button'
            onClick={this.onNextPage}
          />
        </div>
        <div className='flex items-center justify-center'>
          <strong>
            {t(
              'message_page.forum_page',
              'Forum Page: everyone can talk to everyone'
            )}
          </strong>
        </div>
        <div
          className='mt-8 p-6 mx-1 max-h-96 overflow-y-scroll bg-indigo-50'
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
                key={chat.createdAt}
                user={this.state.user}
                otherUser={{ username: chat.username, photoURL: chat.photoURL }}
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

export default withTranslation()(withFirebase(MessagePage));
