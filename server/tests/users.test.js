/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
let jwtToken;

const user = {
  email: 'Gabriel@ymail.com',
  first_name: 'Gabriel',
  last_name: 'Batistuta',
  password: 'passwordMe',
  phoneNumber: '+2349039933771',
  address: '21 New York street',
  is_admin: false
};

describe('Users route Test Suite', () => {
  describe('POST /api/v1/auth/signup route', () => {
    it('should create a new user account', async () => {
      const { status, res } = await chai.request(app)
        .post('/api/v1/auth/signup')
        .set('content-type', 'application/json')
        .send(user);
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
    });
    it('should throw an error on empty user input', async () => {
      const { status } = await chai.request(app)
        .post('/api/v1/auth/signup')
        .set('content-type', 'application/json')
        .send({
          email: '', first_name: '', last_name: '', password: '', phoneNumber: ''
        });
      expect(status).to.eq(400);
    });
    it('should throw an error if user exists', async () => {
      const { status, res } = await chai.request(app)
        .post('/api/v1/auth/signup')
        .set('content-type', 'application/json')
        .send({
          email: 'chun@email.com',
          first_name: 'fortune',
          last_name: 'king',
          password: 'password',
          phoneNumber: '+2349039933771',
          address: '2 Boulevard street',
          is_admin: true
        });
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
    });
  });

  describe('POST /api/v1/auth/signin route', () => {
    it('should login a user', async () => {
      const { status, res } = await chai.request(app)
        .post('/api/v1/auth/signin')
        .set('content-type', 'application/json')
        .send({
          email: 'john@abc.com', password: 'password'
        });
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('object');
      expect(JSON.parse(res.text).data.token).to.be.a('string');
      expect(JSON.parse(res.text).data.data).to.be.an('object');
    });
    it('should throw an error on empty user input', async () => {
      const { status } = await chai.request(app)
        .post('/api/v1/auth/signin')
        .set('content-type', 'application/json')
        .send({
          email: '', password: ''
        });
      expect(status).to.eq(400);
    });
  });


  describe('GET /api/v1/users route', () => {
    it('should fetch all users from the db', async () => {
      const { text } = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'john@abc.com',
          password: 'password'
        });
      jwtToken = JSON.parse(text).data.token;
      const { status, res } = await chai.request(app)
        .get('/api/v1/users')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send();
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('object');
      expect(JSON.parse(res.text).data.message).to.be.a('string');
      expect(JSON.parse(res.text).data.data).to.be.an('array');
    });
    it('should throw an error on user not admin', async () => {
      const { text } = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'john1@abc.com',
          password: 'password'
        });
      jwtToken = JSON.parse(text).data.token;
      const { status, res } = await chai.request(app)
        .get('/api/v1/users')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send();
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
      expect(JSON.parse(res.text).error).to.eq('You do not have admin rights');
    });
  });
});
