import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);

describe('General Routes Test Suite', () => {
  describe('GET the root', () => {
    it('should get the root welcome page', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
  });

  describe('GET the unknown routes', () => {
    it('should return 404', (done) => {
      chai.request(app)
        .get('/*')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });
});
