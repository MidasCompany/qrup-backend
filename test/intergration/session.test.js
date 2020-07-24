require('../../src/index')
const request = require('supertest');
const app = require('../../src/app');
const  User  = require('../../src/app/models/User');

describe ('Authentication', () => { //categorizar os testes
    beforeAll(() => {  
    })

    it('should create user', async () => {
        const user = await request(app)
        .post('/users')
        .send({
            name: 'Caio Vinicius',
            email: 'caiovini.aa@gmail.com',
            password: 'bigoda22',
            cpf: '13826414004',
            birth: '1998-07-22 00:00:00'
        })
        expect(user.status).toBe(200);
    });

    it('should authenticate with a user', async () => {
        const response = await request(app)
        .post('/sessions')
        .send({
            type: 'user',
            email: 'caiovini.aa@gmail.com',
            password: 'bigoda22'
        })
        expect(response.status).toBe(200);
    })

    it('should not authenticate with invalid credentials', async () => {
        const response = await request(app)
        .post('/sessions')
        .send({
            type: 'user',
            email: 'caiovini.aa@gmail.com',
            password: 'caio123'
        })
        expect(response.status).toBe(400);
    })

    it('should return a JWT token when authenticated', async () => {
        const response = await request(app)
        .post('/sessions')
        .send({
            type: 'user',
            email: 'caiovini.aa@gmail.com',
            password: 'bigoda22'
        })
        expect(response.body).toHaveProperty("body.token");
    })

    /*it('should be able to access private routes when authenticated', async () => {
        const user = await User.findOne({
            where: {
                email: 'caiovini.aa@gmail.com'
            }
        })
        const response = await request(app)
            .get('/users/' + user.id)
            .set('Authorization', `Bearer ${}`)
        
        expect(response.status).toBe(200)
    })*/
})