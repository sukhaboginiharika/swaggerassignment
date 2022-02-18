const express = require('express');
const app = express();
const port = 3000;
var mariadb = require('mariadb');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const cors = require('cors');

const options = {
    definition: {
        info: {
            title : 'Swagger API demo',
            version: '1.0.0',
            description: 'my demo'
        }
    },
    apis: ['server.js']
}

var pool = 
	mariadb.createPool({
	host : 'localhost',
	user : 'root',
	password : 'root',
	database : 'sample',
	port : 3306,
	connectionLimit: 5
});
const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

/**
 * @swagger
 * /agents:
 *  get:
 *      description: Return all agents in db
 *      responses:
 *          '200':
 *              description: object containing all agents
*/

app.get('/agents',cors(),async(req,res)=>{
var conn;
try{
conn = await pool.getConnection();
rows = await conn.query("select * from agents");
res.send(rows);
}
catch(e){
throw e;
}
finally{
if(conn){
return conn.end();
}
}
});
/**
 * @swagger
 * /customers:
 *  get:
 *      description: Return all customers in db 
 *      responses: 
 *          '200':
 *              description: object containing all the customers
 */

 app.get('/customers',async(req,res) =>{

    var conn;
    try{
    conn = await pool.getConnection();
    rows = await conn.query("select * from customer");
    res.send(rows);
    }
    catch(e){
    throw e;
    }finally{
    if(conn){
    return conn.end();
    }
    }
    });
    
    /**
     * @swagger
     * /companies:
     *  get:
     *      description: List all the available companies in the API 
     *      responses: 
     *          '200':
     *              description: A successful response
     */
    
    app.get('/companies',async(req,res) =>{
    
    var conn;
    try{
    conn = await pool.getConnection();
    var rows = await conn.query("select * from company");
    res.send(rows);
    }
    catch(e){
    throw e;
    }finally{
    if(conn){
    return conn.end();
    }
    }
    });
    
    /**
     * @swagger
     * /companies/{id}:
     *  delete:
     *      tags:
     *         - Delete by ID
     *      description: Deletion of company using its ID
     *      parameters:
     *          - name: id
     *            description: Using the ID the record can be deleted
     *            in: path
     *            type: integer
     *            required: true
     *      responses: 
     *          '200':
     *              description: record deleted
     */
    
    app.delete('/companies/:id',async(req,res)=>{
    try{
        var id = req.params.id;
        conn = await pool.getConnection();
        rows = await conn.query("delete from company where COMPANY_ID = ?",[id]);
        console.log(rows);
        res.send(rows);
    }
    catch(e){
    throw e;
    }finally{
    if(conn){
    return conn.end();
    }
    }
    });
    
    
    /**
     * @swagger
     * /companies:
     *  post:
     *      description: Creation of new record of a company
     *      parameters:
     *          - name: reqBody
     *            description: request body
     *            in: body
     *            schema:
     *              type: object
     *              properties:
     *                  id:
     *                    type: string
     *                  name:
     *                    type: string
     *                  city:   
     *                    type: string
     *              required:
     *                  - city
     *                  - id
     *                  - name
     *      responses:
     *          '200':
     *              description: Record added to the company table
     */
    
    app.post('/companies',async(req,res)=>{
    var conn;
    const id = req.body.id;
    const name = req.body.name;
    const city = req.body.city;
    try{
            conn = await pool.getConnection();       
            rows = await conn.query("insert into company (COMPANY_ID,COMPANY_NAME,COMPANY_CITY) values (?,?,?)" ,[id,name,city]);
            console.log(rows);
            res.send(rows);
    
    throw e;
    }finally{
    if(conn){
    return conn.end();
    }
    }
    });
    
    /**
     * @swagger
     * /companies/{id}:
     *  put:
     *      tags:
     *         - PUT Operation
     *      description: put a value by using a id
     *      parameters:
     *          - name: id
     *            description: By the given record ID the company city value can be updated
     *            in: path
     *            type: integer
     *            required: true
     *          - name: reqBody
     *            description: request body
     *            in: body
     *            schema: 
     *              type: object
     *              properties:
     *                  city:
     *                      type: string
     *              required:
     *                  -city
     *      responses:ß
     *          '200':
     *              description: Updation done
     */
    
    app.put('/companies/:id',async(req,res)=>{
    var conn;
    try{
    console.log(req.body.city);        
    console.log(req.params.id);
    const id = req.params.id;
        const bodyval = req.body.city;
            conn = await pool.getConnection();       
            rows = await conn.query("update company set COMPANY_CITY = ? where COMPANY_ID = ?",[bodyval,id]);
            console.log(rows);
            res.send(rows);
    }
    catch(e){
    throw e;
    }finally{
    if(conn){
    return conn.end();
    }
    }
    });
    
    /**
     * @swagger
     * /companies/{id}:
     *  patch:
     *      tags:
     *         - Patch Operation
     *      description: patch option  where using the the id of company to modify the city name
     *      parameters:
     *          - name: id
     *            description: id to update by
     *            in: path
     *            type: integer
     *            required: true
     *          - name: reqBody
     *            description: request body
     *            in: body
     *            schema: 
     *              type: object
     *              properties:
     *                  city:
     *                      type: string
     *              required:
     *                  -city
     *      responses:
     *          '200':
     *              description: patch done
     */
    
    app.patch('/companies/:id',async(req,res)=>{
    var conn;
    try{
    console.log(req.body.city);
    console.log(req.params.id);
    const id = req.params.id;
            const bodyval = req.body.city;
            conn = await pool.getConnection();
            rows = await conn.query("update company set COMPANY_CITY = ? where COMPANY_ID = ?",[bodyval,id]);
            console.log(rows);
            res.send(rows);
    }
    catch(e){
    throw e;
    }finally{
    if(conn){
    return conn.end();
    }
    }
    });
app.listen(port, () => {
    console.log('API served at http://localhost:'+port);
});
