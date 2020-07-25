require('../../src/index')
const request = require('supertest');
const app = require('../../src/app');
const  Company  = require('../../src/app/models/Company');
const { response } = require('express');
const { set } = require('../../src/app');

describe('Authentication', () => {
    beforeAll(() => {
    })

    it('should create company', async () => {
        const response = await request(app)
        .post('/companies')
        .send({
            nameCompany: "Midas",
	        cnpj: "13086620000137",
	        address: "Alcindo Cacela",
	        contact: "212121210",
	
	        nameOwner: "Amaury Pinto",
	        cpf: "33670919015",
	        password: "midas"
        })
        expect(response.status).toBe(200)
    })
/*
    it('should create a session with a authenticated employee', async () => {
        const companyID = Company.findOne({
            where: {
                cnpj: "13086620000137"
            }
        })
        
        const response = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
	        password: "midas",
	        company_id: companyID.id,
	        type: "employee"
        })
        expect(response.status).toBe(200)
    })

    it('should generate a JWT token when authenticated', async () => {
        const companyID = Company.findOne({
            where: {
                cnpj: "13086620000137"
            }
        })

        const response = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
	        password: "midas",
	        company_id: companyID.id,
	        type: "employee"
        })
        expect(response.body).toHaveProperty("body.token")
    })

    it('should create a employee', async () => {
        //achar a company
        const company2 = await Company.findOne({
            where: {
                cnpj: "13086620000137",
            }
        })

        const employeeLogin = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
	        password: "midas",
	        company_id: company2.id,
	        type: "employee"
        })
        expect(employeeLogin.body).toHaveProperty("body.token")
        
        //employee_token_owner
        const createEmployee = await request(app)
        .post('/companies/'+ company2.id +'/employees')
        .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
        .send({
            name: "Mayana",
	        cpf: "95841681001",
	        password: "mayana",
	        role: 2
        })
        expect(createEmployee.status).toBe(200)
    })*/
})