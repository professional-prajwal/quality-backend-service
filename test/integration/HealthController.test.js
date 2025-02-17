describe('HealthController', function () {
  describe('GET /knockknock => .check', function () {
    it('should return 200 OK', function (done) {
      server()
        .get('/knockknock')
        .expect(200, { response: 'Who is there?' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(done);
    });
  });

  describe('GET / => .status', function () {
    it('should respond with 200 OK', function (done) {
      server()
        .get('/')
        .expect(200)
        .expect(function (res) {
          expect(res.body).to.have.keys('load', 'mem', 'uptime', 'version');
          expect(res.body.load).to.be.an('array');
          expect(res.body.mem).to.be.a('number');
          expect(res.body.uptime).to.be.a('number');
          expect(res.body.version).to.be.a('string');
        })
        .end(done);
    });
  });
});
