// const isAdmin = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(403).send("Access denied");
//     }
  
//     const userRole = authHeader.split(" ")[1]; // Берем роль после "Bearer "
//     if (userRole === "admin") {
//       next();
//     } else {
//       res.status(403).send("Access denied");
//     }
//   };
  
//   module.exports = isAdmin;

const isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).send("Access denied: No token provided");
    }
  
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(403).send("Access denied: Invalid token format");
    }
  
    const userRole = tokenParts[1]; // Роль передается в виде Bearer role
    if (userRole !== "admin") {
      return res.status(403).send("Access denied: You are not admin");
    }
  
    next();
  };

  module.exports = isAdmin;
  