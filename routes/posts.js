const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.json({
    post: {
      title: "My first post",
      description: "something inside the first post",
    },
  });
});

module.exports = router;
