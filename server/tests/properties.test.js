/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

const prop = {
  owner: 'chun@email.com',
  price: 1000,
  state: 'Lagos',
  city: 'Lagos',
  address: '2 Boulevard street',
  type: '2 bedroom',
  image_url: ''
};

let jwtToken;
let propid;

describe('Properties route Test Suite', () => {
  before(async () => {
    const { text } = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'john@abc.com',
        password: 'password'
      });
    jwtToken = JSON.parse(text).data.token;
  });

  describe('GET /api/v1/properties', () => {
    it('should get/fetch all the property ads', async () => {
      const { status, res } = await chai.request(app)
        .get('/api/v1/properties')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send();
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('object');
      expect(JSON.parse(res.text).data.message).to.eq('All properties successfully retrieved');
      expect(JSON.parse(res.text).data.data).to.be.an('array');
    });
  });

  describe('GET /api/v1/property/:id', () => {
    it('should get a specific/single property ad', async () => {
      const { status, res } = await chai.request(app)
        .get('/api/v1/property/2')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send();
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('array');
    });
    it('should throw an error on invalid id of specific property ad', async () => {
      const { status, res } = await chai.request(app)
        .get('/api/v1/property/invalidId')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send();
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
      expect(JSON.parse(res.text).errorMsg).to.eq('Invalid id number');
    });
  });

  describe('POST /api/v1/property/ route', () => {
    it('should create a new property ad', async () => {
      const { status, res } = await chai.request(app)
        .post('/api/v1/property/')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send(prop);
      expect(status).to.eq(201);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('object');
      expect(JSON.parse(res.text).data.price).to.eq('1000');
      propid = JSON.parse(res.text).data.id;
    });
  });

  describe('PATCH /api/v1/property/:id route', () => {
    it('should update an existing property ad', async () => {
      const { status, res } = await chai.request(app)
        .patch(`/api/v1/property/${propid}`)
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send({ price: 2500, state: 'Plateau', city: 'Jos' });
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('object');
      expect(JSON.parse(res.text).data.price).to.eq('2500');
      expect(JSON.parse(res.text).data.state).to.eql('Plateau');
      expect(JSON.parse(res.text).data.city).to.eql('Jos');
    });
    it('should throw error on invalid id', async () => {
      const { status, res } = await chai.request(app)
        .patch('/api/v1/property/invalid_id')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send({ price: 2500, state: 'Plateau', city: 'Jos' });
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
      expect(JSON.parse(res.text).errorMsg).to.eq('Invalid id number');
    });
  });

  describe('DELETE /api/v1/property/:id route', () => {
    it('should delete an existing property ad', async () => {
      const { status, res } = await chai.request(app)
        .delete(`/api/v1/property/${propid}`)
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send();
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.eq('Property Ad Deleted');
    });
    it('should throw error on invalid id', async () => {
      const { status, res } = await chai.request(app)
        .delete('/api/v1/property/invalid_id')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send();
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
      expect(JSON.parse(res.text).errorMsg).to.eq('Invalid id number');
    });
  });

  describe('GET /api/v1/properties', () => {
    it('should get/fetch all the property ads of a specific type', async () => {
      const { status, res } = await chai.request(app)
        .get('/api/v1/property?type=2+bedroom')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send();
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('array');
    });
    it('should throw an error on ivalid type', async () => {
      const { status, res } = await chai.request(app)
        .get('/api/v1/property?type=asdf')
        .set('content-type', 'application/json')
        .set('x-auth-token', jwtToken)
        .send();
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
      expect(JSON.parse(res.text).error).to.eq('Property not found');
    });
  });
});
