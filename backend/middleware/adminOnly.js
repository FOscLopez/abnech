const { admin, initFirebase } = require("../firebase");

initFirebase();

module.exports = async function adminOnly(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.admin) {
      return res.status(403).json({ error: "No admin" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};
