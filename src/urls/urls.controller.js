const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

function hasUrl(req, res, next) {
  const { data: { href } = {} } = req.body;

  if (href === undefined) {
    return next({
      status: 400,
      message: "A 'href' property is required.",
    });
  } else {
    res.locals.href = href;
   return next();
  }
}

function urlExists(req, res, next) {
    const { urlId } = req.params;
    const foundUrl = urls.find((url) => url.id === Number(urlId));
    if(foundUrl === undefined) {
        next({
            status: 404,
            message: `Url id not found: ${urlId}`
        })
    }
    res.locals.urlData = { urlId, foundUrl };
    next();
}

function list(req, res, next) {
  res.json({ data: urls });
}

function create(req, res, next) {
  const newUrl = {
    id: urls.length + 1,
    href: res.locals.href,
  };
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}

function read(req, res, next) {
  // we are saving a use object, what url and when it happened
  const newUse = {
    id: uses.length + 1,
    urlId: Number(res.locals.urlData.urlId),
    time: Date.now()
  }
  uses.push(newUse);
  // updating the uses for this url
  res.json({data:res.locals.urlData.foundUrl})
}

function update(req, res, next) {
    // remove the note at the index in the array
    res.locals.urlData.foundUrl["href"] = res.locals.href;
    res.json({data:res.locals.urlData.foundUrl});
}

module.exports = {
  list,
  create: [hasUrl, create],
  read: [urlExists, read],
  update: [hasUrl,urlExists,update],
  hasUrl,
  urlExists,
};
