const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken"); //In this syntax we should implement the cookie like (In this syntax the passing accestoken using Header but correct way is using cookie try to search and implement it)

  if (!accessToken) return res.json({ error: "User not logged in !!!" });

  try {
    const validToken = verify(accessToken, "importantSecret");
    req.user = validToken;
    
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
