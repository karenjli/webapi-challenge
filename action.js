const express = require("express");
const router = express.Router();
const actionDb = require("./data/helpers/actionModel");
const projectDb = require("./data/helpers/projectModel");

router.get("/", (req, res) => {
  actionDb
    .get()
    .then(action => {
      res.send(action);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Error fetching list of action" });
    });
});

router.get("/:id", (req, res) => {
  const actionId = req.params.id;
  actionDb
    .get(actionId)
    .then(action => {
      if (!action) {
        res
          .status(404)
          .json({ message: "There is no action associated to this ID" });
      } else {
        res.send(action);
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Error fetching action by id" });
    });
});

router.post("/", validateProjectId, validateAction, (req, res) => {
  const newAction = req.body;
  projectDb
    .get(newAction.project_id)
    .then(project => {
      if (!project) {
        res
          .status(400)
          .json({ message: "There is no project associated with this ID" });
      } else {
        actionDb
          .insert(req.body)
          .then(action => {
            res.status(201).json(action);
          })
          .catch(error => {
            res.status(500).json({ errorMessage: "Error posting action" });
          });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "Error validating project Id for new action" });
    });
});

router.delete("/:id", (req, res) => {
  const deleteActionId = req.params.id;
  actionDb.remove(deleteActionId).then(action => {
    if (!action) {
      res
        .status(404)
        .json({ message: "There is no action associated to this ID" });
    } else {
      res.json(action);
    }
  });
});

router.put("/:id", validateAction, (req, res) => {
  const updateActionBody = req.body;
  const updateId = req.params.id;
  projectDb
    .get(updateActionBody.project_id)
    .then(project => {
      if (!project) {
        res.status(404).json({ message: "Project Id is invalid" });
      } else {
        actionDb
          .update(updateId, updateActionBody)
          .then(action => {
            res.status(200).json({ message: "Action is updated" });
          })
          .catch(error => {
            res.status(500).json({ message: "Error updating action" });
          });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "Error validating project Id with server" });
    });
});

//custom middleware

//middleware for checking valid action items
function validateAction(req, res, next) {
  const newactionBody = req.body;
  if (
    !newactionBody.project_id ||
    !newactionBody.description ||
    !newactionBody.notes
  ) {
    res.status(400).json({
      message:
        "Project ID, Description and Notes are required for posting Actions",
    });
  } else if (newactionBody.description.length > 128) {
    res.status(400).json({ message: "Description limited to 128 characters" });
  } else {
    next();
  }
}

//middleware for checking valid project id
function validateProjectId(req, res, next) {
  const selectprojectId = req.project_id;

  projectDb
    .get(selectprojectId)
    .then(project => {
      if (!project) {
        res
          .status(404)
          .json({ Message: "There is no proejct associated with this id" });
      } else {
        next();
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Error validating Project ID" });
    });
}
module.exports = router;
