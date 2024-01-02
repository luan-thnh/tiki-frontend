import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

HomePage.propTypes = {};

function HomePage() {
  return (
    <div>
      <Button as={Link} to="/admin/login" sx={{ width: 50 }}>
        Click me
      </Button>
    </div>
  );
}

export default HomePage;
