require('../../src/index')
const request = require('supertest');
const app = require('../../src/app');
const  User  = require('../../src/app/models/User');
const Company = require('../../src/app/models/Company');
const Employee = require('../../src/app/models/Employee');
const CompanyCoupons = require('../../src/app/models/CompanyCoupons');

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

    it('should authenticate with a employee', async () => {
        //find company_id
        const company = await Company.findOne({
            where: {
                cnpj: "13086620000137"
            }
        })
        const response = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
	        password: "midas",
            company_id: company.id,
	        type: "employee"
        })
        expect(response.status).toBe(200)
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

    it('should be able to access private routes when authenticated', async () => {
        const user = await User.findOne({
            where: {
                email: 'caiovini.aa@gmail.com'
            }
        })

        const response = await request(app)
        .post('/sessions')
        .send({
            type: 'user',
            email: 'caiovini.aa@gmail.com',
            password: 'bigoda22'
        })
        expect(response.body).toHaveProperty("body.token");

        const get = await request(app)
            .get('/users/' + user.id)
            .set('Authorization', `Bearer ${response.body.body.token}`)
        
        expect(get.status).toBe(200)
    })

    it('should access all cups', async () => {
        const getCups = await request(app)
        .get('/allCups')

        expect(getCups.status).toBe(200)
    })

    it('should attach cups to user', async () => {
        const user = await User.findOne({
            where: {
                email: 'caiovini.aa@gmail.com'
            }
        })

        const response = await request(app)
        .post('/sessions')
        .send({
            type: 'user',
            email: 'caiovini.aa@gmail.com',
            password: 'bigoda22'
        })
        expect(response.body).toHaveProperty("body.token");

        const cup = await request(app)
        .post('/users/'+ user.id +'/cups')
        .set('Authorization', `Bearer ${response.body.body.token}`)
        .send({
            description: "copo do Pocoyo",
	        qr: "ffa7fcfe"
        })
        expect(cup.status).toBe(200)
    })

    it('should use cup on company', async () => {
        //achar usuário
        const user = await User.findOne({
            where: {
                email: 'caiovini.aa@gmail.com',
            }
        })

        //fazer login
        const userLogin = await request(app)
        .post('/sessions')
        .send({
            type: 'user',
            email: 'caiovini.aa@gmail.com',
            password: 'bigoda22'
        })
        expect(userLogin.body).toHaveProperty("body.token")

        //cadastrar copo
        const cup = await request(app)
        .post('/users/'+ user.id +'/cups')
        .set('Authorization', `Bearer ${userLogin.body.body.token}`)
        .send({
            description: "copo do Pocoyo",
	        qr: "ffa7fcfe"
        })
        expect(cup.status).toBe(200)

        //fazer login funcionário
            //achar empresa
        const company = await Company.findOne({
            where: {
                cnpj: "13086620000137"
            }
        })

        const employeeLogin = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
	        password: "midas",
	        company_id: company.id,
	        type: "employee"
        })
        expect(employeeLogin.body).toHaveProperty("body.token")

        //criar coupon
            //company_id
            //employee_token
        const couponCreate = await request(app)
        .post('/companies/'+ company.id +'/coupons')
        .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
        .send({
            name: "Tudo por 30",
	        description: "Lanche por 30 reais",
	        points: 1,
	        code: "tercalivrecaralho"
        })
        expect(couponCreate.status).toBe(200)

        //achar coupon
            const coupon = await CompanyCoupons.findOne({
                where: {
                    code: "tercalivrecaralho"
                }
            })
        //achar funcionário
        const employee = await Employee.findOne({
            where: {
                cpf: "33670919015"
            }
        })

        //realizar leitura
        const read = await request(app)
        .post('/employees/'+ employee.id +'/reads')
        //token do funcionário
        .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
        .send({
            //qr
            qr: "ffa7fcfe",
            //type: "read" 
            type: "read"
        })   
        expect(read.status).toBe(200)
    })

    it('should use coupon on company', async () => {
        //achar usuário
        const user = await User.findOne({
            where: {
                email: 'caiovini.aa@gmail.com',
            }
        })

        //fazer login
        const userLogin = await request(app)
        .post('/sessions')
        .send({
            type: 'user',
            email: 'caiovini.aa@gmail.com',
            password: 'bigoda22'
        })
        expect(userLogin.body).toHaveProperty("body.token")

        //cadastrar copo
        const cup = await request(app)
        .post('/users/'+ user.id +'/cups')
        .set('Authorization', `Bearer ${userLogin.body.body.token}`)
        .send({
            description: "copo do Pocoyo",
	        qr: "ffa7fcfe"
        })
        expect(cup.status).toBe(200)

        //fazer login funcionário
            //achar empresa
        const company = await Company.findOne({
            where: {
                cnpj: "13086620000137"
            }
        })

        const employeeLogin = await request(app)
        .post('/sessions')
        .send({
            cpf: "33670919015",
	        password: "midas",
	        company_id: company.id,
	        type: "employee"
        })
        expect(employeeLogin.body).toHaveProperty("body.token")

        //criar coupon
            //company_id
            //employee_token
        const couponCreate = await request(app)
        .post('/companies/'+ company.id +'/coupons')
        .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
        .send({
            name: "Tudo por 30",
	        description: "Lanche por 30 reais",
	        points: 1,
	        code: "tercalivrecaralho"
        })
        expect(couponCreate.status).toBe(200)

        //achar coupon
            const coupon = await CompanyCoupons.findOne({
                where: {
                    code: "tercalivrecaralho"
                }
            })
        //achar funcionário
        const employee = await Employee.findOne({
            where: {
                cpf: "33670919015"
            }
        })

        //realizar leitura
        const read = await request(app)
        .post('/employees/'+ employee.id +'/reads')
        //token do funcionário
        .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
        .send({
            //coupon_and_user
            coupon_and_user: `${coupon.id},${user.id}`,
            //type: "take" 
            type: "take"
        })   
        expect(read.status).toBe(200)
    })
})