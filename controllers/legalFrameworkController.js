exports.getLegalFramework = (req, res) => {
    res.render("legalFramework", { user: req.user });
};