require('../../src/index')
const request = require('supertest');
const app = require('../../src/app');
const { test } = require('../../src/config/database');
const Company = require('../../src/app/models/Company');
const Cup = require('../../src/app/models/Cup');
const User = require('../../src/app/models/User');
const Employee = require('../../src/app/models/Employee');
const { company } = require('faker');
const { findOne } = require('../../src/app/models/User');

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

    it('should add and show a employee from a company', async () => {
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

        //console.log(ownerLogin.body.body.token)
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
    })
    
    it('should create and show a coupon', async () => {
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

        const couponGet = await request(app)
        .get('/companies/'+ company4.id +'/company-coupons')

        expect(couponGet.status).toBe(200)
    })

    it('should show all coupons', async () => {
        //só get coupons msm kkk
        const getCoupons = await request(app)
        .get('/coupons')

        expect(getCoupons.status).toBe(200)
    })   

    it("should show the user's historic", async () => {
        //pegar o ID da company
        const company5 = await Company.findOne({
            where: {
                cnpj: "13086620000137"
            }
        })

        //pegar o token do empregado
            //fazer login com empregado
        const employeeLogin = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
            password: "midas",
            company_id: company5.id,
            type: "employee"
        })

        expect(employeeLogin.body).toHaveProperty("body.token")

        const historicGet = await request(app)
        .get('/historic')
        .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)

        expect(historicGet.status).toBe(200)
    })

    //---------------------------------PUTs---------------------------------

    it("should update the user's password", async () => {
        //token do usuário
        const user = await User.findOne({
            where: {
                email: "caiovini.aa@gmail.com",
            }
        })
        //id do usuário e iniciar sessão
        const login = await request(app)
        .post('/sessions')
        .send({
            email: "caiovini.aa@gmail.com",
	        password: "bigoda22",
	        type: "user"
        })
        expect(login.body).toHaveProperty("body.token")

        //nome, email e contact
        //old password, password, new password
        const updateUser = await request(app)
        .put('/users/' + user.id)
        .set('Authorization', `Bearer ${login.body.body.token}`)
        .send({
            name: "Cabeça de pica",
            email:"caiovini.aa@gmail.com",
            contact: "91980442949",
            oldPassword: "bigoda22",
            password: "caio123",
            confirmPassword: "caio123"
        })
        expect(updateUser.status).toBe(200)
    })

    it("should update the company's fields", async () => {
        //token employee
            //id da empresa
            //fazer sessão com funcionário  
        const company6 = await Company.findOne({
            where: {
                cnpj: "13086620000137"
            }
        })

        const loginEmployee = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
            password: "midas",
            company_id: company6.id,
            type: "employee"
        })

        expect(loginEmployee.body).toHaveProperty("body.token")
        
        //enviar novoNome, novoEndereço e novoContact
        const updateCompany = await request(app)
        .put('/companies/' + company6.id)
        .set('Authorization', `Bearer ${loginEmployee.body.body.token}`)
        .send({
            name: "Midas54",
	        address: "Travessa Vileta 5498",
	        contact: "9132462858"
        })

        expect(updateCompany.status).toBe(200)
    })

    it("should update the employee's fields", async () => {
        //id da empresa
        const company7 = await Company.findOne({
            where: {
                cnpj: "13086620000137"
            }
        })

        //token do empregado
        const login = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
            password: "midas",
            company_id: company7.id,
            type: "employee"
        })

        expect(login.body).toHaveProperty("body.token")

        //criar um funcionario
        const employeeCreate = await request(app)
        .post('/companies/'+ company7.id +'/employees')
        .set('Authorization', `Bearer ${login.body.body.token}`)
        .send({
            name: "Mayana",
	        cpf: "95841681001",
	        password: "mayana",
	        role: 2
        })
        
        expect(employeeCreate.status).toBe(200)
        
        //id do funcionário
        const employeeId = await Employee.findOne({
            where: {
                cpf: "95841681001",
            }
        })
        console.log(employeeId)
        
        //put da senha do empregado logado
        const putEmployee = await request(app)
        .put('/companies/'+ company7.id +'/employees/' + employeeId.id)
        .set('Authorization', `Bearer ${login.body.body.token}`)
        .send({
            name: "Mayana 1000 grau",
	        role: 3,
	        oldPassword: "mayana",
	        password: "mayana123",
	        confirmPassword: "mayana123"
        })

        expect(putEmployee.status).toBe(200)
    })
})