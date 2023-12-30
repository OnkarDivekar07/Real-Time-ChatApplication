exports.mainpage = (req, res, next) => {
  res.sendFile("index.html", { root: "View" });
};

exports.errorpage = (req, res, next) => {
  res.sendFile("errorpage.html", { root: "View" });
};
