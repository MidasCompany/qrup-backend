require('../../src/index')
const request = require('supertest');
const app = require('../../src/app');
const { test } = require('../../src/config/database');
const Company = require('../../src/app/models/Company');
const  User  = require('../../src/app/models/User');
const { set } = require('../../src/app');

describe('GETs', () => {
    beforeAll(() => {  
    })

    it('should get a user', async () => {
        //precisa do user_id
        const user = await User.findOne({
            where: {
                cpf: '13826414004'
            }
        })

        //precisa do user_token
        const userLogin = await request(app)
        .post('/sessions')
        .send({
            email: "caiovini.aa@gmail.com",
	        password: "bigoda22",
	        type: "user"
        })

        expect(userLogin.body).toHaveProperty("body.token")
       
        const userGet = await request(app)
        .get('/users/' + user.id)
        .set('Authorization', `Bearer ${userLogin.body.body.token}`)
        
        expect(userGet.status).toBe(200)
    })

    it('should show all companies', async () => {
        const companyGet = await request(app)
        .get('/companies')

        expect(companyGet.status).toBe(200)
    })

    it("should show user's cups", async () => {
        //user_id
        const user = await User.findOne({
            where: {
                cpf: '13826414004'
            }
        })

        //user_token
        const userLogin = await request(app)
        .post('/sessions')
        .send({
            email: "caiovini.aa@gmail.com",
	        password: "bigoda22",
	        type: "user"
        })
        expect(userLogin.body).toHaveProperty("body.token")

        //get cups
        const userCups = await request(app)
        .get('/users/:user_id/cups')
        .set('Authorization', `Bearer ${userLogin.body.body.token}`)

        expect(userCups.status).toBe(200)
    })

    /*it('should add and show a employee from a company', async () => {
        //achar a empresa e pegar o company_id
        const company3 = await Company.findOne({
            where: {
                cnpj: "13086620000137"
            }
        })

        //fazer login com o dono
        const ownerLogin = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
	        password: "midas",
            company_id: company3.id,
	        type: "employee"
        })

        console.log(ownerLogin.body.body.token)
        expect(ownerLogin.body).toHaveProperty("body.token")

        //adicionar employee 
        const postEmployee = await request(app)
        .post('/companies/'+ company3.id +'/employees')
        .set('Authorization', `Bearer ${ownerLogin.body.body.token}`)
        .send({
            name: "Mayana",
	        cpf: "95841681001",
	        password: "mayana",
	        role: 2
        })

        expect(postEmployee.status).toBe(200)

        //usar o token desse login para achar os funcionários
        const getEmployees = await request(app)
        .get('/companies/'+ company3.id +'/employees')
        .set('Authorization', `Bearer ${ownerLogin.body.body.token}`)

        expect(getEmployees.status).toBe(200)
    })*/
    
    it('should create a coupon', async () => {
        //saber qual é a empresa 
            //pegar o company_id   
        const company4 = await Company.findOne({
            where: {
                cnpj: "13086620000137"
            }
        })
        //login com o funcionário
            //pegar o token
        const employeeLogin = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
            password: "midas",
            company_id: company4.id,
            type: "employee"
        })

        expect(employeeLogin.body).toHaveProperty("body.token")

        //post na rota '/companies/:company_id/coupons'
        const couponPost = await request(app)
        .post('/companies/'+ company4.id +'/coupons')
        .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
        .send({
            name: "Cade os caras?",
	        description: "To sozinho no Discord",
	        points: 1,
	        code: "pauloentradiscord"
        })

        expect(couponPost.status).toBe(200)
    })

    it('should show all coupons', async () => {
        //só get coupons msm kkk
        const getCoupons = await request(app)
        .get('/coupons')

        expect(getCoupons.status).toBe(200)
    })   
})