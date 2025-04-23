import { faker } from '@faker-js/faker';

describe('User API Tests', () => {
  let userId;
  let createdUserName;
  let createdUserEmail;

  it('Should create a user successfully', () => {
    const newUser = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: 'password123',
    };

    cy.api({
      method: 'POST',
      url: 'http://localhost:3000/api/users/register',
      body: newUser,
    }).should((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('User registered');
      expect(response.body.user).to.have.property('id');
      expect(response.body.user.name).to.eq(newUser.name);
      expect(response.body.user.email).to.eq(newUser.email);
      userId = response.body.user.id;
      createdUserName = response.body.user.name;
      createdUserEmail = response.body.user.email;
    });
  });

  it('Should create a user successfully - Email already exists (400)', () => {
    const newUser = {
      name: faker.person.firstName(),
      email: createdUserEmail,
      password: 'password123',
    };

    cy.api({
      method: 'POST',
      url: 'http://localhost:3000/api/users/register',
      body: newUser,
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Email already exists');
    });
  });

  it('Should create a user successfully - All fields required (400)', () => {
    const newUser = {
      email: createdUserEmail,
      password: 'password123',
    };

    cy.api({
      method: 'POST',
      url: 'http://localhost:3000/api/users/register',
      body: newUser,
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('All fields required');
    });
  });


  it('Should login the user', () => {
    const user = {
      email: createdUserEmail,
      password: 'password123',
    };
    cy.api({
      method: 'POST',
      url: 'http://localhost:3000/api/users/login',
      body: user
    }).should((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('Should login the user - Invalid password (401)', () => {
    const user = {
      email: createdUserEmail,
      password: 'password1234',
    };
    cy.api({
      method: 'POST',
      url: 'http://localhost:3000/api/users/login',
      body: user,
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.eq(401)
    })
  })


  it('Should login the user - User not found (400)', () => {
    const user = {
      email: 'sckvcxj@gmail.com',
      password: 'password123',
    };
    cy.api({
      method: 'POST',
      url: 'http://localhost:3000/api/users/login',
      body: user,
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('Should get the created user by ID', () => {
    cy.api({
      method: 'GET',
      url: 'http://localhost:3000/api/users/' + userId,
      headers: {
        'Authorization': 'Bearer STATIC_TOKEN_123',
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', userId);
      expect(response.body).to.have.property('name', createdUserName);
      expect(response.body).to.have.property('email', createdUserEmail);
    });
  });

  it('Should get the created user by ID - User not found (400)', () => {
    cy.api({
      method: 'GET',
      url: 'http://localhost:3000/api/users/' + 123,
      headers: {
        'Authorization': 'Bearer STATIC_TOKEN_123',
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('Should get all users', () => {
    cy.api({
      method: 'GET',
      url: `http://localhost:3000/api/users`,
      headers: {
        'Authorization': 'Bearer STATIC_TOKEN_123',
      },
    }).should((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('Should update users', () => {

    const updatedUser = {
      name: '123',
      email: faker.internet.email(),
      password: 'password123',
    };
    
    cy.api({
      method: 'PUT',
      url: `http://localhost:3000/api/users/` + userId,
      body: updatedUser,
      headers: {
        'Authorization': 'Bearer STATIC_TOKEN_123',
      },
    }).should((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq('User updated');
      expect(response.body.user).to.have.property('id');
      expect(response.body.user.name).to.eq(updatedUser.name);
    })
  })

  it('Should patch the information of the user', () => {

    const updatedUser = {
      name: 'ahahahahahah',
    };

    cy.api({
      method: 'PATCH',
      url: 'http://localhost:3000/api/users/' + userId,
      body: updatedUser,
      headers: {
        'Authorization': 'Bearer STATIC_TOKEN_123',
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
    });

    cy.api({
      method: 'GET',
      url: 'http://localhost:3000/api/users/' + userId,
      headers: {
        'Authorization': 'Bearer STATIC_TOKEN_123',
      },
    }).should((response) => {
      expect(response.status).to.eq(200); 
    });

  });

  it('Should Delete user', () => {
    cy.api({
      method: 'DELETE',
      url: 'http://localhost:3000/api/users/' + userId,
      headers: {
        'Authorization': 'Bearer STATIC_TOKEN_123',
      },
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('User deleted'); 

    });

    cy.api({
      method: 'GET',
      url: 'http://localhost:3000/api/users/' + userId,
      headers: {
        'Authorization': 'Bearer STATIC_TOKEN_123',
      },
      failOnStatusCode: false, // Prevent test failure for non-200 responses
    }).should((response) => {
      expect(response.status).to.eq(404); 
      expect(response.body.message).to.eq('User not found'); 
    });

  });

  it('Should Delete user - User not found (400)', () => {
    cy.api({
      method: 'DELETE',
      url: 'http://localhost:3000/api/users/' + 123,
      headers: {
        'Authorization': 'Bearer STATIC_TOKEN_123',
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.message).to.eq('User not found'); 
    });
  });

});