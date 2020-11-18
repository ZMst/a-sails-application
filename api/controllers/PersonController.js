/**
 * PersonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  

    // action - create
    create: async function (req, res) {

    if (req.method == "GET") return res.view('person/create');

    if (!req.body.Person)
            return res.badRequest("Data not received.");
    
    await Person.create(req.body.person);

    return res.ok("Successfully created!");
},

    // json function
json: async function (req, res) {

    var everyones = await Person.find();

    return res.json(everyones);
},

// action - list
list: async function (req, res) {

    var everyones = await Person.find();
    
    return res.view('person/list', { persons: everyones });
},


// action - read
read: async function (req, res) {

    var thatPerson = await Person.findOne(req.params.id);

    if (!thatPerson) return res.notFound();

    return res.view('person/read', { person: thatPerson });
},

// action - delete 
delete: async function (req, res) {

    if (req.method == "GET") return res.forbidden();

        var deletedPerson = await Person.destroyOne(req.params.id).fetch();

        if (deletedPerson.length == 0) return res.notFound(); 
},

// action - update
update: async function (req, res) {

    if (req.method == "GET") {

        var thatPerson = await Person.findOne(req.params.id);

        if (!thatPerson) return res.notFound();

        return res.view('person/update', { person: thatPerson });
        
    } else {
        if(!req.body.Person)
        return res.badRequest("Data not received.");
        else
        {
    
        var updatedPerson = await Person.updateOne(req.params.id).set({
            taste: req.body.Person.taste,
            price: req.body.Person.price,
            number: req.body.Person.number,
        }).fetch();

        if (thatPerson.length==0) return res.notFound();

        return res.ok("Updated");
        }
    }
},

// search function
search: async function (req, res) {
    
    var whereClause = {};
    
    if (req.query.name) whereClause.name = { contains: req.query.name };
    
    var parsedAge = parseInt(req.query.age);
    if (!isNaN(parsedAge)) whereClause.age = parsedAge;
    
    var thosePersons = await Person.find({
    	where: whereClause,
    	sort: 'name'
    });
    
    return res.view('person/list', { persons: thosePersons });
},

// action - paginate
paginate: async function (req, res) {

    req.query = req.query || {};
        const qtaste = req.query.taste || "";
        const qnumber = parseInt(req.query.number);

    var somePersons = await Person.find({
        where:{
            taste:{contains:qtaste},
            number:{'<=': qnumber},
        }
    });

    var count = await Person.count();

    return res.view('person/paginate', { persons: somePersons, numOfRecords: count });
},

};

