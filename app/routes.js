var Food = require('./models/food');

module.exports = function (app) {
    // api ---------------------------------------------------------------------
    // get all foods
    app.get('/api/foods', getFoods);
    // create food and send back all foods after creation
    app.post('/api/foods', createFood);
    // delete a food
    app.delete('/api/foods/:food_id', deleteFood);
    //total price of all items
    app.get('/api/total', totalPrice);


    function getFoods(req, res) {
        // use mongoose to get all foods in the database
        Food.find(function (err, foods) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }
            else {
                console.log(foods);
                res.json(foods); // return all foods in JSON format
            }
        });
    };

    function createFood(req, res) {
            // create a food, information comes from AJAX request from Angular
            Food.create({
                text: req.body.text,
                price: req.body.price,
                done: false
            }, function (err, food) {
                if (err) {
                    res.send(err);
                } else {
                    // get and return all the foods after you create another
                    getFoods(req, res);
                }
            });
        }

    function deleteFood (req, res) {
        Food.remove({
            _id: req.params.food_id
        }, function (err, food) {
            if (err) {
                res.send(err);
            } else {
                getFoods(req, res);
            }
        });
    };

    function totalPrice(req, res) {
        Food.find(function(err, foods) {
            var total = 0;
            if(err) {
                res.send(err);
            } else {
                for(var i in foods) {
                    var food = foods[i];
                    total = total + food.price;
                    console.log(food.price);
                }
                total = Math.round((total + total * 0.075) * 100) / 100;
                var result = {
                    total : total
                }
                res.json(result);
            }
        });

    }

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};