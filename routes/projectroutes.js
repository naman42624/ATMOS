const { Router } = require('express');
const projectcontroller = require('../controllers/projectcontroller');

const projectRouter = Router();

projectRouter.get("/projects", projectcontroller.get_project);
projectRouter.get("/add-project", projectcontroller.get_add_project);
projectRouter.post("/add-project", projectcontroller.post_add_project);
projectRouter.get("/delete-project", projectcontroller.get_redirected_to_project);
projectRouter.post("/delete-project", projectcontroller.post_delete_project);
projectRouter.get("/add-favorite-project/:projectIDURL", projectcontroller.get_add_favorite_project);

module.exports = projectRouter;