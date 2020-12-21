import React from 'react';
import './EventList.css';
import EventItem from './EventItem/EventItem';

const EventList = (props) => {
  const events = props.events.map((event) => (
    <EventItem
      key={event._id}
      eventId={event._id}
      title={event.title}
      price={event.price}
      date={event.date}
      userId={props.authUserId}
      creatorId={event.creator._id}
      onDetail={props.onViewDetail}
    />
  ));

  return (
    <div>
      <ul className='event__list'>{events}</ul>
    </div>
  );
};

export default EventList;
