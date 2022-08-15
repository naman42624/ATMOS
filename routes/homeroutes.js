const { Router } = require('express');
const homeController = require("../controllers/homecontroller");

const homeRouter = Router();

homeRouter.get("/home",homeController.get_home);


module.exports = homeRouter;