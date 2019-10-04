const express = require("express");
const router = express.Router();

const ProjectDb = require("./data/helpers/projectModel");
const actionDb = require("./data/helpers/actionModel");

//Fetching the whole list of projects
router.get("/", (req, res) => {
  ProjectDb.get()
    .then(project => {
      res.send(project);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Error fetching project list" });
    });
});

//Fetch project by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  ProjectDb.get(id)
    .then(project => {
      if (!project) {
        res
          .status(404)
          .json({ message: "There is no project associated to this id" });
      } else {
        res.send(project);
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Error fetching project by id" });
    });
});

//Fetch action by project ID
router.get("/:id/action", (req, res) => {
  const projectId = req.params.id;
  ProjectDb.getProjectActions(projectId)
    .then(action => {
      if (!action.length > 0) {
        res
          .status(400)
          .json({ message: "There is no action associated to this id" });
      } else {
        res.send(action);
      }
    })
    .catch(error => {
      res
        .status(500)
        .jsoin({ errorMessage: "Error fetching action by project ID" });
    });
});

//Posting a project
router.post("/", (req, res) => {
  const postBody = req.body;
  if (!postBody.name || !postBody.description) {
    res.status(400).json({ message: "Name and Description are required" });
  } else {
    ProjectDb.insert(postBody)
      .then(project => {
        res.status(201).json(postBody);
      })
      .catch(error => {
        res.status(500).json({ errorMessage: "Error posting project" });
      });
  }
});

//Posting an action to a project
// router.post("/:id/", validateProjectId, (req, res) => {
//   const newAction = req.body;
//   if(!newAction.)
//   actionDb
//     .insert(newAction)
//     .then(action => {
//       res.status(201).json(newAction);
//     })
//     .catch(error => {
//       res.status(500).json({ errorMessage: "Error posting new action" });
//     });
// });

//Deleting a project
router.delete("/:id", (req, res) => {
  const deleteId = req.params.id;
  ProjectDb.remove(deleteId)
    .then(project => {
      if (!project) {
        res
          .status(404)
          .json({ message: "There is no project associated with this id" });
      } else {
        res.json(project);
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Error deleting post" });
    });
});

//Edit project by id
router.put("/:id", (req, res) => {
  const updateId = req.params.id;
  const updateBody = req.body;
  if (!updateBody.name || !updateBody.description) {
    res
      .status(400)
      .json({ message: "Name and Description are required for updating" });
  } else {
    ProjectDb.update(updateId, updateBody)
      .then(project => {
        if (!project) {
          res.status(404).json({
            message: "There is no project associated with this id for updating",
          });
        } else {
          res.status(200).json({ message: "Project is updated" });
        }
      })
      .catch(error => {
        res.status(500).json({ errorMessage: "Error updating proejct" });
      });
  }
});

//custom middleware

//check for project id
// function validateProjectId(req, res, next) {
//   const projectIdforAction = req.params.deleteId;
//   ProjectDb.get(projectIdforAction)
//     .then(project => {
//       if (!project) {
//         res
//           .status(404)
//           .json({ Message: "There is no proejct associated with this id" });
//       } else {
//         next();
//       }
//     })
//     .catch(error => {
//       res.status(500).json({ errorMessage: "Error validating Project ID" });
//     });
// }
module.exports = router;
