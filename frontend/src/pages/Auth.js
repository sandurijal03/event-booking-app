import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import './Auth.css';

export default class AuthPage extends Component {
  state = {
    isLogin: true,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = (e) => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query LOGIN($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
            mutation CREATE_USER($email: String!, $password: String!) {
              createUser(userInput: { email: $email, password: $password }) {
            _id
           email
           password
            }
          }     
        `,
        variables: {
          userInput: {
            email,
            password,
          },
        },
      };
    }

    // sending request to the backend
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Failed');
        }
        return response.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration,
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <form className='auth-form' onSubmit={this.submitHandler}>
        <div className='form-control'>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' ref={this.emailEl} />
        </div>
        <div className='form-control'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' ref={this.passwordEl} />
        </div>
        <div className='form-actions'>
          <button type='submit'>submit</button>
          <button type='button' onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}
