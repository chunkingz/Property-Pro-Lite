/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
let jwtToken;


describe('Flags route Test Suite', () => {
  describe('GET /flags route', () => {
    it('should fetch all flags from the db', async () => {
      const { text } = await chai.request(app)
        .post('/auth/signin')
        .send({
          email: 'john@abc.com',
          password: 'password'
        });
      jwtToken = JSON.parse(text).data.token;
      const { status, res } = await chai.request(app)
        .get('/flags')
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
        .post('/auth/signin')
        .send({
          email: 'john1@abc.com',
          password: 'password'
        });
      jwtToken = JSON.parse(text).data.token;
      const { status, res } = await chai.request(app)
        .get('/flags')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send();
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
      expect(JSON.parse(res.text).error).to.eq('You do not have admin rights');
    });
  });
});
