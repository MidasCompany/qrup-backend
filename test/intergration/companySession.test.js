const request = require('supertest')
const app = require('../../src/app')

describe('Authentication', () => {
  beforeAll(() => {
  })

  it('should create company', async () => {
    const response = await request(app)
      .post('/companies')
      .send({
        nameCompany: 'Midas',
        cnpj: '13086620000137',
        address: 'Alcindo Cacela',
        contact: '212121210',
        nameOwner: 'Amaury Pinto',
        cpf: '33670919015',
        password: 'midas'
      })
    expect(response.status).toBe(200)
  })
})
