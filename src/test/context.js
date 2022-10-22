
const { randomBytes } = require('crypto');
const { default: migrate } = require('node-pg-migrate');
const format = require('pg-format');
const pool = require('../pool');

class Context {

    static async build(){
        // randomly generating a role name to connect to PG as 
    const roleName = 'a' + randomBytes(4).toString('hex');

    // Connect to PG as usual
    await pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'socialnetwork-test',
        user: 'pauloedums',
        password: 'admin'
    });

    // Create a new role
    await pool.query(format(
        'CREATE ROLE %I WITH LOGIN PASSWORD %L;', roleName, roleName
    ));


    // Create a schema with the same name
    await pool.query(format('CREATE SCHEMA %I AUTHORIZATION %L;', roleName, roleName));

    // Disconnect entirely from PG
    await pool.close();

    // Run our migrations in the new schema
    await migrate({
        schema: roleName,
        direction: 'up',
        log: () => {},
        noLock: true,
        dir: 'migrations',
        databaseUrl: {
            host: 'localhost',
            port: 5432,
            database: 'socialnetwork-test',
            user: roleName,
            password: roleName
        }
    });

    // Connect to PG as the newly create role
    await pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'socialnetwork-test',
        user: roleName,
        password: roleName
    });
    return new Context(roleName);
    }

    constructor(roleName){
        this.roleName = roleName;
    }
}

module.exports = Context;