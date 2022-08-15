const { Router } = require('express');
const taskcontroller = require('../controllers/taskcontroller');

const taskRouter = Router();

// taskRouter.get("/task", taskcontroller.get_task);
taskRouter.post('/add-new-task/:sectionURLID', taskcontroller.get_add_new_task);
taskRouter.post('/update-task/:sectionURLID', taskcontroller.get_update_task);
taskRouter.get('/add-section/:projectURLID', taskcontroller.get_add_section );
taskRouter.get('/task/:projectURLID', taskcontroller.get_task);
taskRouter.post('/update-section/:sectionURLID', taskcontroller.post_updated_section_name);
taskRouter.post('/delete-task/:sectionURLID', taskcontroller.post_delete_task);
taskRouter.get('/delete-section/:sectionURLID', taskcontroller.get_delete_section);
taskRouter.get('/overview/:projectURLID', taskcontroller.get_overview);
// taskRouter.get('/add-section-to-right/:sectionURLID', taskcontroller.get_add_section_to_right);
// taskRouter.get('/add-section-to-left/:sectionURLID', taskcontroller.get_add_section_to_left);

module.exports = taskRouter;