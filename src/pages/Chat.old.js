import Header from '../components/Header';
import Footer from '../components/Footer';


    render() {
        return (
            <div>
		        <Header></Header>
		        <section>
		          <div className="jumbotron jumbotron-fluid py-5">
		            <div className="container text-center py-5">
		              <h1 className="display-4">Go ahead and chat!</h1>
		            </div>
		          </div>

			    <div>
			      <div className="chats">
			        {this.state.chats.map(chat => {
			          return <p key={chat.timestamp}>{chat.content}</p>
			        })}
			      </div>

			      <form onSubmit={this.handleSubmit}>
			        <input onChange={this.handleChange} value={this.state.content}></input>
			        {this.state.error ? <p>{this.state.writeError}</p> : null}
			        <button type="submit">Send</button>
			      </form>
			      <div>
			        Login in as: <strong>{this.state.user.email}</strong>
			      </div>
			    </div>

		        </section>
		    <Footer></Footer>
		    </div>

        );
    }
}