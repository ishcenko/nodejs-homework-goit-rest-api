const express = require("express");
const router = express.Router();
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const joiSchemas = require("../../models/contact");
const ctrl = require("../../controllers/contactsCtrl");

router.get("/", authenticate, ctrl.listContacts);

router.get("/:contactId", isValidId, ctrl.getContactById);

router.post(
  "/",
  authenticate,
  validateBody(joiSchemas.newContactSchema),
  ctrl.addContact
);

router.delete("/:contactId", authenticate, isValidId, ctrl.removeContactById);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(joiSchemas.existingContactSchema),
  ctrl.updateContactById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(joiSchemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);
module.exports = router;
