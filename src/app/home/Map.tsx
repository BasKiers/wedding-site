import React from 'react';

const Map: React.FC = () => (
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2419.03561641692!2d6.998176877308135!3d52.67739462456392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b7ef9909aa8249%3A0xd191032d0fd5e83!2sRestaurant%20Wollegras!5e0!3m2!1sen!2snl!4v1688042566546!5m2!1sen!2snl"
    style={{ border: 0, width: '100%', height: '100%' }}
    allowFullScreen={false}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
);

export default Map;
