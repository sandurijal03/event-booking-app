import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControl from '../components/Bookings/BookingsControl/BookingsControl';

export default class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: 'list',
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            bookings {
              _id
              createdAt
              event  {
                _id
                title
                date
                price
              }
            }
          }
        `,
    };

    fetch('http://localhost:3001/graphql', {
      method: 'POST',

      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.context.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        const bookings = resData.data.bookings;

        this.setState({ bookings: bookings, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  deleteBookingHandler = (bookingId) => {
    const requestBody = {
      query: `
          mutation CANCEL_BOOKING($bookingId: ID!) {
            cancelBooking(bookingId: $bookingId) {
              _id
              title
            }
          }
        `,
      variables: {
        bookingId,
      },
    };

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.context.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        this.setState((prevState) => {
          const updateBookings = prevState.bookings.filter((booking) => {
            return booking._id !== bookingId;
          });
          return { bookings: updateBookings, isLoading: false };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  changeOutputTypeHandler = (outputType) => {
    if (outputType === 'list') {
      this.setState({ outputType: 'list' });
    } else {
      this.setState({ outputType: 'chart' });
    }
  };

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <>
          <BookingsControl
            activeOutputType={this.state.outputType}
            onChange={this.changeOutputTypeHandler}
          />
          <div>
            {this.state.outputType === 'list' ? (
              <BookingList
                bookings={this.state.bookings}
                onDelete={this.deleteBookingHandler}
              />
            ) : (
              <BookingsChart bookings={this.state.bookings} />
            )}
          </div>
        </>
      );
    }
    return <>{content}</>;
  }
}
