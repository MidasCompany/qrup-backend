const  User  = require('../../src/app/models/User');
require('../../src/index')
const request = require('supertest');
const app = require('../../src/app');
const { test } = require('../../src/config/database');

describe('User', () => {
    it('should require authorization', async () => {
        
    })
})