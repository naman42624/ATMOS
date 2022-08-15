const { Router } = require('express');

const admincontroller = require('../controllers/admincontroller');
const adminRouter = Router();
  
adminRouter.get('/delete/:id', admincontroller.deleteUser);
 
module.exports = adminRouter;