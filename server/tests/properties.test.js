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
  image_url: 'http://res.cloudinary.com/chunkingz/image/upload/v1562366958/wcqhdmo6lhcyw341ymfz.png'
};

let propid;

describe('Properties route Test Suite', () => {
  describe('GET /api/v1/properties', () => {
    it('should get/fetch all the property ads', async () => {
      const { status, res } = await chai.request(app)
        .get('/api/v1/properties')
        .set('content-type', 'application/json')
        .send();
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('object');
      expect(JSON.parse(res.text).data.message).to.eq('All Properties successfully retrieved');
      expect(JSON.parse(res.text).data.property).to.be.an('array');
    });
  });

  describe('GET /api/v1/properties/:id', () => {
    it('should get a specific/single property ad', async () => {
      const { status, res } = await chai.request(app)
        .get('/api/v1/property/1')
        .set('content-type', 'application/json')
        .send();
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('object');
      expect(JSON.parse(res.text).data.message).to.eq('Property successfully retrieved');
      expect(JSON.parse(res.text).data.data).to.be.an('object');
    });
    it('should throw an error on invalid id of specific property ad', async () => {
      const { status, res } = await chai.request(app)
        .get('/api/v1/property/invalidId')
        .set('content-type', 'application/json')
        .send();
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
      expect(JSON.parse(res.text).error).to.eq('Invalid ID');
    });
  });

  describe('POST /api/v1/property/ route', () => {
    it('should create a new property ad', async () => {
      const { status, res } = await chai.request(app)
        .post('/api/v1/property/')
        .set('content-type', 'application/json')
        .send(prop);
      // console.log(status, res.text);
      expect(status).to.eq(201);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('object');
      expect(JSON.parse(res.text).data.newProperty.price).to.eq(1000);
      propid = JSON.parse(res.text).data.newProperty.id;
    });
  });

  describe('PATCH /api/v1/property/:id route', () => {
    it('should update an existing property ad', async () => {
      const { status, res } = await chai.request(app)
        .patch(`/api/v1/property/${propid}`)
        .set('content-type', 'application/json')
        .send({ price: 2500, state: 'Plateau', city: 'Jos' });
      expect(status).to.eq(201);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('object');
      expect(JSON.parse(res.text).data.updatedProperty.price).to.eq(2500);
      expect(JSON.parse(res.text).data.updatedProperty.state).to.eql('Plateau');
      expect(JSON.parse(res.text).data.updatedProperty.city).to.eql('Jos');
    });
    it('should throw error on invalid id', async () => {
      const { status, res } = await chai.request(app)
        .patch('/api/v1/property/invalid_id')
        .set('content-type', 'application/json')
        .send({ price: 2500, state: 'Plateau', city: 'Jos' });
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
      expect(JSON.parse(res.text).error).to.eq('Property ad not found');
    });
  });

  describe('DELETE /api/v1/property/:id route', () => {
    it('should delete an existing property ad', async () => {
      const { status, res } = await chai.request(app)
        .delete(`/api/v1/property/${propid}`)
        .set('content-type', 'application/json')
        .send();
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).message).to.eq('Property ad deleted successfully');
    });
    it('should throw error on invalid id', async () => {
      const { status, res } = await chai.request(app)
        .delete('/api/v1/property/invalid_id')
        .set('content-type', 'application/json')
        .send();
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
      expect(JSON.parse(res.text).error).to.eq('Property ad not found');
    });
  });

  describe('GET /api/v1/properties', () => {
    it('should get/fetch all the property ads of a specific type', async () => {
      const { status, res } = await chai.request(app)
        .get('/api/v1/property?type=2+bedroom')
        .set('content-type', 'application/json')
        .send();
      expect(status).to.eq(200);
      expect(JSON.parse(res.text).status).to.eq('success');
      expect(JSON.parse(res.text).data).to.be.an('object');
      expect(JSON.parse(res.text).data.message).to.eq('Property successfully retrieved');
      expect(JSON.parse(res.text).data.data).to.be.an('object');
    });
    it('should throw an error on ivalid type', async () => {
      const { status, res } = await chai.request(app)
        .get('/api/v1/property?type=asdf')
        .set('content-type', 'application/json')
        .send();
      expect(status).to.eq(400);
      expect(JSON.parse(res.text).status).to.eq('error');
      expect(JSON.parse(res.text).error).to.eq('Invalid type');
    });
  });
});
