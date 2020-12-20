import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';

import './Events.css';

export default class Events extends Component {
  state = {
    creating: false,
    events: [],
  };
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };

    console.log(event);

    const requestBody = {
      query: `
        mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price:${price}, date: "${date}"}) {
          _id
          title
          description
          date
          price
        }
      }
      `,
    };

    const token = this.context.token;

    // sending request to the backend
    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Failed');
        }
        return response.json();
      })
      .then((resData) => {
        this.fetchEvents();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    console.log('cancel');
    this.setState({ creating: false });
  };

  fetchEvents() {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
          }
        }
      `,
    };

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
        const events = resData.data.events;
        this.setState({ events: events });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const eventsList = this.state.events.map((event) => (
      <li className='events__list-item' key={event._id}>
        <h2>{event.title}</h2>
      </li>
    ));
    return (
      <>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title='Add Event'
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className='form-control'>
                <label htmlFor='title'>Title</label>
                <input type='text' id='title' ref={this.titleElRef} />
              </div>

              <div className='form-control'>
                <label htmlFor='price'>Price</label>
                <input type='number' id='price' ref={this.priceElRef} />
              </div>

              <div className='form-control'>
                <label htmlFor='date'>Date</label>
                <input type='date' id='date' ref={this.dateElRef} />
              </div>

              <div className='form-control'>
                <label htmlFor='description'>Description</label>
                <textarea
                  id='descripton'
                  rows='4'
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className='events-control'>
            <p>Share your own Events</p>
            <button className='btn' onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className='events__list'>{eventsList}</ul>
      </>
    );
  }
}
