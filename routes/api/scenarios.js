const express = require('express');
const router = express.Router();
const scenariosController = require('../../controllers/scenariosController');
const ROLES_LIST = require('../../config/rolesList');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(scenariosController.getAllScenarios)
    // .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), scenariosController.createScenario)
    // .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), scenariosController.updateScenario)
    .post(scenariosController.createScenario)
    .put(scenariosController.updateScenario)
;

router.route('/:id')
    .get(scenariosController.getScenario)
    // .delete(verifyRoles(ROLES_LIST.Admin), scenariosController.deleteScenario)
    .delete(scenariosController.deleteScenario)
;

module.exports = router;