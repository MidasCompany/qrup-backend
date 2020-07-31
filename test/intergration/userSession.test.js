const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/app/models/User')
const Company = require('../../src/app/models/Company')
const Employee = require('../../src/app/models/Employee')
const CompanyCoupons = require('../../src/app/models/CompanyCoupons')

let qr_code = ''

describe('Authentication', () => { // categorizar os testes
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
    expect(user.status).toBe(200)
  })

  it('should authenticate with a user', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        type: 'user',
        email: 'caiovini.aa@gmail.com',
        password: 'bigoda22'
      })
    expect(response.status).toBe(200)
  })

  it('should authenticate with a employee', async () => {
    // find company_id
    const company = await Company.findOne({
      where: {
        cnpj: '13086620000137'
      }
    })
    const response = await request(app)
      .post('/sessions')
      .send({
        cpf: '33670919015',
        password: 'midas',
        company_id: company.id,
        type: 'employee'
      })
    expect(response.status).toBe(200)
  })

  it('should create a employee', async () => {
    // achar a company
    const company2 = await Company.findOne({
      where: {
        cnpj: '13086620000137'
      }
    })

    const employeeLogin = await request(app)
      .post('/sessions')
      .send({
        cpf: '33670919015',
        password: 'midas',
        company_id: company2.id,
        type: 'employee'
      })
    expect(employeeLogin.body).toHaveProperty('body.token')

    // employee_token_owner
    const createEmployee = await request(app)
      .post('/companies/' + company2.id + '/employees')
      .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
      .send({
        name: 'Mayana',
        cpf: '95841681001',
        password: 'mayana',
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
    expect(response.status).toBe(400)
  })

  it('should return a JWT token when authenticated', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        type: 'user',
        email: 'caiovini.aa@gmail.com',
        password: 'bigoda22'
      })
    expect(response.body).toHaveProperty('body.token')
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
    expect(response.body).toHaveProperty('body.token')

    const get = await request(app)
      .get('/users/' + user.id)
      .set('Authorization', `Bearer ${response.body.body.token}`)

    expect(get.status).toBe(200)
  })

  it('should access all cups', async () => {
    const getCups = await request(app)
      .get('/allCups')
    console.log(getCups.body)
    qr_code = getCups.body.body[0].qr
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
    expect(response.body).toHaveProperty('body.token')

    const cup = await request(app)
      .post('/users/' + user.id + '/cups')
      .set('Authorization', `Bearer ${response.body.body.token}`)
      .send({
        description: 'copo do Pocoyo',
        qr: qr_code
      })
    console.log(cup.body)
    expect(cup.status).toBe(200)
  })

  it('should use cup on company', async () => {
    // achar usuário
    const user = await User.findOne({
      where: {
        email: 'caiovini.aa@gmail.com'
      }
    })

    // fazer login
    const userLogin = await request(app)
      .post('/sessions')
      .send({
        type: 'user',
        email: 'caiovini.aa@gmail.com',
        password: 'bigoda22'
      })
    expect(userLogin.body).toHaveProperty('body.token')

    // cadastrar copo
    const cup = await request(app)
      .post('/users/' + user.id + '/cups')
      .set('Authorization', `Bearer ${userLogin.body.body.token}`)
      .send({
        description: 'copo do Pocoyo',
        qr: qr_code
      })
    expect(cup.status).toBe(200)

    // fazer login funcionário
    // achar empresa
    const company = await Company.findOne({
      where: {
        cnpj: '13086620000137'
      }
    })

    const employeeLogin = await request(app)
      .post('/sessions')
      .send({
        cpf: '33670919015',
        password: 'midas',
        company_id: company.id,
        type: 'employee'
      })
    expect(employeeLogin.body).toHaveProperty('body.token')

    // criar coupon
    // company_id
    // employee_token
    const couponCreate = await request(app)
      .post('/companies/' + company.id + '/coupons')
      .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
      .send({
        name: 'Tudo por 30',
        description: 'Lanche por 30 reais',
        points: 1,
        code: 'tercalivrecaralho'
      })
    expect(couponCreate.status).toBe(200)

    // achar coupon
    await CompanyCoupons.findOne({
      where: {
        code: 'tercalivrecaralho'
      }
    })
    // achar funcionário
    const employee = await Employee.findOne({
      where: {
        cpf: '33670919015'
      }
    })

    // realizar leitura
    const read = await request(app)
      .post('/employees/' + employee.id + '/reads')
    // token do funcionário
      .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
      .send({
        // qr
        qr: qr_code,
        // type: "read"
        type: 'read'
      })
    expect(read.status).toBe(200)
  })

  it('should use coupon on company', async () => {
    // achar usuário
    const user = await User.findOne({
      where: {
        email: 'caiovini.aa@gmail.com'
      }
    })

    // fazer login
    const userLogin = await request(app)
      .post('/sessions')
      .send({
        type: 'user',
        email: 'caiovini.aa@gmail.com',
        password: 'bigoda22'
      })
    expect(userLogin.body).toHaveProperty('body.token')

    // cadastrar copo
    const cup = await request(app)
      .post('/users/' + user.id + '/cups')
      .set('Authorization', `Bearer ${userLogin.body.body.token}`)
      .send({
        description: 'copo do Pocoyo',
        qr: qr_code
      })
    expect(cup.status).toBe(200)

    // fazer login funcionário
    // achar empresa
    const company = await Company.findOne({
      where: {
        cnpj: '13086620000137'
      }
    })

    const employeeLogin = await request(app)
      .post('/sessions')
      .send({
        cpf: '33670919015',
        password: 'midas',
        company_id: company.id,
        type: 'employee'
      })
    expect(employeeLogin.body).toHaveProperty('body.token')

    // criar coupon
    // company_id
    // employee_token
    const couponCreate = await request(app)
      .post('/companies/' + company.id + '/coupons')
      .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
      .send({
        name: 'Tudo por 30',
        description: 'Lanche por 30 reais',
        points: 1,
        code: 'tercalivrecaralho'
      })
    expect(couponCreate.status).toBe(200)

    // achar coupon
    const coupon = await CompanyCoupons.findOne({
      where: {
        code: 'tercalivrecaralho'
      }
    })
    // achar funcionário
    const employee = await Employee.findOne({
      where: {
        cpf: '33670919015'
      }
    })

    // realizar leitura
    const read = await request(app)
      .post('/employees/' + employee.id + '/reads')
    // token do funcionário
      .set('Authorization', `Bearer ${employeeLogin.body.body.token}`)
      .send({
        // coupon_and_user
        coupon_and_user: `${coupon.id},${user.id}`,
        // type: "take"
        type: 'take'
      })
    expect(read.status).toBe(200)
  })

  // -------------------------------------DELETE----------------------------------
  it('should delete cups from users', async () => {
    // id do usuário
    const user2 = await User.findOne({
      where: {
        email: 'caiovini.aa@gmail.com'
      }
    })

    // token do usuário
    const login2 = await request(app)
      .post('/sessions')
      .send({
        type: 'user',
        email: 'caiovini.aa@gmail.com',
        password: 'bigoda22'
      })
    expect(login2.body).toHaveProperty('body.token')

    // add a cup to the user
    const attachCup = await request(app)
      .post('/users/' + user2.id + '/cups')
      .set('Authorization', `Bearer ${login2.body.body.token}`)
      .send({
        description: 'copo do caio',
        qr: qr_code
      })

    expect(attachCup.status).toBe(200)

    // see if user has the cup
    const hasCup = await request(app)
      .get('/users/' + user2.id + '/cups')
      .set('Authorization', `Bearer ${login2.body.body.token}`)

    console.log(hasCup.body.body[0].qr)

    expect(hasCup.status).toBe(200)

    // qr

    // delete a cup
    const deleteCup = await request(app)
      .delete('/users/' + user2.id + '/cups/' + hasCup.body.body[0].qr)
      .set('Authorization', `Bearer ${login2.body.body.token}`)

    expect(deleteCup.status).toBe(200)
  })

  it('should delete a coupon', async () => {
    // company_id
    const getCompany = await Company.findOne({
      where: {
        cnpj: '13086620000137'
      }
    })

    // token do dono
    const login = await request(app)
      .post('/sessions')
      .send({
        cpf: '33670919015',
        password: 'midas',
        company_id: getCompany.id,
        type: 'employee'
      })

    expect(login.body).toHaveProperty('body.token')

    // criar cupom
    const couponCreate = await request(app)
      .post('/companies/' + getCompany.id + '/coupons')
      .set('Authorization', `Bearer ${login.body.body.token}`)
      .send({
        name: 'Porrada no Paulo',
        description: 'Lanchar o Paulo no soco',
        points: 1,
        code: 'AmumuDoPaulo'
      })

    expect(couponCreate.status).toBe(200)

    // encontrar o cupom
    const getCoupon = await CompanyCoupons.findOne({
      where: {
        code: 'AmumuDoPaulo'
      }
    })

    // deletar o cupom
    const deleteCoupon = await request(app)
      .delete('/companies/' + getCompany.id + '/coupons/' + getCoupon.id)
      .set('Authorization', `Bearer ${login.body.body.token}`)

    expect(deleteCoupon.status).toBe(200)
  })

  it('should delete a employee', async () => {
    // achar empresa
    const company = await Company.findOne({
      where: {
        cnpj: '13086620000137'
      }
    })

    // login como dono
    // token do dono
    const login = await request(app)
      .post('/sessions')
      .send({
        cpf: '33670919015',
        password: 'midas',
        company_id: company.id,
        type: 'employee'
      })

    expect(login.body).toHaveProperty('body.token')

    // criar funcionário
    const createEmployee = await request(app)
      .post('/companies/' + company.id + '/employees')
      .set('Authorization', `Bearer ${login.body.body.token}`)
      .send({
        name: 'Alessandro',
        cpf: '06070359003',
        password: 'alessandro',
        role: 3
      })

    expect(createEmployee.status).toBe(200)

    // id do funcionário que vai ser deletado
    const employee = await Employee.findOne({
      where: {
        cpf: '06070359003'
      }
    })

    const deleteEmployee = await request(app)
      .delete('/employees/' + employee.id)
      .set('Authorization', `Bearer ${login.body.body.token}`)

    expect(deleteEmployee.status).toBe(200)
  })
})
